import { useContext } from "react";
import { AppContext } from "@/contexts/AppContextProvider";

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext hook must be used within AppContextProvider");
  }
  return context;
}
