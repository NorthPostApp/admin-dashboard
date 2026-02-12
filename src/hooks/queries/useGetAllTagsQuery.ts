import type { Language } from "@/consts/app-config";
import { useAuthContext } from "../useAuthContext";
import { useQuery } from "@tanstack/react-query";
import { getAllTags } from "@/api/address";

export function useGetAllTagsQuery(language: Language, refresh: boolean = false) {
  const { user } = useAuthContext();
  const query = useQuery({
    queryKey: ["tags", language, refresh],
    queryFn: async ({ signal }) => {
      const idToken = (await user?.getIdToken()) || "";
      return getAllTags(language, idToken, refresh, signal);
    },
    enabled: false,
  });
  return query;
}
