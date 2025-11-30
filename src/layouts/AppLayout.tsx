import AppSidebar, { SidebarProvider } from "@/components/sidebar/AppSidebar";
import AppContextProvider from "@/contexts/AppContextProvider";
import AppHeader from "@/components/header/AppHeader";

export default function AppLayout() {
  return (
    <AppContextProvider>
      <SidebarProvider>
        <nav>
          <AppSidebar />
        </nav>
        <main className="flex flex-col w-full">
          <AppHeader />
          <div className="flex-1">Body</div>
        </main>
      </SidebarProvider>
    </AppContextProvider>
  );
}
