import { DEFAULT_PAGE_DISPLAY_SIZE } from "@/consts/app-config";
import type {
  GetAllTagsResponseSchema,
  AddressItemWithTimeSchema,
  GetAllAddressesResponseSchema,
} from "@/schemas/address";
import { createContext, useState } from "react";

interface AddressDataContextProviderType {
  addressData: GetAllAddressesResponseSchema | undefined;
  totalPages: number;
  currentPage: number;
  tagsData: GetAllTagsResponseSchema | undefined;
  selectPage: (page: number) => void;
  updateNextPageData: (nextPageData: GetAllAddressesResponseSchema) => void;
  updateTagsData: (tagsData: GetAllTagsResponseSchema | undefined) => void;
  refreshAddressData: (getAllAddressesResponse: GetAllAddressesResponseSchema) => void;
  updateSingleAddressData: (newAddressItem: AddressItemWithTimeSchema) => void;
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
  const [tagsData, setTagsData] = useState<GetAllTagsResponseSchema | undefined>(
    undefined,
  );

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

  const updateTagsData = (tagsData: GetAllTagsResponseSchema | undefined) => {
    setTagsData(tagsData);
  };

  const refreshAddressData = (getAllAddressesResponse: GetAllAddressesResponseSchema) => {
    setAddressData(getAllAddressesResponse);
    handleUpdateTotalPages(getAllAddressesResponse.addresses.length);
  };

  const updateSingleAddressData = (updatedAddressItem: AddressItemWithTimeSchema) => {
    setAddressData((prev) => {
      const newAddresses = prev?.addresses.map((address) => {
        if (address.id !== updatedAddressItem.id) return address;
        return updatedAddressItem;
      });
      return { ...prev, addresses: newAddresses } as GetAllAddressesResponseSchema;
    });
  };

  const contextValue = {
    addressData,
    currentPage,
    totalPages,
    tagsData,
    selectPage,
    updateNextPageData,
    updateTagsData,
    refreshAddressData,
    updateSingleAddressData,
  };

  return (
    <AddressDataContext.Provider value={contextValue}>
      {children}
    </AddressDataContext.Provider>
  );
}

export { AddressDataContext };
