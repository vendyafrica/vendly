"use client";

import { PlasmicCanvasHost } from "@plasmicapp/loader-nextjs";
import { PLASMIC } from "@/lib/plasmic-init";

/**
 * Plasmic Host Page
 * 
 * This page is used by Plasmic Studio to connect to your app and render
 * your custom code components. It should NOT be visited by end users.
 * 
 * To configure:
 * 1. Start your dev server: pnpm dev
 * 2. Open your Plasmic project in Studio
 * 3. Go to Settings > Configure Project
 * 4. Set the host URL to: http://localhost:3000/plasmic-host
 * 5. Refresh the Studio - your custom components will appear in the insert menu
 * 
 * For production, update the host URL to: https://yourdomain.com/plasmic-host
 */
export default function PlasmicHost() {
    return PLASMIC && <PlasmicCanvasHost />;
}
