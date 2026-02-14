import { useEffect, useState } from "react";
import { RefreshCcw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import type { Language } from "@/consts/app-config";
import { useGetAllTagsQuery } from "@/hooks/queries/useGetAllTagsQuery";
import { useAppContext } from "@/hooks/useAppContext";
import { useAddressDataContext } from "@/hooks/useAddressDataContext";
import { Button } from "@/components/ui/button";
import CheckboxSection from "@/components/address/CheckboxSection";

export default function ViewAddressesFilters() {
  const { t } = useTranslation("address:viewAddress");
  const { language } = useAppContext();
  const { tagsData, updateTagsData } = useAddressDataContext();

  const [shouldRefresh, setShouldRefresh] = useState<boolean>(false);
  const [currLanguage, setCurrLanguage] = useState<Language>(language);

  const { refetch, isFetching } = useGetAllTagsQuery(language, shouldRefresh);

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => {
      if (prev.includes(tag)) return prev.filter((prevTag) => prevTag !== tag);
      else return [...prev, tag];
    });
  };

  // the tags will be updated when 1. initial loading; 2. shouldRefresh; 3. Switch language
  useEffect(() => {
    if (!tagsData || shouldRefresh || currLanguage !== language) {
      refetch()
        .then((response) => {
          if (response.data !== undefined) {
            updateTagsData(response.data);
          }
        })
        .finally(() => {
          if (shouldRefresh) setShouldRefresh(false);
          if (currLanguage !== language) setCurrLanguage(language);
        });
    }
  }, [refetch, updateTagsData, tagsData, shouldRefresh, language, currLanguage]);

  const getLastUpdated = (time: number | undefined) => {
    if (!time) return "";
    const dateTime = new Date(time * 1000); //  `time` is a Unix timestamp in seconds; convert to milliseconds for the JavaScript Date constructor
    const dateString = dateTime.toLocaleDateString();
    return dateString;
  };

  return (
    <div className="address-component__filter">
      <h1 className="address-component__filter__header">{t("filters.filterByTags")}</h1>
      <div className="address-component__filter__section">
        {tagsData?.tags &&
          Object.entries(tagsData.tags).map(([sectionName, tags]) => (
            <CheckboxSection
              key={sectionName}
              title={t(`filters.categories.${sectionName}`)}
              options={tags}
              selectedOptions={selectedTags}
              toggleOption={toggleTag}
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
            onClick={() => setShouldRefresh(true)}
            disabled={isFetching}
          >
            <RefreshCcw className={cn(isFetching ? "animate-spin" : "")} />
          </Button>
        </div>
        <Button variant="outline" className="w-full">
          Apply
        </Button>
      </div>
    </div>
  );
}
