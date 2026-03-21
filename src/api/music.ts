import { BASE_URL, type ServiceError } from "@/api/shared";
import { MusicList, type MusicListSchema } from "@/schemas/music";

async function getMusicList(
  idToken: string,
  refresh?: boolean,
  signal?: AbortSignal,
): Promise<MusicListSchema> {
  const url = new URL(`${BASE_URL}/music`);
  if (refresh) {
    url.searchParams.set("refresh", "true");
  }
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
    signal,
  });
  if (!response.ok) {
    const errorData = (await response.json()) as ServiceError;
    const errorMessage =
      errorData.error || `Error getting music list: ${response.status}`;
    throw new Error(errorMessage);
  }
  const musicListData = (await response.json()).data;
  return MusicList.parse(musicListData);
}

async function getPresignedMusicUrl(
  idToken: string,
  filename: string,
  signal?: AbortSignal,
) {
  const url = new URL(`${BASE_URL}/music/${filename}`);
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
    signal,
  });
  if (!response.ok) {
    const errorData = (await response.json()) as ServiceError;
    const errorMessage =
      errorData.error || `Error getting music url for "${filename}": ${response.status}`;
    throw new Error(errorMessage);
  }
  return (await response.json()).data;
}

export { getMusicList, getPresignedMusicUrl };
