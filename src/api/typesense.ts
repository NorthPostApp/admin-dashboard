import { BASE_URL, type ServiceError } from "@/api/shared";
import { TypesenseInfo } from "@/schemas/typesense";

async function getTypesenseInfo(idToken: string, signal: AbortSignal) {
  const url = BASE_URL + "/typesense/info";
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
    signal,
  });
  if (!response.ok) {
    const errorData = (await response.json()) as ServiceError;
    const errorMessage = errorData.error || `Error getting Typesense system info`;
    throw new Error(errorMessage);
  }
  const typesenseInfo = (await response.json()).data;
  return TypesenseInfo.parse(typesenseInfo);
}

export { getTypesenseInfo };
