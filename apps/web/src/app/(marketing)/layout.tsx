import type { Metadata } from "next";
import NavBar from "@/app/(marketing)/components/NavBar";
import Footer from "@/app/(marketing)/components/Footer";

export const metadata: Metadata = {
  title: "Vendly - Launch Your Online Store in Minutes",
  description:
    "The easiest way for African social sellers to build professional online stores. Free to start, payments and delivery built-in.",
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
