import { Outlet } from "react-router";
import AppContextProvider from "@/contexts/AppContextProvider";

export default function RootLayout() {
  return (
    <AppContextProvider>
      <Outlet />
    </AppContextProvider>
  );
}
