import type { Language } from "@/consts/app-config";
import { useState, createContext, useCallback } from "react";

type Prompt = {
  language: Language; // use to compare app language and prompt language
  prompt: string;
};

interface AddressContextType {
  systemPrompt: Prompt | undefined;
  updateSystemPrompt: (language: Language, prompt: string) => void;
  clearSystemPrompt: () => void;
}

const AddressContext = createContext<AddressContextType | undefined>(undefined);

export default function AddressContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [systemPrompt, setSystemPrompt] = useState<Prompt | undefined>(undefined);
  const clearSystemPrompt = useCallback(() => {
    setSystemPrompt(undefined);
  }, []);
  const updateSystemPrompt = useCallback((language: Language, prompt: string) => {
    setSystemPrompt({ language, prompt });
  }, []);

  return (
    <AddressContext.Provider
      value={{
        systemPrompt,
        updateSystemPrompt,
        clearSystemPrompt,
      }}
    >
      {children}
    </AddressContext.Provider>
  );
}
export { AddressContext };
