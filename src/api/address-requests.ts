import type { Language } from "@/consts/app-config";
import {
  AddressRequestsSchema,
  AddressRequestSchema,
  type AddressRequest,
  type AddressRequestStatus,
} from "@/schemas/address-request";
import { BASE_URL, type ServiceError } from "./shared";

type UpdateRequestBody = {
  language: Language;
  id: string;
  updatedRequest: AddressRequest;
};

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

const updateAddressRequest = async (
  language: Language,
  updatedRequest: AddressRequest,
  idToken: string,
  signal?: AbortSignal,
) => {
  if (idToken.length === 0) throw new Error("id token shouldn't be empty");
  const url = new URL(`${BASE_URL}/address-request/update`);
  const requestBody: UpdateRequestBody = {
    language,
    id: updatedRequest.id,
    updatedRequest,
  };
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
    signal,
  });
  if (!response.ok) {
    const errorData = (await response.json()) as ServiceError;
    const errorMessage = errorData.error || "failed to update request";
    throw new Error(errorMessage);
  }
  const parsedResponse = AddressRequestSchema.safeParse((await response.json()).data);
  if (!parsedResponse.success) {
    throw new Error(parsedResponse.error.message);
  }
  return parsedResponse.data;
};

export { type UpdateRequestBody };
export { getAddressRequestList, updateAddressRequest };
