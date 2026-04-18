import { QueryClient, queryOptions } from "@tanstack/react-query";
import { getTypesenseInfo } from "@/api/typesense";
import { auth } from "@/lib/firebase";
import { type TypesenseInfoSchema } from "@/schemas/typesense";
import { toast } from "sonner";

const typesenseInfoQueryOptions = (idToken: string) => {
  return queryOptions({
    queryKey: ["systemInfo"],
    queryFn: ({ signal }) => getTypesenseInfo(idToken, signal),
    staleTime: 10000, // avoid aggressive refreshing
  });
};

const typesenseInfoFallback: TypesenseInfoSchema = {
  health: false,
  systemCpuActivePercentage: 0,
  systemDiskTotalBytes: 0,
  systemDiskUsedBytes: 0,
  systemMemoryTotalBytes: 0,
  systemMemoryUsedBytes: 0,
  systemNetworkSentBytes: 0,
  systemNetworkReceivedBytes: 0,
};

function typesenseInfoLoader(queryClient: QueryClient) {
  return async () => {
    try {
      await auth.authStateReady();
      const idToken = (await auth.currentUser?.getIdToken()) || "";
      return await queryClient.fetchQuery(typesenseInfoQueryOptions(idToken));
    } catch {
      toast.error("failed to get typesense server status");
      return typesenseInfoFallback;
    }
  };
}

export { typesenseInfoLoader };
