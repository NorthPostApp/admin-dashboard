import { useContext } from "react";
import { AddressContext } from "@/contexts/AddressContextProvider";

export function useAddressContext() {
  const context = useContext(AddressContext);
  if (context === undefined) {
    throw new Error("useAddressContext hook must be used within AddressContextProvider");
  }
  return context;
}
