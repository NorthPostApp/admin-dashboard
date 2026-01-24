import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../useAuthContext";
import { type Language } from "@/consts/app-config";
import { getAllAddresses, type GetAllAddressesRequest } from "@/api/address";

const defaultPageSize = 10;

export function useGetAllAddressesQuery(
  language: Language,
  tags?: string[],
  lastDocId?: string,
) {
  const { user } = useAuthContext();
  const query = useQuery({
    queryKey: ["allAddresses", "language", ...(tags || []), lastDocId || ""],
    queryFn: async ({ signal }) => {
      const idToken = (await user?.getIdToken()) || "";
      const requestBody: GetAllAddressesRequest = {
        language,
        tags: tags || [],
        pageSize: defaultPageSize,
        lastDocId: lastDocId || "",
      };
      return getAllAddresses(requestBody, idToken, signal);
    },
    enabled: false,
  });
  return query;
}
