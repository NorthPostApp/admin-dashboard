import { useState, createContext, useCallback, useMemo } from "react";
import { type Language } from "@/consts/app-config";
import type {
  AddressItemSchema,
  GenerateAddressesResponseSchema,
} from "@/schemas/address";

type SystemPrompt = {
  language: Language; // use to compare app language and prompt language
  prompt: string;
};

type UserPrompt = string;

interface AddressContextType {
  systemPrompt: SystemPrompt | undefined;
  userPrompt: UserPrompt;
  generating: boolean;
  generatedAddresses: GenerateAddressesResponseSchema;
  updateSystemPrompt: (language: Language, prompt: string) => void;
  updateUserPrompt: (prompt: UserPrompt) => void;
  setGeneratingState: (newGeneratingState: boolean) => void;
  saveGeneratedAddresses: (addresses: GenerateAddressesResponseSchema) => void;
  updateGeneratedAddress: (id: string, newAddress: AddressItemSchema) => void;
}

const AddressContext = createContext<AddressContextType | undefined>(undefined);

export default function AddressContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // States that manages address generation process
  const [systemPrompt, setSystemPrompt] = useState<SystemPrompt | undefined>(undefined);
  const [userPrompt, setUserPrompt] = useState<UserPrompt>("");
  const [generating, setGenerating] = useState<boolean>(false);
  const [generatedAddresses, setGeneratedAddresses] =
    useState<GenerateAddressesResponseSchema>([]);

  // Optimize the context to avoid the updated context cause rerendering of children
  const updateSystemPrompt = useCallback((language: Language, prompt: string) => {
    setSystemPrompt({ language, prompt });
  }, []);
  const updateUserPrompt = useCallback(
    (prompt: UserPrompt) => {
      if (prompt === userPrompt) return;
      setUserPrompt(prompt);
    },
    [userPrompt],
  );
  const saveGeneratedAddresses = useCallback(
    (addresses: GenerateAddressesResponseSchema) => {
      setGenerating(false);
      setGeneratedAddresses(addresses);
    },
    [],
  );

  const updateGeneratedAddress = useCallback(
    (id: string, newAddress: AddressItemSchema) => {
      setGeneratedAddresses((prev) =>
        prev.map((address) => {
          if (address.id !== id) return address;
          return { id, ...newAddress };
        }),
      );
    },
    [],
  );

  const setGeneratingState = useCallback((generatingState: boolean) => {
    setGenerating(generatingState);
  }, []);

  const contextValue = useMemo(
    () => ({
      userPrompt,
      systemPrompt,
      generating,
      generatedAddresses,
      updateSystemPrompt,
      updateUserPrompt,
      setGeneratingState,
      saveGeneratedAddresses,
      updateGeneratedAddress,
    }),
    [
      userPrompt,
      systemPrompt,
      generating,
      generatedAddresses,
      updateSystemPrompt,
      updateUserPrompt,
      setGeneratingState,
      saveGeneratedAddresses,
      updateGeneratedAddress,
    ],
  );

  return (
    <AddressContext.Provider value={contextValue}>{children}</AddressContext.Provider>
  );
}
export { AddressContext };
