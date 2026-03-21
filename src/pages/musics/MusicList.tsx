import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useGetMusicListQuery } from "@/hooks/queries/useGetMusicListQuery";
import { useMusicContext } from "@/hooks/useMusicContext";
import MusicTable from "@/components/music/MusicTable";
import Subheader from "@/pages/Subheader";
import { Spinner } from "@/components/ui/spinner";
import MusicPlayer from "@/components/music/MusicPlayer";
import { Button } from "@/components/ui/button";
import "./MusicPage.css";

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
      <div className="music-view">
        {!musicListData && isFetching && <Spinner className="mx-auto my-auto" />}
        {musicListData && (
          <div className="music-view__table">
            <MusicTable
              musicListData={musicListData}
              currentPlaying={currentMusic}
              onSelectMusic={handleSelectMusic}
            />
            <div className="music-view__table__footer">
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
