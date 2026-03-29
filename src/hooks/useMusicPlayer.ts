import { useRef, useCallback, useState, useEffect } from "react";
import { toast } from "sonner";

export function useMusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number | undefined>(undefined);
  const [duration, setDuration] = useState<number | undefined>(undefined);

  const load = useCallback((url: string) => {
    // clean up the previous audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const audio = new Audio(url);
    const abortController = new AbortController();
    audioRef.current = audio;
    abortControllerRef.current = abortController;
    audio.addEventListener(
      "timeupdate",
      () => {
        if (audio.currentTime) {
          setCurrentTime(audio.currentTime);
        }
      },
      { signal: abortController.signal },
    );
    audio.addEventListener(
      "loadedmetadata",
      () => {
        if (audio.duration) {
          setDuration(audio.duration);
        }
      },
      { signal: abortController.signal },
    );
    audio.addEventListener(
      "ended",
      () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
        setIsPlaying(false);
        setCurrentTime(0);
      },
      { signal: abortController.signal },
    );
  }, []);

  const play = useCallback(() => {
    if (audioRef.current) {
      audioRef.current
        .play()
        .then(() => {
          // only turn isPlaying on when successfully plays the music
          setIsPlaying(true);
        })
        .catch(() => {
          toast.error("failed to play music, please check if the music file is valid");
        });
    }
  }, []);

  const seek = useCallback(
    (time: number) => {
      if (audioRef.current) {
        audioRef.current.currentTime = time;
        if (isPlaying) {
          audioRef.current.play();
        }
        setCurrentTime(time);
      }
    },
    [isPlaying],
  );

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return { isPlaying, load, play, pause, seek, currentTime, duration };
}
