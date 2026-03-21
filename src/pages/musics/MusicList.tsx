import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useGetMusicListQuery } from "@/hooks/queries/useGetMusicListQuery";
import { useMusicContext } from "@/hooks/useMusicContext";
import MusicTable from "@/components/music/MusicTable";
import Subheader from "@/pages/Subheader";
import { Spinner } from "@/components/ui/spinner";
import MusicPlayer from "@/components/music/MusicPlayer";
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

  return (
    <div className="body">
      <Subheader title={t("title")} />
      <div className="music-view">
        {isFetching && <Spinner className="mx-auto my-auto" />}
        {musicListData && (
          <MusicTable
            musicListData={musicListData}
            currentPlaying={currentMusic}
            onSelectMusic={handleSelectMusic}
          />
        )}
        <MusicPlayer filename={currentMusic} />
      </div>
    </div>
  );
}
