import { DEFAULT_PAGE_DISPLAY_SIZE } from "@/consts/app-config";
import type { GetAllAddressesResponseSchema } from "@/schemas/address";
import { createContext, useState } from "react";

interface AddressDataContextProviderType {
  addressData: GetAllAddressesResponseSchema | undefined;
  totalPages: number;
  currentPage: number;
  selectPage: (page: number) => void;
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
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const handleUpdateTotalPages = (numAddresses: number) => {
    const numPages = Math.ceil(numAddresses / DEFAULT_PAGE_DISPLAY_SIZE);
    setTotalPages(Math.max(numPages, 1));
  };

  const selectPage = (page: number) => {
    const selectedPage = Math.max(Math.min(page, totalPages), 1);
    if (selectedPage === currentPage) return;
    setCurrentPage(selectedPage);
  };

  const updateNextPageData = (nextPageData: GetAllAddressesResponseSchema) => {
    setAddressData((prev) => {
      const newAddressData = {
        addresses: [...(prev?.addresses || []), ...nextPageData.addresses],
        totalCount: prev?.totalCount || 0,
        hasMore: nextPageData.hasMore,
        lastDocId: nextPageData.lastDocId,
        language: nextPageData.language,
      };
      handleUpdateTotalPages(newAddressData.addresses.length);
      return newAddressData;
    });
  };

  const refreshAddressData = (getAllAddressesResponse: GetAllAddressesResponseSchema) => {
    setAddressData(getAllAddressesResponse);
    handleUpdateTotalPages(getAllAddressesResponse.addresses.length);
  };

  const contextValue = {
    addressData,
    currentPage,
    totalPages,
    selectPage,
    updateNextPageData,
    refreshAddressData,
  };

  return (
    <AddressDataContext.Provider value={contextValue}>
      {children}
    </AddressDataContext.Provider>
  );
}

export { AddressDataContext };
