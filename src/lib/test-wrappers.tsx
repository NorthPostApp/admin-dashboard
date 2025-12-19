import { render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppContextProvider from "@/contexts/AppContextProvider";
import { SidebarProvider } from "@/components/ui/sidebar";

export function renderWithProviders(children: React.ReactNode) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return render(
    <AppContextProvider>
      <QueryClientProvider client={queryClient}>
        <SidebarProvider>{children}</SidebarProvider>
      </QueryClientProvider>
    </AppContextProvider>
  );
}
