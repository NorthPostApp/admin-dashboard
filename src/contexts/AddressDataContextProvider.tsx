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
  selectedTags: string[];
  tagsData: GetAllTagsResponseSchema | undefined;
  selectPage: (page: number) => void;
  updateNextPageData: (nextPageData: GetAllAddressesResponseSchema) => void;
  updateTagsData: (tagsData: GetAllTagsResponseSchema | undefined) => void;
  updateSelectedTags: (tag: string) => void;
  clearTagSelections: () => void;
  refreshAddressData: (getAllAddressesResponse: GetAllAddressesResponseSchema) => void;
  updateSingleAddressData: (newAddressItem: AddressItemWithTimeSchema) => void;
  deleteSingleAddressData: (addressId: string) => void;
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
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleUpdateTotalPages = (numAddresses: number) => {
    const numPages = Math.ceil(numAddresses / DEFAULT_PAGE_DISPLAY_SIZE);
    setTotalPages(Math.max(numPages, 1));
  };

  const updateSelectedTags = (tag: string) => {
    setSelectedTags((prev) => {
      if (prev.includes(tag)) return prev.filter((prevTag) => prevTag !== tag);
      return [...prev, tag];
    });
  };

  const clearTagSelections = () => {
    setSelectedTags([]);
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

  const deleteSingleAddressData = (addressId: string) => {
    setAddressData((prev) => {
      if (!prev) return prev;
      // exclude the deleted address Item
      const newAddresses = prev.addresses.filter(
        (addressData) => addressData.id !== addressId,
      );
      // reduce the total count by one
      let totalCount = prev.totalCount;
      if (newAddresses.length !== prev.addresses.length) {
        totalCount -= 1;
      }
      // update the last doc id if we're deleting the last doc (for a flawless pagination)
      let lastDocId = prev.lastDocId;
      if (lastDocId && lastDocId === addressId) {
        if (newAddresses && newAddresses.length === 0) lastDocId = "";
        else if (newAddresses) lastDocId = newAddresses[newAddresses.length - 1].id;
      }
      // update new total pages and selected page
      const newTotalPages = Math.max(
        Math.ceil(newAddresses.length / DEFAULT_PAGE_DISPLAY_SIZE),
        1,
      );
      if (totalPages != newTotalPages) {
        handleUpdateTotalPages(newAddresses.length);
      }
      if (currentPage > newTotalPages) {
        selectPage(newTotalPages);
      }
      handleUpdateTotalPages(newAddresses.length);
      return {
        ...prev,
        totalCount,
        lastDocId,
        addresses: newAddresses,
      } as GetAllAddressesResponseSchema;
    });
  };

  const contextValue = {
    addressData,
    currentPage,
    totalPages,
    tagsData,
    selectPage,
    selectedTags,
    updateNextPageData,
    updateTagsData,
    updateSelectedTags,
    clearTagSelections,
    refreshAddressData,
    updateSingleAddressData,
    deleteSingleAddressData,
  };

  return (
    <AddressDataContext.Provider value={contextValue}>
      {children}
    </AddressDataContext.Provider>
  );
}

export { AddressDataContext };
