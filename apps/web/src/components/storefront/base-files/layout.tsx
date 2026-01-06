import { StoreLayout } from "@/components/storefront";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeSlug = process.env.NEXT_PUBLIC_STORE_SLUG || "demo";
  const storeName = process.env.NEXT_PUBLIC_STORE_NAME || "Demo Store";

  return (
    <StoreLayout storeSlug={storeSlug} storeName={storeName}>
      {children}
    </StoreLayout>
  );
}
