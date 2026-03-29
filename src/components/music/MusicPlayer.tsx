import { useEffect, useState } from "react";
import { Pause, Play } from "lucide-react";
import { useMusicPlayer } from "@/hooks/useMusicPlayer";
import { useGetPresignedMusicUrlQuery } from "@/hooks/queries/useGetPresignedMusicUrlQuery";
import { parseMusicDuration } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import "./Music.css";

type MusicPlayerProps = {
  filename: string | undefined;
};

const PLAY_BUTTON_SIZE = 22;

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
    <div className="music-player">
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
          <Pause size={PLAY_BUTTON_SIZE} strokeWidth={1} className="fill-background" />
        ) : (
          <Play size={PLAY_BUTTON_SIZE} strokeWidth={1} className="fill-background" />
        )}
      </button>
      <div className="music-player__info">
        <p>{filename}</p>
        <div className="music-player__progress">
          <p className="music-player__progress__time">
            {parseMusicDuration(currentTime)}
          </p>
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
          <p className="music-player__progress__time">{parseMusicDuration(duration)}</p>
        </div>
      </div>
    </div>
  );
}
