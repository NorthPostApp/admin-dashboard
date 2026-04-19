import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router/dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { router } from "./routes";
import { queryClient } from "@/lib/queryClient";
import AppContextProvider from "@/contexts/AppContextProvider";
import { Toaster } from "@/components/ui/sonner";
import "./index.css";
import "./i18n/config";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppContextProvider>
        <RouterProvider router={router} />
        <Toaster position="bottom-right" />
      </AppContextProvider>
    </QueryClientProvider>
  </StrictMode>,
);
