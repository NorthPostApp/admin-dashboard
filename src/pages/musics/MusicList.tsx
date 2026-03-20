import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useGetMusicListQuery } from "@/hooks/queries/useGetMusicListQuery";
import { useMusicContext } from "@/hooks/useMusicContext";
import MusicTable from "@/components/music/MusicTable";
import Subheader from "@/pages/Subheader";
import { Spinner } from "@/components/ui/spinner";

export default function MusicList() {
  const { t } = useTranslation("music:list");
  const { musicListData, updateMusicListData } = useMusicContext();
  const [shouldRefreshData, setShouldRefreshData] = useState(false);
  const { refetch, isFetching } = useGetMusicListQuery(shouldRefreshData);

  const fetchMusicList = useCallback(() => {
    refetch()
      .then((result) => {
        if (result.isSuccess) {
          updateMusicListData(result.data);
        } else if (result.isError) {
          toast.error(result.error.message);
        }
      })
      .finally(() => {
        if (shouldRefreshData) {
          setShouldRefreshData(false);
        }
      });
  }, [refetch, updateMusicListData, shouldRefreshData, setShouldRefreshData]);

  useEffect(() => {
    if (musicListData === undefined || shouldRefreshData) {
      fetchMusicList();
    }
  }, [fetchMusicList, musicListData, shouldRefreshData]);

  return (
    <div className="body">
      <Subheader title={t("title")} />
      <div className="w-full h-full p-6">
        {isFetching && <Spinner className="mx-auto my-auto" />}
        {musicListData && <MusicTable musicListData={musicListData} />}
      </div>
    </div>
  );
}
