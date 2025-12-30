import { getSystemPrompt } from "@/api/address";
import type { Language } from "@/consts/app-config";
import { useQuery } from "@tanstack/react-query";

// this is a lazy query that requires refetch to get data
export function useSystemPromptQuery(language: Language) {
  const query = useQuery({
    queryKey: ["address", "systemPrompt", language],
    queryFn: async ({ signal }) => await getSystemPrompt(language, signal),
    enabled: false,
  });
  return query;
}
