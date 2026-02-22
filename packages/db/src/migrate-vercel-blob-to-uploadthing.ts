
import { del } from "@vercel/blob";
import { and, eq, isNull, like, or, sql } from "drizzle-orm";
import { UTApi, UTFile } from "uploadthing/server";

import { db } from "./db";
import { mediaObjects } from "./schema";

type MediaRow = {
  id: string;
  tenantId: string;
  blobUrl: string;
  blobPathname: string;
  contentType: string;
};

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    const envPathHint = "../../.env (loaded by packages/db/src/env.ts)";
    const present = Object.prototype.hasOwnProperty.call(process.env, name);
    throw new Error(
      `Missing required env var: ${name}. ` +
        `cwd=${process.cwd()} envPath=${envPathHint} present=${present}`
    );
  }
  return value;
}

function parseArgs() {
  const limitArg = process.argv.find((a) => a.startsWith("--limit="));
  const offsetArg = process.argv.find((a) => a.startsWith("--offset="));
  const dryRun = process.argv.includes("--dry-run");
  const skipMissing = process.argv.includes("--skip-missing");
  const syncFromUploadThing = process.argv.includes("--sync-from-uploadthing");

  return {
    limit: limitArg ? Number.parseInt(limitArg.split("=")[1] ?? "", 10) : undefined,
    offset: offsetArg ? Number.parseInt(offsetArg.split("=")[1] ?? "", 10) : 0,
    dryRun,
    skipMissing,
    syncFromUploadThing,
  };
}

async function buildUploadThingMap(utapi: UTApi) {
  const pageSize = 1000;
  let offset = 0;
  const map = new Map<string, { key: string }>();

  while (true) {
    const res = await utapi.listFiles({ limit: pageSize, offset });
    if (!res || !res.files) break;

    for (const file of res.files) {
      const customId = (file as any).customId as string | undefined;
      const key = (file as any).key as string | undefined;
      if (customId && key) {
        map.set(customId, { key });
      }
    }

    if (!res.hasMore) break;
    offset += pageSize;
  }

  return map;
}

async function fetchAsFile(url: string, filename: string, contentType?: string) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch (${res.status}) ${url}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  const ct = contentType ?? res.headers.get("content-type") ?? "application/octet-stream";

  return {
    bytes: arrayBuffer.byteLength,
    type: ct,
    data: new Uint8Array(arrayBuffer),
    filename,
  };
}

function filenameFromPathname(pathname: string) {
  const last = pathname.split("/").filter(Boolean).pop();
  return last ?? `file-${Date.now()}`;
}

