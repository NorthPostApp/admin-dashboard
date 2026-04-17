import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../useAuthContext";
import { DEFAULT_PAGE_SIZE, type Language } from "@/consts/app-config";
import { getAddresses, type GetAddressesRequest } from "@/api/address";

export function useGetAddressesQuery(
  language: Language,
  page: number,
  keywords?: string,
  tags?: string[],
  refresh?: boolean,
) {
  const { user } = useAuthContext();
  const query = useQuery({
    queryKey: ["allAddresses", language, ...(tags || []), keywords || "", refresh],
    queryFn: async ({ signal }) => {
      const idToken = (await user?.getIdToken()) || "";
      const requestBody: GetAddressesRequest = {
        language,
        page: refresh ? 1 : page,
        pageSize: DEFAULT_PAGE_SIZE,
        keywords: keywords || "",
        tags: tags || [],
      };
      return getAddresses(requestBody, idToken, signal);
    },
    enabled: false,
  });
  return query;
}
