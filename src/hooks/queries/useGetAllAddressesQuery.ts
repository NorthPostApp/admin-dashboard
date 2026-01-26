import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../useAuthContext";
import { DEFAULT_PAGE_FETCH_SIZE, type Language } from "@/consts/app-config";
import { getAllAddresses, type GetAllAddressesRequest } from "@/api/address";

export function useGetAllAddressesQuery(
  language: Language,
  tags?: string[],
  lastDocId?: string,
  refresh?: boolean,
) {
  const { user } = useAuthContext();
  const query = useQuery({
    queryKey: ["allAddresses", language, ...(tags || []), lastDocId || "", refresh],
    queryFn: async ({ signal }) => {
      const idToken = (await user?.getIdToken()) || "";
      const requestBody: GetAllAddressesRequest = {
        language,
        tags: tags || [],
        pageSize: DEFAULT_PAGE_FETCH_SIZE,
        lastDocId: refresh ? "" : lastDocId || "",
      };
      return getAllAddresses(requestBody, idToken, signal);
    },
    enabled: false,
  });
  return query;
}
