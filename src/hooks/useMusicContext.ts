import { MusicContext } from "@/contexts/MusicContextProvider";
import { useContext } from "react";

export function useMusicContext() {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error("useMusicContext hook must be used within MusicContextProvider");
  }
  return context;
}
