import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContextProvider";

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext hook must be used within AuthContextProvider");
  }
  return context;
}
