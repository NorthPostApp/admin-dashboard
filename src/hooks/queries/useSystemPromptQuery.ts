import { getSystemPrompt } from "@/api/address";
import type { Language } from "@/consts/app-config";
import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../useAuthContext";

// this is a lazy query that requires refetch to get data
export function useSystemPromptQuery(language: Language) {
  const { user } = useAuthContext();
  const query = useQuery({
    queryKey: ["address", "systemPrompt", language],
    queryFn: async ({ signal }) => {
      const idToken = (await user?.getIdToken()) || "";
      return getSystemPrompt(language, idToken, signal);
    },
    enabled: false,
  });
  return query;
}
