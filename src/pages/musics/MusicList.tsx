import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import clsx from "clsx";
import { cn } from "@/lib/utils";
import { useGetMusicListQuery } from "@/hooks/queries/useGetMusicListQuery";
import { useMusicContext } from "@/hooks/useMusicContext";
import MusicTable from "@/components/music/MusicTable";
import Subheader from "@/pages/Subheader";
import { Spinner } from "@/components/ui/spinner";
import MusicPlayer from "@/components/music/MusicPlayer";
import { Button } from "@/components/ui/button";

const styles = {
  view: clsx(
    "w-full h-full max-h-full overflow-y-hidden p-6 flex flex-col gap-3 justify-between",
  ),
  table: clsx("max-h-full flex flex-col gap-2 justify-start overflow-y-hidden"),
  tableFooter: clsx("text-sm flex justify-end items-center gap-3 px-2 text-primary/70"),
};

export default function MusicList() {
  const { t } = useTranslation("music:list");
  const { musicListData, updateMusicListData } = useMusicContext();
  const [shouldRefreshData, setShouldRefreshData] = useState(false);
  const { refetch, isFetching } = useGetMusicListQuery(shouldRefreshData);

  // controls music player
  const [currentMusic, setCurrentMusic] = useState<string | undefined>(undefined);
  const handleSelectMusic = (musicFilename: string) => {
    setCurrentMusic(musicFilename);
  };

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

  const mostRecentAdded = useMemo(() => {
    if (!musicListData || musicListData.length == 0) return undefined;
    let recentModified = musicListData[0].lastModified;
    musicListData.forEach((music) => {
      if (music.lastModified > recentModified) recentModified = music.lastModified;
    });
    return recentModified;
  }, [musicListData]);

  return (
    <div className="body">
      <Subheader title={t("title")} />
      <div className={styles.view}>
        {!musicListData && isFetching && <Spinner className="mx-auto my-auto" />}
        {musicListData && (
          <div className={styles.table}>
            <MusicTable
              musicListData={musicListData}
              currentPlaying={currentMusic}
              onSelectMusic={handleSelectMusic}
            />
            <div className={styles.tableFooter}>
              {mostRecentAdded && (
                <p>
                  {`${t("table.mostRecentlyAdded")} ${new Date(mostRecentAdded).toLocaleDateString()}`}
                </p>
              )}
              <Button
                variant="ghost"
                data-testid="music-view__refresh"
                size={"icon-sm"}
                className={cn("rounded-full", isFetching && "animate-spin")}
                onClick={() => setShouldRefreshData(true)}
              >
                <RefreshCcw />
              </Button>
            </div>
          </div>
        )}
        <MusicPlayer filename={currentMusic} />
      </div>
    </div>
  );
}
