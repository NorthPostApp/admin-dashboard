import { Outlet } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppContextProvider from "@/contexts/AppContextProvider";
import AppSidebar, { SidebarProvider } from "@/components/sidebar/AppSidebar";
import AppHeader from "@/components/header/AppHeader";
import { Toaster } from "@/components/ui/sonner";

import "./AppLayout.css";

const queryClient = new QueryClient();

export default function AppLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContextProvider>
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
      </AppContextProvider>
    </QueryClientProvider>
  );
}
