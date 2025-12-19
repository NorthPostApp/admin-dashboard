import { Outlet } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppContextProvider from "@/contexts/AppContextProvider";
import AppSidebar, { SidebarProvider } from "@/components/sidebar/AppSidebar";
import AppHeader from "@/components/header/AppHeader";
import { Toaster } from "@/components/ui/sonner";

const queryClient = new QueryClient();

export default function AppLayout() {
  return (
    <QueryClientProvider client={queryClient}>
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
            <Toaster position="bottom-right" />
          </main>
        </SidebarProvider>
      </AppContextProvider>
    </QueryClientProvider>
  );
}
