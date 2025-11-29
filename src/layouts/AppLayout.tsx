import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import RegionProvider from "@/contexts/RegionContext";

export default function AppLayout() {
  return (
    <RegionProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarTrigger />
      </SidebarProvider>
    </RegionProvider>
  );
}
