import AppSidebar, { SidebarProvider } from "@/components/sidebar/AppSidebar";
import AppContextProvider from "@/contexts/AppContextProvider";
import AppHeader from "@/components/header/AppHeader";
import { Outlet } from "react-router";

export default function AppLayout() {
  return (
    <AppContextProvider>
      <SidebarProvider>
        <nav>
          <AppSidebar />
        </nav>
        <main className="flex flex-col w-full">
          <AppHeader />
          <div className="flex-1 w-full text-center">
            <Outlet />
          </div>
        </main>
      </SidebarProvider>
    </AppContextProvider>
  );
}
