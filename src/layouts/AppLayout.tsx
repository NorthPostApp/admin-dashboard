import { Outlet } from "react-router";
import NewAddressContextProvider from "@/contexts/NewAddressContextProvider";
import AddressDataContextProvider from "@/contexts/AddressDataContextProvider";
import AppSidebar, { SidebarProvider } from "@/components/sidebar/AppSidebar";
import AppHeader from "@/components/header/AppHeader";
import "./AppLayout.css";

export default function AppLayout() {
  return (
    <AddressDataContextProvider>
      <NewAddressContextProvider>
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
          </main>
        </SidebarProvider>
      </NewAddressContextProvider>
    </AddressDataContextProvider>
  );
}
