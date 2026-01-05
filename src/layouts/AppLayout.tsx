import { Outlet } from "react-router";
import AddressContextProvider from "@/contexts/AddressContextProvider";
import AppSidebar, { SidebarProvider } from "@/components/sidebar/AppSidebar";
import AppHeader from "@/components/header/AppHeader";
import { Toaster } from "@/components/ui/sonner";
import "./AppLayout.css";

export default function AppLayout() {
  return (
    <AddressContextProvider>
      <SidebarProvider>
        <nav>
          <AppSidebar />
        </nav>
        <main className="applayout-main">
          <AppHeader />
          <div className="applayout-body__outer">
            <div className="applayout-body__inner">
              <Outlet />
            </div>
          </div>
          <Toaster position="bottom-right" />
        </main>
      </SidebarProvider>
    </AddressContextProvider>
  );
}
