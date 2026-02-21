import { Activity, useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { ListFilter } from "lucide-react";
import { cn } from "@/lib/utils";
import { DEFAULT_PAGE_DISPLAY_SIZE } from "@/consts/app-config";
import { useIsMobile } from "@/hooks/use-mobile";
import { useGetAllAddressesQuery } from "@/hooks/queries/useGetAllAddressesQuery";
import { useAppContext } from "@/hooks/useAppContext";
import { useAddressDataContext } from "@/hooks/useAddressDataContext";
import Subheader from "@/pages/Subheader";
import { Button } from "@/components/ui/button";
import PaginatedAddresses from "@/components/address/PaginatedAddresses";
import PaginationBar from "@/components/address/PaginationBar";
import SearchInput from "@/components/address/SearchInput";
import ViewAddressesFilters from "@/components/address/ViewAddressesFilters";
import "./AddressPage.css";
import type { GetAllAddressesResponseSchema } from "@/schemas/address";

export default function ViewAddresses() {
  const { t } = useTranslation("address:viewAddress");
  const isMobile = useIsMobile();
  const { language } = useAppContext();
  const {
    totalPages,
    currentPage,
    addressData,
    refreshAddressData,
    updateNextPageData,
    selectPage,
    selectedTags,
  } = useAddressDataContext();
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const onChangeSearchText = (text: string) => {
    if (currentPage !== 1) selectPage(1);
    setSearchText(text);
  };
  const onToggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  const shouldRefreshData = language !== addressData?.language;

  const { isFetching, refetch } = useGetAllAddressesQuery(
    language,
    shouldRefreshData ? [] : selectedTags,
    addressData?.lastDocId,
    shouldRefreshData,
  );

  const filteredAddresses = useMemo(() => {
    if (searchText.length === 0) return addressData?.addresses;
    return addressData?.addresses.filter((address) => {
      return (
        address.id === searchText ||
        address.name.includes(searchText) ||
        address.briefIntro.includes(searchText)
      );
    });
  }, [searchText, addressData]);

  // get first page data when first loading the page or refetching data
  const refetchData = useCallback(
    (
      callbackFn: (data: GetAllAddressesResponseSchema) => void,
      resetPageNumber: boolean = false,
    ) => {
      if (isFetching) return; // see if this can avoid multiple refetching happen
      refetch().then((result) => {
        if (result.data) {
          callbackFn(result.data);
          if (resetPageNumber && currentPage !== 1) selectPage(1);
        } else if (result.error) {
          toast.error("failed to fetch data, please check your internet connection");
        }
      });
    },
    [refetch, isFetching, currentPage, selectPage],
  );

  const loadInitialAddressData = useCallback(() => {
    if (!addressData || shouldRefreshData) {
      refetchData(refreshAddressData, true);
    }
  }, [addressData, shouldRefreshData, refreshAddressData, refetchData]);

  const loadNextPageData = useCallback(() => {
    refetchData(updateNextPageData);
  }, [updateNextPageData, refetchData]);

  // initial loading
  useEffect(() => {
    if (!isFetching) loadInitialAddressData();
  }, [loadInitialAddressData, isFetching]);

  useEffect(() => {
    if (currentPage > totalPages && !isFetching) loadNextPageData();
  }, [loadNextPageData, currentPage, totalPages, isFetching]);

  const filteredPages =
    searchText.length === 0
      ? totalPages
      : Math.ceil((filteredAddresses?.length || 1) / DEFAULT_PAGE_DISPLAY_SIZE);

  return (
    <div className="address-body">
      <Subheader
        title={t("title")}
        centralComponent={
          <SearchInput
            onChange={onChangeSearchText}
            placeholder={t("filters.searchPlaceholder")}
          />
        }
        sideComponent={
          <Button onClick={onToggleFilters} variant="ghost" size="icon-sm">
            <ListFilter width={20} />
          </Button>
        }
      ></Subheader>
      <div className="address-view">
        <div className="address-view__flex__row">
          <Activity mode={isMobile && showFilters ? "hidden" : "visible"}>
            <div className="address-content__body__unbound">
              {isFetching && <div>Loading</div>}
              {!isFetching && (
                <PaginatedAddresses
                  currentPage={currentPage}
                  addresses={filteredAddresses || []}
                />
              )}
              {addressData && (
                <PaginationBar
                  totalPages={searchText.length === 0 ? totalPages : filteredPages}
                  currPage={currentPage}
                  hasMore={addressData?.hasMore}
                  loading={isFetching}
                  selectPageAction={selectPage}
                />
              )}
            </div>
          </Activity>
          <div
            className={cn(
              "address-layout__sidebar",
              showFilters ? "visible" : "hidden",
              isMobile ? "" : "w-[30%] min-w-72",
            )}
          >
            <ViewAddressesFilters />
          </div>
        </div>
      </div>
    </div>
  );
}
