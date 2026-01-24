import { render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppContextProvider from "@/contexts/AppContextProvider";
import { SidebarProvider } from "@/components/ui/sidebar";
import AddressContextProvider from "@/contexts/NewAddressContextProvider";

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
    <QueryClientProvider client={queryClient}>
      <AppContextProvider>
        <AddressContextProvider>
          <SidebarProvider>{children}</SidebarProvider>
        </AddressContextProvider>
      </AppContextProvider>
    </QueryClientProvider>,
  );
}