async function main() {
  const { limit, offset, dryRun, skipMissing, syncFromUploadThing } = parseArgs();

  if (!dryRun) {
    // UploadThing server API
    requireEnv("UPLOADTHING_TOKEN");

    // Only need blob token when actually deleting Vercel blobs (non-sync mode)
    if (!syncFromUploadThing) {
      requireEnv("BLOB_READ_WRITE_TOKEN");
    }
  }

  const utapi = new UTApi();

  const uploadThingMap = syncFromUploadThing ? await buildUploadThingMap(utapi) : null;

  const whereClause = and(
    like(mediaObjects.blobUrl, "%blob.vercel-storage.com%"),
    or(
      isNull(mediaObjects.sourceMetadata),
      sql`NOT (${mediaObjects.sourceMetadata}::text ILIKE '%"migratedToUploadThing":true%')`
    )
  );

  const rows = await db
    .select({
      id: mediaObjects.id,
      tenantId: mediaObjects.tenantId,
      blobUrl: mediaObjects.blobUrl,
      blobPathname: mediaObjects.blobPathname,
      contentType: mediaObjects.contentType,
    })
    .from(mediaObjects)
    .where(whereClause)
    .orderBy(mediaObjects.createdAt)
    .limit(limit ?? 10_000)
    .offset(offset);

  console.log(
    JSON.stringify(
      {
        total: rows.length,
        offset,
        limit: limit ?? null,
        dryRun,
      },
      null,
      2
    )
  );

  let migrated = 0;
  let skipped = 0;
  let missing = 0;
  let failed = 0;

  for (const row of rows as MediaRow[]) {
    const oldUrl = row.blobUrl;
    const oldPathname = row.blobPathname;

    if (!oldUrl.includes("blob.vercel-storage.com")) {
      skipped++;
      continue;
    }

    const filename = filenameFromPathname(oldPathname);

    try {
      console.log(`\n[MIGRATE] ${row.id} ${oldUrl}`);

      // Sync-from-uploadthing mode: use UploadThing metadata, no Vercel fetch
      if (syncFromUploadThing) {
        const match = uploadThingMap?.get(oldPathname);
        if (!match) {
          if (skipMissing) {
            missing++;
            console.warn(`[MISSING_UT] ${row.id} ${oldPathname} -> no UploadThing file with customId`);
            continue;
          }
          throw new Error(`No UploadThing file found for customId=${oldPathname}`);
        }

        if (dryRun) {
          console.log(
            JSON.stringify(
              {
                id: row.id,
                tenantId: row.tenantId,
                customId: oldPathname,
                uploadThingKey: match.key,
                note: "dry-run sync-from-uploadthing",
              },
              null,
              2
            )
          );
          skipped++;
          continue;
        }

        const signed = await utapi.getSignedURL(match.key);
        const ufsUrl = (signed as any).ufsUrl ?? (signed as any).url ?? null;
        if (!ufsUrl) {
          throw new Error(`Failed to get signed URL for key=${match.key}`);
        }

        await db
          .update(mediaObjects)
          .set({
            blobUrl: ufsUrl,
            blobPathname: match.key,
            sourceMetadata: {
              migratedToUploadThing: true,
              migratedAt: new Date().toISOString(),
              vercelBlob: {
                url: oldUrl,
                pathname: oldPathname,
              },
              uploadThing: {
                key: match.key,
                ufsUrl,
                resolvedFrom: "uploadthing:listFiles",
              },
            } as any,
            updatedAt: new Date(),
          })
          .where(eq(mediaObjects.id, row.id));

        migrated++;
        console.log(`[OK][SYNC] ${row.id} -> ${ufsUrl} (key=${match.key})`);
        continue;
      }

      // Original mode: fetch from Vercel, upload to UploadThing
      const fetched = await fetchAsFile(oldUrl, filename, row.contentType);

      const file = new UTFile(
        [fetched.data],
        fetched.filename,
        {
          type: fetched.type,
          lastModified: Date.now(),
          customId: oldPathname,
        } as any
      );

      if (dryRun) {
        console.log(
          JSON.stringify(
            {
              id: row.id,
              tenantId: row.tenantId,
              bytes: fetched.bytes,
              contentType: fetched.type,
              filename: fetched.filename,
              customId: oldPathname,
            },
            null,
            2
          )
        );
        skipped++;
        continue;
      }

      const uploaded = await utapi.uploadFiles(file, {
        acl: "public-read",
        contentDisposition: "inline",
      });

      const normalized = Array.isArray(uploaded) ? uploaded[0] : uploaded;
      if (!normalized || (normalized as any).error || !(normalized as any).data) {
        throw new Error(`UploadThing upload failed: ${JSON.stringify(uploaded)}`);
      }

      const data = (normalized as any).data as { key: string; ufsUrl: string };

      await db
        .update(mediaObjects)
        .set({
          blobUrl: data.ufsUrl,
          blobPathname: data.key,
          sourceMetadata: {
            migratedToUploadThing: true,
            migratedAt: new Date().toISOString(),
            vercelBlob: {
              url: oldUrl,
              pathname: oldPathname,
            },
            uploadThing: {
              key: data.key,
              ufsUrl: data.ufsUrl,
            },
          } as any,
          updatedAt: new Date(),
        })
        .where(eq(mediaObjects.id, row.id));

      await del([oldUrl]);

      migrated++;
      console.log(`[OK] ${row.id} -> ${data.ufsUrl} (key=${data.key})`);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      if (skipMissing && (message.includes("(404)") || message.includes("No UploadThing file"))) {
        missing++;
        console.warn(`[MISSING] ${row.id} ${oldUrl} -> ${message}`);
        continue;
      }

      failed++;
      console.error(`[FAIL] ${row.id}`, err);
    }
  }

  console.log(
    `\nDone. migrated=${migrated} skipped=${skipped} missing=${missing} failed=${failed} total=${rows.length}`
  );

  if (failed > 0) {
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
