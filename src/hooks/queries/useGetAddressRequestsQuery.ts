import type { Language } from "@/consts/app-config";
import type { AddressRequestStatus } from "@/schemas/address-request";
import { useAuthContext } from "../useAuthContext";
import { useQuery } from "@tanstack/react-query";
import { getAddressRequestList } from "@/api/address-requests";

export function useGetAddressRequestQuery(
  language: Language,
  status: AddressRequestStatus,
) {
  const { user } = useAuthContext();
  const query = useQuery({
    queryKey: ["address-request", "get", language, status],
    queryFn: async ({ signal }) => {
      const idToken = (await user?.getIdToken()) || "";
      return getAddressRequestList(language, status, idToken, signal);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 0,
  });
  return query;
}
