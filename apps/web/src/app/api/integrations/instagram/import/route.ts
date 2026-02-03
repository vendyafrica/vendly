import { auth } from "@vendly/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@vendly/db/db";
import { tenantMemberships, instagramAccounts, instagramSyncJobs, account } from "@vendly/db/schema";
import { eq, and } from "@vendly/db";
import { z } from "zod";

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

    const mediaItems = mediaData.data || [];

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
        mediaFetched: mediaItems.length,
        startedAt: new Date(),
      })
      .returning();

    // 5. Process Media (Inline for simplicity)
    let createdCount = 0;

    await db.transaction(async (tx) => {
      // Import Media Objects, Products, ProductVariants, ProductMedia
      // Dynamic import to avoid circular dep issues if any, but regular import is fine here
      // We need to import tables to use in transaction. imported at top.
      const { products, productVariants, mediaObjects, productMedia } = await import("@vendly/db/schema");

      for (const item of mediaItems) {
        const caption = item.caption || "Instagram Product";
        const slug = slugify(caption);
        const price = 0; // Default price

        // Create Product
        const [product] = await tx
          .insert(products)
          .values({
            tenantId: membership.tenantId,
            storeId: storeId,
            productName: caption.slice(0, 100),
            slug: slug,
            description: item.caption,
            priceAmount: price,
            currency: "KES",
            status: "draft", // Import as draft
            source: "instagram",
            sourceId: item.id,
            sourceUrl: item.permalink,
            hasContentVariants: item.media_type === "CAROUSEL_ALBUM",
          })
          .returning();

        createdCount++;

        // Process Content (Variants or Single Media)
        if (item.media_type === "CAROUSEL_ALBUM" && item.children?.data) {
          // Create Variants for each child
          for (const child of item.children.data) {
            const [variant] = await tx
              .insert(productVariants)
              .values({
                tenantId: membership.tenantId,
                productId: product.id,
                variantName: "Option", // Generic name, maybe use index
                priceAmount: price,
              })
              .returning();

            // Create Media Object
            const [mediaObj] = await tx.insert(mediaObjects).values({
              tenantId: membership.tenantId,
              url: child.media_url,
              key: child.id, // Using IG ID as key proxy
              mimeType: child.media_type === "VIDEO" ? "video/mp4" : "image/jpeg",
              fileSize: 0,
            }).returning();

            // Link Media to Variant and Product
            await tx.insert(productMedia).values({
              tenantId: membership.tenantId,
              productId: product.id,
              variantId: variant.id,
              mediaId: mediaObj.id,
              isFeatured: false,
            });
          }
        } else {
          // Single Image/Video
          // Create Default Variant
          const [variant] = await tx
            .insert(productVariants)
            .values({
              tenantId: membership.tenantId,
              productId: product.id,
              variantName: "Default",
              priceAmount: price,
            })
            .returning();

          // Create Media Object
          const [mediaObj] = await tx.insert(mediaObjects).values({
            tenantId: membership.tenantId,
            url: item.media_url,
            key: item.id,
            mimeType: item.media_type === "VIDEO" ? "video/mp4" : "image/jpeg",
            fileSize: 0,
          }).returning();

          // Link Media to Product (and Variant)
          await tx.insert(productMedia).values({
            tenantId: membership.tenantId,
            productId: product.id,
            variantId: variant.id,
            mediaId: mediaObj.id,
            isFeatured: true,
          });
        }
      }
    });

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
  } catch (error: any) {
    console.error("Instagram import error:", error);
    return NextResponse.json({ error: error.message || "Import failed" }, { status: 500 });
  }
}
