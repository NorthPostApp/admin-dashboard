import { useAppContext } from "@/hooks/useAppContext";
import type { AddressRequest } from "@/schemas/address-request";
import type React from "react";
import { createContext, useEffect, useState } from "react";

interface AddressRequestContextType {
  currentProcessing: AddressRequest | undefined;
  updateCurrentProcessing: (updatedRequest: AddressRequest) => void;
}

const AddressRequestContext = createContext<AddressRequestContextType | undefined>(
  undefined,
);

export default function AddressRequestContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { language } = useAppContext();
  const [currentProcessing, setCurrentProcessing] = useState<AddressRequest | undefined>(
    undefined,
  );

  useEffect(() => {
    if (currentProcessing !== undefined) {
      //eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentProcessing(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  const updateCurrentProcessing = (updatedRequest: AddressRequest) =>
    setCurrentProcessing(updatedRequest);

  const contextValue: AddressRequestContextType = {
    currentProcessing,
    updateCurrentProcessing,
  };
  return (
    <AddressRequestContext.Provider value={contextValue}>
      {children}
    </AddressRequestContext.Provider>
  );
}

export { AddressRequestContext };
