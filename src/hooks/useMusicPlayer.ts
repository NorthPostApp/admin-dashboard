import { useRef, useCallback, useState, useEffect } from "react";

export function useMusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

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
    // audio.addEventListener("timeupdate", () =>
    //   console.log("timeupdate: ", audio.currentTime),
    // );
    // audio.addEventListener("loadedmetadata", () =>
    //   console.log("loadedmetadata", audio.duration),
    // );
    // audio.addEventListener("ended", () => console.log("ended"));
  }, []);

  const play = useCallback(() => {
    audioRef.current?.play();
    setIsPlaying(true);
  }, []);
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

  return { isPlaying, load, play, pause };
}
