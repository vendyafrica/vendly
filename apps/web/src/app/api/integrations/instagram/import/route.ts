import { auth } from "@vendly/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@vendly/db/db";
import { tenantMemberships, instagramAccounts, instagramSyncJobs, account, stores } from "@vendly/db/schema";
import { eq, and } from "@vendly/db";
import { z } from "zod";
import { parseInstagramCaption } from "@/lib/instagram/parse-caption";

type InstagramMediaChild = {
  id: string | number;
  media_type?: string | null;
  media_url?: string | null;
  thumbnail_url?: string | null;
};

type InstagramMediaItem = {
  id: string | number;
  caption?: string | null;
  media_type?: string | null;
  media_url?: string | null;
  thumbnail_url?: string | null;
  permalink?: string | null;
  children?: { data?: InstagramMediaChild[] | null } | null;
};

const importSchema = z.object({
  storeId: z.string().uuid(),
});

// Helper to create slug
function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 50) + "-" + Math.random().toString(36).substring(2, 6);
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const membership = await db.query.tenantMemberships.findFirst({
      where: eq(tenantMemberships.userId, session.user.id),
    });

    if (!membership) {
      return NextResponse.json({ error: "No tenant found" }, { status: 404 });
    }

    const body = await request.json();
    const { storeId } = importSchema.parse(body);

    const store = await db.query.stores.findFirst({
      where: and(eq(stores.id, storeId), eq(stores.tenantId, membership.tenantId)),
    });

    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    const instagramAuthAccount = await db.query.account.findFirst({
      where: and(eq(account.userId, session.user.id), eq(account.providerId, "instagram")),
    });

    if (!instagramAuthAccount?.accessToken) {
      return NextResponse.json({ error: "Instagram not connected" }, { status: 400 });
    }

    // 1. Fetch User Info for Profile Picture
    const userRes = await fetch(
      `https://graph.instagram.com/me?fields=id,username,profile_picture_url&access_token=${instagramAuthAccount.accessToken}`
    );
    const userData = await userRes.json();

    // 2. Fetch Media
    // Using 'children' field for carousel items
    const mediaRes = await fetch(
      `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,children{id,media_type,media_url,thumbnail_url}&access_token=${instagramAuthAccount.accessToken}`
    );
    const mediaData = await mediaRes.json();

    if (mediaData.error) {
      throw new Error(mediaData.error.message || "Failed to fetch media");
    }

    const mediaItems: InstagramMediaItem[] = Array.isArray(mediaData?.data) ? mediaData.data : [];
    // Cap imports to first 50 items to avoid overloading the store
    const limitedMediaItems = mediaItems.slice(0, 50);

    // 3. Update Account with Profile Picture
    const existing = await db.query.instagramAccounts.findFirst({
      where: and(eq(instagramAccounts.tenantId, membership.tenantId), eq(instagramAccounts.userId, session.user.id)),
    });

    const accountValues = {
      tenantId: membership.tenantId,
      userId: session.user.id,
      accountId: instagramAuthAccount.accountId,
      username: userData.username,
      profilePictureUrl: userData.profile_picture_url,
      isActive: true,
      lastSyncedAt: new Date(),
    };

    let igAccount;
    if (existing) {
      [igAccount] = await db
        .update(instagramAccounts)
        .set(accountValues)
        .where(eq(instagramAccounts.id, existing.id))
        .returning();
    } else {
      [igAccount] = await db.insert(instagramAccounts).values(accountValues).returning();
    }

    // 4. Create Sync Job
    const [job] = await db
      .insert(instagramSyncJobs)
      .values({
        tenantId: membership.tenantId,
        accountId: igAccount.id,
        status: "processing",
        mediaFetched: limitedMediaItems.length,
        startedAt: new Date(),
      })
      .returning();

    // 5. Process Media (Inline for simplicity)
    let createdCount = 0;

    const { products, mediaObjects, productMedia } = await import("@vendly/db/schema");

    for (const item of limitedMediaItems) {
      const caption = (item.caption as string | null | undefined) || "";
      const parsed = parseInstagramCaption(caption, store.defaultCurrency);
      const slug = slugify(parsed.productName);

      const [product] = await db
        .insert(products)
        .values({
          tenantId: membership.tenantId,
          storeId: storeId,
          productName: parsed.productName,
          slug: slug,
          description: parsed.description,
          priceAmount: parsed.priceAmount,
          currency: parsed.currency,
          status: "draft",
          source: "instagram",
          sourceId: String(item.id),
          sourceUrl: item.permalink ? String(item.permalink) : null,
          variants: [],
        })
        .returning();

      createdCount++;

      const variantEntries: Array<{ name: string; sourceMediaId: string; mediaObjectId: string; mediaType?: string }> = [];

      if (item.media_type === "CAROUSEL_ALBUM" && Array.isArray(item.children?.data)) {
        let idx = 0;
        for (const child of item.children.data) {
          idx++;
          const childId = String(child.id);
          const childMediaType = String(child.media_type || "IMAGE");
          const childUrl = String(child.media_url || child.thumbnail_url || "");
          if (!childUrl) continue;

          const contentType = childMediaType === "VIDEO" ? "video/mp4" : "image/jpeg";
          const [mediaObj] = await db
            .insert(mediaObjects)
            .values({
              tenantId: membership.tenantId,
              blobUrl: childUrl,
              blobPathname: childId,
              contentType,
              source: "instagram",
              sourceMediaId: childId,
            })
            .returning();

          await db.insert(productMedia).values({
            tenantId: membership.tenantId,
            productId: product.id,
            mediaId: mediaObj.id,
            isFeatured: idx === 1,
            sortOrder: idx - 1,
          });

          variantEntries.push({
            name: `Option ${idx}`,
            sourceMediaId: childId,
            mediaObjectId: mediaObj.id,
            mediaType: childMediaType,
          });
        }
      } else {
        const itemId = String(item.id);
        const itemType = String(item.media_type || "IMAGE");
        const itemUrl = String(item.media_url || item.thumbnail_url || "");
        if (itemUrl) {
          const contentType = itemType === "VIDEO" ? "video/mp4" : "image/jpeg";
          const [mediaObj] = await db
            .insert(mediaObjects)
            .values({
              tenantId: membership.tenantId,
              blobUrl: itemUrl,
              blobPathname: itemId,
              contentType,
              source: "instagram",
              sourceMediaId: itemId,
            })
            .returning();

          await db.insert(productMedia).values({
            tenantId: membership.tenantId,
            productId: product.id,
            mediaId: mediaObj.id,
            isFeatured: true,
            sortOrder: 0,
          });
        }
      }

      if (variantEntries.length) {
        await db
          .update(products)
          .set({ variants: variantEntries, updatedAt: new Date() })
          .where(eq(products.id, product.id));
      }
    }

    // Update Job Status
    await db
      .update(instagramSyncJobs)
      .set({
        status: "completed",
        productsCreated: createdCount,
        completedAt: new Date()
      })
      .where(eq(instagramSyncJobs.id, job.id));

    return NextResponse.json({
      ok: true,
      jobId: job.id,
      message: `Imported ${createdCount} products successfully.`,
    });
  } catch (error: unknown) {
    console.error("Instagram import error:", error);
    const message = error instanceof Error ? error.message : "Import failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
