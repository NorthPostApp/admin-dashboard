import { useContext } from "react";
import { AddressDataContext } from "@/contexts/AddressDataContextProvider";

export function useAddressDataContext() {
  const context = useContext(AddressDataContext);
  if (context === undefined) {
    throw new Error(
      "useAddressDataContext must be used within AddressDataContextProvider",
    );
  }
  return context;
}
