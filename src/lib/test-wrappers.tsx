import { render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppContextProvider from "@/contexts/AppContextProvider";
import { SidebarProvider } from "@/components/ui/sidebar";
import NewAddressContextProvider from "@/contexts/NewAddressContextProvider";
import AddressDataContextProvider from "@/contexts/AddressDataContextProvider";

export function renderWithProviders(children: React.ReactNode) {
  const AddressProviders = ({ children }: { children: React.ReactNode }) => {
    return (
      <NewAddressContextProvider>
        <AddressDataContextProvider>{children}</AddressDataContextProvider>
      </NewAddressContextProvider>
    );
  };

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
        <AddressProviders>
          <SidebarProvider>{children}</SidebarProvider>
        </AddressProviders>
      </AppContextProvider>
    </QueryClientProvider>,
  );
}
