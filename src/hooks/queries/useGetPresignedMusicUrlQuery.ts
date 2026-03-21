import { getPresignedMusicUrl } from "@/api/music";
import { useAuthContext } from "@/hooks/useAuthContext";
import { useQuery } from "@tanstack/react-query";

export function useGetPresignedMusicUrlQuery(filename: string) {
  const { user } = useAuthContext();
  const query = useQuery({
    queryKey: ["musicUrl", filename],
    queryFn: async ({ signal }) => {
      const idToken = (await user?.getIdToken()) || "";
      return getPresignedMusicUrl(idToken, filename, signal);
    },
    enabled: false,
  });
  return query;
}
