import type { MusicListSchema } from "@/schemas/music";
import { createContext, useState } from "react";

interface MusicContextType {
  musicListData: MusicListSchema | undefined;
  updateMusicListData: (newMusicList: MusicListSchema) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export default function MusicContextProvder({ children }: { children: React.ReactNode }) {
  const [musicListData, setMusicListData] = useState<MusicListSchema | undefined>(
    undefined,
  );

  const updateMusicListData = (newMusicList: MusicListSchema) => {
    setMusicListData(newMusicList);
  };

  const contextValue: MusicContextType = {
    musicListData: musicListData,
    updateMusicListData: updateMusicListData,
  };

  return <MusicContext.Provider value={contextValue}>{children}</MusicContext.Provider>;
}

export { MusicContext };
