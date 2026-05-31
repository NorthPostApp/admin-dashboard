import { useEffect, useState } from "react";
import { RefreshCcw, Eraser } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useGetAllTagsQuery } from "@/hooks/queries/useGetAllTagsQuery";
import { useAppContext } from "@/hooks/useAppContext";
import { useAddressDataContext } from "@/hooks/useAddressDataContext";
import { useGetAddressesQuery } from "@/hooks/queries/useGetAddressesQuery";
import { Button } from "@/components/ui/button";
import CheckboxSection from "@/components/address/CheckboxSection";
import { Spinner } from "@/components/ui/spinner";

const styles = {
  filter: cn(
    "py-6 h-full flex flex-col justify-between max-h-full px-4 text-left w-full",
  ),
  header: cn("flex justify-between items-center border-b pb-3 px-3"),
  section: cn("max-h-full overflow-y-auto flex-1"),
  spinner: cn("mx-auto my-6 opacity-55"),
  footerInfo: cn("flex justify-between items-center pb-2 opacity-55"),
  updatedAt: cn("text-sm"),
  updateButton: cn("w-full"),
};

export default function ViewAddressesFilters() {
  const { t } = useTranslation("address:viewAddress");
  const { language } = useAppContext();
  const {
    tagsData,
    selectedTags,
    searchKeyword,
    updateTagsData,
    refreshAddressData,
    updateSelectedTags,
    clearTagSelections,
  } = useAddressDataContext();

  const [shouldRefreshTags, setShouldRefreshTags] = useState<boolean>(false);
  const { refetch, isFetching } = useGetAllTagsQuery(language, shouldRefreshTags);
  // the following query is used to refetch the address data with selected tags
  const { refetch: refetchAddressData, isFetching: isFetchingAddressData } =
    useGetAddressesQuery(language, 1, searchKeyword, selectedTags, true);

  const updateAddressData = () => {
    if (isFetchingAddressData) return;
    refetchAddressData().then((result) => {
      if (result.data) {
        refreshAddressData(result.data);
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
    const dateTime = new Date(time);
    const dateString = dateTime.toLocaleDateString();
    return dateString;
  };

  return (
    <div className={styles.filter}>
      <div className={styles.header}>
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
      <div className={styles.section}>
        {isFetching && (
          <Spinner
            className={styles.spinner}
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
        <div className={styles.footerInfo}>
          <h2 className={styles.updatedAt}>
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
          className={styles.updateButton}
          onClick={updateAddressData}
          disabled={isFetchingAddressData}
        >
          {isFetchingAddressData ? t("filters.updatingData") : t("filters.updateData")}
        </Button>
      </div>
    </div>
  );
}
