import { InstagramMediaResponse, InstagramMediaItem } from "../models/instagram-models";

export class InstagramMediaService {
    private readonly GRAPH_API_URL = "https://graph.instagram.com/v19.0"; // Using latest version

    /**
     * Fetch user's media from Instagram Graph API
     */
    async fetchUserMedia(
        accessToken: string,
        limit: number = 20,
        after?: string
    ): Promise<InstagramMediaResponse> {
        console.log(`[InstagramMediaService] Fetching media (limit: ${limit})`);

        const fields = "id,media_type,media_url,permalink,caption,timestamp,username,thumbnail_url";
        const url = new URL(`${this.GRAPH_API_URL}/me/media`);
        url.searchParams.append("fields", fields);
        url.searchParams.append("access_token", accessToken);
        url.searchParams.append("limit", limit.toString());

        if (after) {
            url.searchParams.append("after", after);
        }

        try {
            const response = await fetch(url.toString());

            if (!response.ok) {
                const error = await response.json() as any;
                console.error("[InstagramMediaService] API Error:", error);
                throw new Error(error.error?.message || "Failed to fetch Instagram media");
            }

            const data = await response.json();
            return data as InstagramMediaResponse;
        } catch (error) {
            console.error("[InstagramMediaService] Network error:", error);
            throw new Error("Failed to connect to Instagram API");
        }
    }

    /**
     * Fetch specific media details
     */
    async fetchMediaDetails(
        mediaId: string,
        accessToken: string
    ): Promise<InstagramMediaItem> {
        const fields = "id,media_type,media_url,permalink,caption,timestamp,username,children{media_type,media_url,thumbnail_url}";
        const url = `${this.GRAPH_API_URL}/${mediaId}?fields=${fields}&access_token=${accessToken}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Failed to fetch media details");
        }

        return (await response.json()) as InstagramMediaItem;
    }
}

export const instagramMediaService = new InstagramMediaService();
