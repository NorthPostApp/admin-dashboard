import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../useAuthContext";
import { type Language } from "@/consts/app-config";
import { getAllAddresses, type GetAllAddressesRequest } from "@/api/address";

export function useGetAllAddressesQuery(
  language: Language,
  tags?: string[],
  limit?: number,
) {
  const { user } = useAuthContext();
  const query = useQuery({
    queryKey: ["allAddresses", "language", ...(tags || []), limit || 0],
    queryFn: async ({ signal }) => {
      const idToken = (await user?.getIdToken()) || "";
      const requestBody: GetAllAddressesRequest = {
        language,
        tags,
        limit,
      };
      return getAllAddresses(requestBody, idToken, signal);
    },
    enabled: false,
  });
  return query;
}
