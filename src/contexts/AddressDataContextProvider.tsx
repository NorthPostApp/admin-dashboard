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
    const maxPossiblePage = Math.ceil(
      (addressData?.totalCount || 1) / DEFAULT_PAGE_DISPLAY_SIZE,
    );
    const nextPage = Math.max(Math.min(page, maxPossiblePage), 1);
    if (nextPage === currentPage) return;
    setCurrentPage(nextPage);
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
