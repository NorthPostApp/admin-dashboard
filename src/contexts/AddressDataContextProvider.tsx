// import { DEFAULT_PAGE_SIZE } from "@/consts/app-config";
import type { Language } from "@/consts/app-config";
import type {
  GetAllTagsResponseSchema,
  AddressItemWithTimeSchema,
  GetAddressesResponseSchema,
  // AddressItemWithtimeSchema,
} from "@/schemas/address";
import { createContext, useState } from "react";

interface AddressDataContextProviderType {
  pagedAddressData: AddressItemWithTimeSchema[][];
  totalPages: number;
  currentPage: number;
  prevLanguage: Language | undefined;
  selectedTags: string[];
  tagsData: GetAllTagsResponseSchema | undefined;
  selectPage: (page: number) => void;
  // updateNextPageData: (nextPageData: GetAddressesResponseSchema) => void;
  updatePagedData: (getAddressesResponse: GetAddressesResponseSchema) => void;
  updateTagsData: (tagsData: GetAllTagsResponseSchema | undefined) => void;
  updateSelectedTags: (tag: string) => void;
  clearTagSelections: () => void;
  refreshAddressData: (getAddressesResponse: GetAddressesResponseSchema) => void;
  updateSingleAddressData: (newAddressItem: AddressItemWithTimeSchema) => void;
  deleteSingleAddressData: (addressID: string) => void;
}

const AddressDataContext = createContext<AddressDataContextProviderType | undefined>(
  undefined,
);

export default function AddressDataContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [pagedAddressData, setPagedAddressData] = useState<AddressItemWithTimeSchema[][]>(
    [],
  );
  // const []
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [prevLanguage, setPrevLanguage] = useState<Language>();
  const [tagsData, setTagsData] = useState<GetAllTagsResponseSchema | undefined>(
    undefined,
  );
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

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
    const maxPossiblePage = totalPages;
    const nextPage = Math.max(Math.min(page, maxPossiblePage), 1);
    if (nextPage === currentPage) return;
    setCurrentPage(nextPage);
  };

  const updatePagedData = (getAddressesResponse: GetAddressesResponseSchema) => {
    const { page, addresses, totalPages: fetchedTotalPages } = getAddressesResponse;
    setPagedAddressData((prev) => {
      const newAddresses = [...prev];
      newAddresses[page - 1] = addresses;
      return newAddresses;
    });
    if (totalPages !== fetchedTotalPages) setTotalPages(fetchedTotalPages);
  };

  const updateTagsData = (tagsData: GetAllTagsResponseSchema | undefined) => {
    setTagsData(tagsData);
  };

  const refreshAddressData = (getAddressesResponse: GetAddressesResponseSchema) => {
    const { totalPages: fetchedTotalPages, language, addresses } = getAddressesResponse;
    const newPagedAddresses = Array(totalPages).map(
      () => [] as AddressItemWithTimeSchema[],
    );
    newPagedAddresses[0] = addresses;
    setPagedAddressData(newPagedAddresses);
    setCurrentPage(1);
    setTotalPages(Math.max(fetchedTotalPages, 1));
    if (language !== prevLanguage) setPrevLanguage(language);
  };

  const updateSingleAddressData = (updatedAddressItem: AddressItemWithTimeSchema) => {
    setPagedAddressData((prev) => {
      const newAddresses = [...prev];
      const updatedCurrentPageData = newAddresses[currentPage - 1].map((address) => {
        if (address.id !== updatedAddressItem.id) return address;
        return updatedAddressItem;
      });
      newAddresses[currentPage - 1] = updatedCurrentPageData;
      return newAddresses;
    });
  };

  const deleteSingleAddressData = (deletedAddressID: string) => {
    setPagedAddressData((prev) => {
      const newAddresses = [...prev];
      const updatedCurrentPageData = newAddresses[currentPage - 1].filter((address) => {
        return address.id !== deletedAddressID;
      });
      newAddresses[currentPage - 1] = updatedCurrentPageData;
      return newAddresses;
    });
  };

  const contextValue = {
    pagedAddressData,
    currentPage,
    totalPages,
    tagsData,
    selectPage,
    prevLanguage,
    selectedTags,
    // updateNextPageData,
    updatePagedData,
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
