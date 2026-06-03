import type { Language } from "@/consts/app-config";
import {
  AddressRequestsSchema,
  type AddressRequestStatus,
} from "@/schemas/address-request";
import { BASE_URL, type ServiceError } from "./shared";

const getAddressRequestList = async (
  language: Language,
  status: AddressRequestStatus,
  idToken: string,
  signal?: AbortSignal,
) => {
  if (idToken.length === 0) throw new Error("id token shouldn't be empty");

  const url = new URL(`${BASE_URL}/address-request`);
  url.searchParams.set("language", language);
  url.searchParams.set("status", status);
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
    signal,
  });
  if (!response.ok) {
    const errorData = (await response.json()) as ServiceError;
    const errorMessage = errorData.error || "failed to get address requests";
    throw new Error(errorMessage);
  }
  const parseResult = AddressRequestsSchema.safeParse((await response.json()).data);
  if (!parseResult.success) {
    throw new Error(parseResult.error.message);
  }
  return parseResult.data;
};

export { getAddressRequestList };
