import { getMusicList } from "@/api/music";
import { useAuthContext } from "@/hooks/useAuthContext";
import { useQuery } from "@tanstack/react-query";

export function useGetMusicListQuery(refresh: boolean = false) {
  const { user } = useAuthContext();
  const query = useQuery({
    queryKey: ["musicList"],
    queryFn: async ({ signal }) => {
      const idToken = (await user?.getIdToken()) || "";
      return getMusicList(idToken, refresh, signal);
    },
    enabled: false,
  });
  return query;
}
