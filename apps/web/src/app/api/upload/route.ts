import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { auth } from "@vendly/auth";
import { headers } from "next/headers";
import { getTenantMembership } from "@/lib/services/tenant-membership";

export async function POST(request: Request): Promise<NextResponse> {
    try {
        const body = (await request.json()) as HandleUploadBody;

        // Perform authentication
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
            console.error("/api/upload unauthorized: no session user");
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Fetch tenant membership
        // Note: For now we assume single tenant context per request or default first tenant.
        // Ideally the request headers might have x-tenant-id, but handleUpload from client doesn't easily pass custom headers to this route
        // unless we proxy. However, we can trust the session's tenant membership.
        // If a user has multiple tenants, we need to know WHICH one they are uploading to.
        // The pathname SHOULD contain the tenantId. We verify the user is a member of that tenant.

        const jsonResponse = await handleUpload({
            body,
            request,
            onBeforeGenerateToken: async (pathname) => {
                const match = pathname.match(/^tenants\/([^/]+)\//);
                if (!match) {
                    throw new Error("Invalid path format. Must be tenants/{tenantId}/...");
                }

                const requestedTenantId = match[1];

                // Verify membership
                const membership = await getTenantMembership(session.user.id, {
                    tenantId: requestedTenantId,
                });

                if (!membership) {
                    console.error("/api/upload forbidden", {
                        userId: session.user.id,
                        requestedTenantId,
                        pathname,
                    });
                    throw new Error("Unauthorized: You do not have access to this tenant.");
                }

                // Determine callbackUrl: Prefer env, fallback to request origin
                const callbackUrl = process.env.VERCEL_BLOB_CALLBACK_URL
                    ?? new URL(request.url).origin;

                return {
                    allowedContentTypes: ["image/jpeg", "image/png", "image/gif", "image/webp", "video/mp4", "video/webm"],
                    tokenPayload: JSON.stringify({
                        userId: session.user.id,
                        tenantId: requestedTenantId,
                    }),
                    callbackUrl,
                };
            },
            onUploadCompleted: async ({ blob }) => {
                console.log("Upload completed:", blob.url);
                // We could log to DB here if we parse tokenPayload
            },
        });

        return NextResponse.json(jsonResponse);
    } catch (error) {
        console.error("/api/upload failed", error);
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 400 }
        );
    }
}

