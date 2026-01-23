import { useContext } from "react";
import { NewAddressContext } from "@/contexts/NewAddressContextProvider";

export function useNewAddressContext() {
  const context = useContext(NewAddressContext);
  if (context === undefined) {
    throw new Error(
      "useNewAddressContext hook must be used within AddressContextProvider",
    );
  }
  return context;
}
