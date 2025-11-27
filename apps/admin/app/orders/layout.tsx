import { SidebarProvider, SidebarInset } from "@vendly/ui/components/sidebar";
import { AppSidebar } from "../dashboard/components/sidebar";
import Header from "../dashboard/components/header";

export default function OrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />

      {/* SidebarInset handles the remaining width next to sidebar */}
      <SidebarInset className="flex flex-col h-screen overflow-hidden">
        {/* Header stays at the top */}
        <Header />

        {/* Main takes remaining height and scrolls internally */}
        <main className="flex-1 overflow-y-auto bg-muted p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}