import { useEffect, useState } from "react";
import { Pause, Play } from "lucide-react";
import { useMusicPlayer } from "@/hooks/useMusicPlayer";
import { useGetPresignedMusicUrlQuery } from "@/hooks/queries/useGetPresignedMusicUrlQuery";
import { parseMusicDuration } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import clsx from "clsx";

type MusicPlayerProps = {
  filename: string | undefined;
};

const PLAY_BUTTON_SIZE = 22;
const styles = {
  body: clsx(
    "flex w-full bg-sidebar/30 px-4 py-3 gap-10 max-w-160 mx-auto justify-between items-center rounded-full border border-accent",
  ),
  playButton: clsx(
    "not-disabled:hover:cursor-pointer bg-primary rounded-full p-2 disabled:opacity-40",
  ),
  info: clsx("flex-1 text-sm text-center space-y-1"),
  progress: clsx("flex gap-3 text-xs justify-between items-center"),
  progressTime: clsx("w-10"),
};

export default function MusicPlayer({ filename }: MusicPlayerProps) {
  const { refetch } = useGetPresignedMusicUrlQuery(filename || "");
  const [seeking, setSeeking] = useState<boolean>(false);
  const { isPlaying, duration, currentTime, load, play, pause, seek } = useMusicPlayer();
  const [sliderTime, setSliderTime] = useState<number | undefined>(undefined);

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
    <div className={styles.body}>
      <button
        disabled={filename === undefined}
        onClick={() => {
          if (filename === undefined) return;
          if (isPlaying) pause();
          else play();
        }}
        className={styles.playButton}
      >
        {isPlaying ? (
          <Pause size={PLAY_BUTTON_SIZE} strokeWidth={1} className="fill-background" />
        ) : (
          <Play size={PLAY_BUTTON_SIZE} strokeWidth={1} className="fill-background" />
        )}
      </button>
      <div className={styles.info}>
        <p>{filename}</p>
        <div className={styles.progress}>
          <p className={styles.progressTime}>{parseMusicDuration(currentTime)}</p>
          <Slider
            defaultValue={[0]}
            max={duration}
            value={[(seeking ? sliderTime : currentTime) || 0]}
            onValueChange={(value) => {
              setSeeking(true);
              setSliderTime(value[0]);
            }}
            onValueCommit={(value) => {
              seek(value[0]);
              setSeeking(false);
            }}
          />
          <p className={styles.progressTime}>{parseMusicDuration(duration)}</p>
        </div>
      </div>
    </div>
  );
}
