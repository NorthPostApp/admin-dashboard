import { AddressRequestContext } from "@/contexts/AddressRequestContextProvider";
import { useContext } from "react";

export function useAddressRequestContext() {
  const context = useContext(AddressRequestContext);
  if (context === undefined)
    throw new Error(
      "useAddressRequestContext hook must be used within AddressRequestContextProvider",
    );
  return context;
}
