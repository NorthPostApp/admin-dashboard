import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { DEFAULT_PAGE_DISPLAY_SIZE } from "@/consts/app-config";
import { useGetAllAddressesQuery } from "@/hooks/queries/useGetAllAddressesQuery";
import { useAppContext } from "@/hooks/useAppContext";
import { useAddressDataContext } from "@/hooks/useAddressDataContext";
import Subheader from "@/pages/Subheader";
import PaginatedAddresses from "@/components/address/PaginatedAddresses";
import PaginationBar from "@/components/address/PaginationBar";
import SearchInput from "@/components/address/SearchInput";
import "./AddressPage.css";

export default function ViewAddresses() {
  const { t } = useTranslation("address:viewAddress");
  const { language } = useAppContext();
  const {
    totalPages,
    currentPage,
    addressData,
    refreshAddressData,
    updateNextPageData,
    selectPage,
  } = useAddressDataContext();
  const [searchText, setSearchText] = useState<string>("");
  const onChangeSearchText = (text: string) => {
    if (currentPage !== 1) selectPage(1);
    setSearchText(text);
  };

  const shouldRefreshData = language !== addressData?.language;

  // this refresh could be a state, in case we need to refresh with new tags or keywords
  const { isFetching, refetch } = useGetAllAddressesQuery(
    language,
    [],
    addressData?.lastDocId,
    shouldRefreshData,
  );
  const filteredAddresses = useMemo(() => {
    if (searchText.length === 0) return addressData?.addresses;
    return addressData?.addresses.filter((address) => {
      return address.name.includes(searchText) || address.briefIntro.includes(searchText);
    });
  }, [searchText, addressData]);

  // get first page data when first loading the page or refetching data
  const loadInitialAddressData = useCallback(() => {
    if (!addressData || language != addressData.language) {
      refetch().then((result) => {
        if (result.data) {
          refreshAddressData(result.data);
        } else if (result.error) {
          toast.error("failed to fetch data, please check your internet connection");
        }
      });
    }
  }, [addressData, language, refetch, refreshAddressData]);

  const loadNextPageData = useCallback(() => {
    refetch().then((result) => {
      if (result.data) {
        updateNextPageData(result.data);
      } else if (result.error) {
        toast.error("failed to fetch data, please check your internet connection");
      }
    });
  }, [refetch, updateNextPageData]);

  // initial loading
  useEffect(() => {
    loadInitialAddressData();
  }, [loadInitialAddressData]);

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
        sideComponent={<div>Filters</div>}
      ></Subheader>
      <div className="address-view">
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
      </div>
    </div>
  );
}
