import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router/dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { router } from "./routes";
import { Toaster } from "@/components/ui/sonner";
import AppContextProvider from "@/contexts/AppContextProvider";
import "./index.css";
import "./i18n/config";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppContextProvider>
        <RouterProvider router={router} />
        <Toaster position="bottom-right" />
      </AppContextProvider>
    </QueryClientProvider>
  </StrictMode>
);
