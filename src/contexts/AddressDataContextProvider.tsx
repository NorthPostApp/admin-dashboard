import type { GetAllAddressesResponseSchema } from "@/schemas/address";
import { createContext, useState } from "react";

interface AddressDataContextProviderType {
  addressData: GetAllAddressesResponseSchema | undefined;
  updateNextPageData: (nextPageData: GetAllAddressesResponseSchema) => void;
  refreshAddressData: (getAllAddressesResponse: GetAllAddressesResponseSchema) => void;
}

const AddressDataContext = createContext<AddressDataContextProviderType | undefined>(
  undefined,
);

export default function AddressDataContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [addressData, setAddressData] = useState<
    GetAllAddressesResponseSchema | undefined
  >(undefined);
  const updateNextPageData = (nextPageData: GetAllAddressesResponseSchema) => {
    setAddressData((prev) => {
      return {
        addresses: [...(prev?.addresses || []), ...nextPageData.addresses],
        totalCount: prev?.totalCount || 0,
        hasMore: nextPageData.hasMore,
        lastDocId: nextPageData.lastDocId,
        language: nextPageData.language,
      };
    });
  };
  const refreshAddressData = (getAllAddressesResponse: GetAllAddressesResponseSchema) => {
    setAddressData(getAllAddressesResponse);
  };
  const contextValue = { addressData, updateNextPageData, refreshAddressData };
  return (
    <AddressDataContext.Provider value={contextValue}>
      {children}
    </AddressDataContext.Provider>
  );
}

export { AddressDataContext };
