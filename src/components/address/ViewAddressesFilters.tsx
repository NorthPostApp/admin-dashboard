import { useEffect, useState } from "react";
import { RefreshCcw } from "lucide-react";
import { useGetAllTagsQuery } from "@/hooks/queries/useGetAllTagsQuery";
import { useAppContext } from "@/hooks/useAppContext";
import { useAddressDataContext } from "@/hooks/useAddressDataContext";
import { Button } from "@/components/ui/button";
import CheckboxSection from "./CheckboxSection";
import type { Language } from "@/consts/app-config";

export default function ViewAddressesFilters() {
  const [shouldRefresh, setShouldRefresh] = useState<boolean>(false);
  const { language } = useAppContext();
  const [currLanguage, setCurrLanguage] = useState<Language>(language);
  const { refetch, isFetching } = useGetAllTagsQuery(language, shouldRefresh);
  const { tagsData, updateTagsData } = useAddressDataContext();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => {
      if (prev.includes(tag)) return prev.filter((prevTag) => prevTag !== tag);
      else return [...prev, tag];
    });
  };

  // be sure to review this implementation
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
    <div className="py-6 h-full flex flex-col justify-between max-h-full px-4">
      <h1>Filter By Tags</h1>
      <div className="max-h-full overflow-y-auto flex-1">
        {tagsData?.tags &&
          Object.entries(tagsData.tags).map(([sectionName, tags]) => (
            <CheckboxSection
              key={sectionName}
              title={sectionName}
              options={tags}
              selectedOptions={selectedTags}
              toggleOption={toggleTag}
            />
          ))}
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h2>Last updated: {getLastUpdated(tagsData?.refreshedAt)}</h2>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setShouldRefresh(true)}
            disabled={isFetching}
          >
            <RefreshCcw />
          </Button>
        </div>
        <Button variant="outline" className="w-full">
          Apply
        </Button>
      </div>
    </div>
  );
}
