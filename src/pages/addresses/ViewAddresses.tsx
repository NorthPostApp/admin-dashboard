import { Activity, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { ListFilter } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GetAddressesResponseSchema } from "@/schemas/address";
import { useIsMobile } from "@/hooks/use-mobile";
import { useGetAddressesQuery } from "@/hooks/queries/useGetAddressesQuery";
import { useAppContext } from "@/hooks/useAppContext";
import { useAddressDataContext } from "@/hooks/useAddressDataContext";
import Subheader from "@/pages/Subheader";
import PaginatedAddresses from "@/components/address/PaginatedAddresses";
import SearchInput from "@/components/address/SearchInput";
import PaginationBar from "@/components/address/PaginationBar";
import ViewAddressesFilters from "@/components/address/ViewAddressesFilters";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import "./AddressPage.css";

export default function ViewAddresses() {
  const { t } = useTranslation("address:viewAddress");
  const isMobile = useIsMobile();
  const { language } = useAppContext();
  const {
    pagedAddressData,
    searchKeyword,
    updateSearchKeyword,
    totalPages,
    currentPage,
    selectedTags,
    refreshAddressData,
    updatePagedData,
    selectPage,
    prevLanguage,
  } = useAddressDataContext();
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const onToggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  const shouldRefreshData = language !== prevLanguage;

  const { isFetching, refetch } = useGetAddressesQuery(
    language,
    currentPage,
    shouldRefreshData ? "" : searchKeyword,
    shouldRefreshData ? [] : selectedTags,
    shouldRefreshData,
  );

  // get first page data when first loading the page or refetching data
  const refetchData = useCallback(
    (callbackFn: (data: GetAddressesResponseSchema) => void) => {
      if (isFetching) return; // see if this can avoid multiple refetching happen
      refetch().then((result) => {
        if (result.data) {
          callbackFn(result.data);
        } else if (result.error) {
          toast.error("failed to fetch data, please check your internet connection");
        }
      });
    },
    [refetch, isFetching],
  );

  const loadInitialAddressData = useCallback(() => {
    refetchData(refreshAddressData);
  }, [refreshAddressData, refetchData]);

  const loadPagedData = useCallback(() => {
    if (
      pagedAddressData.length !== 0 &&
      pagedAddressData[currentPage - 1] && // technically we can get rid of this. but preserve it for safety
      pagedAddressData[currentPage - 1].length !== 0
    )
      return;
    refetchData(updatePagedData);
  }, [updatePagedData, refetchData, currentPage, pagedAddressData]);
  // initial loading
  useEffect(() => {
    if (shouldRefreshData) {
      loadInitialAddressData();
      updateSearchKeyword(""); // should also clean up the keyword
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldRefreshData]);

  useEffect(() => {
    loadPagedData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  return (
    <div className="body">
      <Subheader
        title={t("title")}
        centralComponent={
          <SearchInput
            value={searchKeyword}
            onChange={updateSearchKeyword}
            placeholder={t("filters.searchPlaceholder")}
            onSubmit={loadInitialAddressData}
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
              {isFetching && (
                <div className="h-full flex items-center justify-center gap-2">
                  <Spinner />
                  <p>{t("loading")}</p>
                </div>
              )}
              {!isFetching && (
                <PaginatedAddresses
                  currentPage={currentPage}
                  addresses={pagedAddressData[currentPage - 1] || []}
                />
              )}
              {pagedAddressData.length !== 0 && (
                <PaginationBar
                  totalPages={totalPages}
                  currPage={currentPage}
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
