import { BASE_URL, type ServiceError } from "@/api/shared";
import type { Language } from "@/consts/app-config";
import { TypesenseInfo, TypesenseSyncResult } from "@/schemas/typesense";

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

async function syncAddressesWithTypesense(
  language: Language,
  idToken: string,
  signal: AbortSignal,
) {
  const url = BASE_URL + "/address/sync";
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ language: language }),
    signal,
  });
  if (!response.ok) {
    const errorData = (await response.json()) as ServiceError;
    const errorMessage = errorData.error || `Error syncing addresses`;
    throw new Error(errorMessage);
  }
  const syncResult = (await response.json()).data;
  return TypesenseSyncResult.parse(syncResult);
}

export { getTypesenseInfo, syncAddressesWithTypesense };
