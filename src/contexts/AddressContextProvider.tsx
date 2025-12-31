import { type Language } from "@/consts/app-config";
import type { ZodGenerateAddressesResponse } from "@/schemas/address-schema";
import { useState, createContext, useCallback } from "react";

type SystemPrompt = {
  language: Language; // use to compare app language and prompt language
  prompt: string;
};

type UserPrompt = string;

interface AddressContextType {
  systemPrompt: SystemPrompt | undefined;
  userPrompt: UserPrompt;
  generatedAddresses: ZodGenerateAddressesResponse;
  updateSystemPrompt: (language: Language, prompt: string) => void;
  updateUserPrompt: (prompt: UserPrompt) => void;
  saveGeneratedAddresses: (addresses: ZodGenerateAddressesResponse) => void;
}

const AddressContext = createContext<AddressContextType | undefined>(undefined);

export default function AddressContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [systemPrompt, setSystemPrompt] = useState<SystemPrompt | undefined>(undefined);
  const [userPrompt, setUserPrompt] = useState<UserPrompt>("");
  const [generatedAddresses, setGeneratedAddresses] =
    useState<ZodGenerateAddressesResponse>([]);
  const updateSystemPrompt = useCallback((language: Language, prompt: string) => {
    setSystemPrompt({ language, prompt });
  }, []);
  const updateUserPrompt = useCallback(
    (prompt: UserPrompt) => {
      if (prompt === userPrompt) return;
      setUserPrompt(prompt);
    },
    [userPrompt]
  );
  const saveGeneratedAddresses = useCallback(
    (addresses: ZodGenerateAddressesResponse) => {
      setGeneratedAddresses(addresses);
    },
    []
  );

  return (
    <AddressContext.Provider
      value={{
        userPrompt,
        systemPrompt,
        generatedAddresses,
        updateSystemPrompt,
        updateUserPrompt,
        saveGeneratedAddresses,
      }}
    >
      {children}
    </AddressContext.Provider>
  );
}
export { AddressContext };
