import { headers } from "next/headers";
import { auth } from "@vendly/auth";
import Page, { metadata } from "./(m)/page";
import { PostHogProvider, Providers } from "./providers";
import { AppSessionProvider } from "@/contexts/app-session-context";
import { CartProvider } from "@/contexts/cart-context";

export const dynamic = "force-dynamic";

export { metadata };

export default async function HomePage() {
  const headerList = await headers();
  const session = await auth.api.getSession({ headers: headerList });

  return (
    <PostHogProvider>
      <Providers>
        <AppSessionProvider session={session}>
          <CartProvider>
            <Page />
          </CartProvider>
        </AppSessionProvider>
      </Providers>
    </PostHogProvider>
  );
}
