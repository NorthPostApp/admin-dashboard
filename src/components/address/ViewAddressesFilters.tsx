import { useEffect, useState } from "react";
import { RefreshCcw, Eraser } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { useGetAllTagsQuery } from "@/hooks/queries/useGetAllTagsQuery";
import { useAppContext } from "@/hooks/useAppContext";
import { useAddressDataContext } from "@/hooks/useAddressDataContext";
import { useGetAllAddressesQuery } from "@/hooks/queries/useGetAllAddressesQuery";
import { Button } from "@/components/ui/button";
import CheckboxSection from "@/components/address/CheckboxSection";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

export default function ViewAddressesFilters() {
  const { t } = useTranslation("address:viewAddress");
  const { language } = useAppContext();
  const {
    tagsData,
    currentPage,
    selectedTags,
    updateTagsData,
    refreshAddressData,
    selectPage,
    updateSelectedTags,
    clearTagSelections,
  } = useAddressDataContext();

  const [shouldRefreshTags, setShouldRefreshTags] = useState<boolean>(false);
  const { refetch, isFetching } = useGetAllTagsQuery(language, shouldRefreshTags);
  // the following query is used to refetch the address data with selected tags
  const { refetch: refetchAddressData, isFetching: isFetchingAddressData } =
    useGetAllAddressesQuery(language, selectedTags);

  const updateAddressData = () => {
    if (isFetchingAddressData) return;
    refetchAddressData().then((result) => {
      if (result.data) {
        refreshAddressData(result.data);
        if (currentPage !== 1) selectPage(1);
      } else if (result.error) {
        toast.error(t("fetchFailed"));
      }
    });
  };

  // the tags will be updated when 1. initial loading; 2. shouldRefresh; 3. Switch language
  useEffect(() => {
    if (!tagsData || shouldRefreshTags || tagsData.language !== language) {
      refetch()
        .then((response) => {
          // TODO: add no table error handling here
          if (response.data !== undefined) {
            updateTagsData(response.data);
          }
        })
        .finally(() => {
          if (shouldRefreshTags) setShouldRefreshTags(false);
          clearTagSelections();
        });
    }
  }, [
    refetch,
    updateTagsData,
    tagsData,
    shouldRefreshTags,
    language,
    clearTagSelections,
  ]);

  const getLastUpdated = (time: number | undefined) => {
    if (!time) return "";
    const dateTime = new Date(time * 1000); //  `time` is a Unix timestamp in seconds; convert to milliseconds for the JavaScript Date constructor
    const dateString = dateTime.toLocaleDateString();
    return dateString;
  };

  return (
    <div className="address-component__filter">
      <div className="address-component__filter__header">
        <p>{t("filters.filterByTags")}</p>
        <Button
          variant={"ghost"}
          size={"icon-sm"}
          disabled={selectedTags.length === 0}
          onClick={clearTagSelections}
        >
          <Eraser />
        </Button>
      </div>
      <div className="address-component__filter__section">
        {isFetching && (
          <Spinner
            className="mx-auto my-6 opacity-55"
            data-testid="view-addresses-filters-spinner"
          />
        )}
        {!isFetching &&
          tagsData?.tags &&
          Object.entries(tagsData.tags).map(([sectionName, tags]) => (
            <CheckboxSection
              key={sectionName}
              title={t(`filters.categories.${sectionName}`)}
              options={tags}
              selectedOptions={selectedTags}
              toggleOption={updateSelectedTags}
            />
          ))}
      </div>
      <div>
        <div className="address-component__filter__footer__info">
          <h2>
            {t("filters.tagsUpdatedAt")}: {getLastUpdated(tagsData?.refreshedAt)}
          </h2>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setShouldRefreshTags(true)}
            disabled={isFetching}
            data-testid="viewaddressfilters-refresh"
          >
            <RefreshCcw
              className={cn(shouldRefreshTags && isFetching ? "animate-spin" : "")}
            />
          </Button>
        </div>
        <Button
          variant="outline"
          className="w-full"
          onClick={updateAddressData}
          disabled={isFetchingAddressData}
        >
          {isFetchingAddressData ? t("filters.updatingData") : t("filters.updateData")}
        </Button>
      </div>
    </div>
  );
}
