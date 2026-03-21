import { useEffect } from "react";
import { Pause, Play } from "lucide-react";
import { useMusicPlayer } from "@/hooks/useMusicPlayer";
import { useGetPresignedMusicUrlQuery } from "@/hooks/queries/useGetPresignedMusicUrlQuery";

type MusicPlayerProps = {
  filename: string | undefined;
};

export default function MusicPlayer({ filename }: MusicPlayerProps) {
  const { refetch } = useGetPresignedMusicUrlQuery(filename || "");
  const { isPlaying, load, play, pause } = useMusicPlayer();

  useEffect(() => {
    if (filename !== undefined && filename !== "") {
      refetch().then((response) => {
        if (response.isSuccess) {
          load(response.data);
          play();
        }
      });
    }
  }, [filename, refetch, play, load]);

  return (
    <div>
      <button
        disabled={filename === undefined}
        onClick={() => {
          if (filename === undefined) return;
          if (isPlaying) pause();
          else play();
        }}
        className="music-table__audio__play"
      >
        {isPlaying ? (
          <Pause size={24} strokeWidth={1} className="fill-background" />
        ) : (
          <Play size={24} strokeWidth={1} className="fill-background" />
        )}
      </button>
    </div>
  );
}
