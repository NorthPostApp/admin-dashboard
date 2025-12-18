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
        <main className="relative flex flex-col w-full h-svh">
          <AppHeader />
          <div className="flex-1 flex w-full text-center max-h-full overflow-y-auto">
            <Outlet />
          </div>
        </main>
      </SidebarProvider>
    </AppContextProvider>
  );
}
