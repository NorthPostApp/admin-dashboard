import {
  GetAllAddressesResponse,
  GetAllTagsResponse,
  type GenerateAddressesRequestSchema,
  type GenerateAddressesResponseSchema,
  type NewAddressRequestSchema,
  type UpdateAddressRequestSchema,
  type UpdateAddressResponseSchema,
} from "@/schemas/address";
import type { Language } from "@/consts/app-config";

type ServiceError = { error: string };

type GetAllAddressesRequest = {
  language: Language;
  tags?: string[];
  pageSize?: number;
  lastDocId?: string;
};

type GetSystemPromptResponse = { data: string };
type CreateNewAddressResponse = { id: string };

const BASE_URL = import.meta.env.VITE_ADMIN_ENDPOINT;

async function createNewAddress(data: NewAddressRequestSchema, idToken: string) {
  const response = await fetch(BASE_URL + "/address", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = (await response.json()) as ServiceError;
    const errorMessage =
      errorData.error || `Error creating new address: ${response.status}`;
    throw new Error(errorMessage);
  }
  return (await response.json()) as CreateNewAddressResponse;
}

async function updateAddress(requestBody: UpdateAddressRequestSchema, idToken: string) {
  const response = await fetch(BASE_URL + "/address/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorData = (await response.json()) as ServiceError;
    const errorMessage = errorData.error || `Error updating address: ${response.status}`;
    throw new Error(errorMessage);
  }
  return (await response.json()) as UpdateAddressResponseSchema;
}

async function getAllAddresses(
  requestBody: GetAllAddressesRequest,
  idToken: string,
  signal?: AbortSignal,
) {
  const response = await fetch(BASE_URL + "/address", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify(requestBody),
    signal,
  });
  if (!response.ok) {
    const errorData = (await response.json()) as ServiceError;
    const errorMessage =
      errorData.error || `Error getting all addresses: ${response.status}`;
    throw new Error(errorMessage);
  }
  const addressData = (await response.json()).data;
  return GetAllAddressesResponse.parse(addressData);
}

async function generateAddresses(
  requestBody: GenerateAddressesRequestSchema,
  idToken: string,
  signal?: AbortSignal,
) {
  const response = await fetch(`${BASE_URL}/address/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify(requestBody),
    signal,
  });
  if (!response.ok) {
    const errorData = (await response.json()) as ServiceError;
    const errorMessage =
      errorData.error || `Error generating new address: ${response.status}`;
    throw new Error(errorMessage);
  }
  return (await response.json()).data as GenerateAddressesResponseSchema;
}

async function getAllTags(
  language: Language,
  idToken: string,
  refresh?: boolean,
  signal?: AbortSignal,
) {
  const url = new URL(`${BASE_URL}/address/tags`);
  url.searchParams.set("language", language);
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
      errorData.error || `Error ${refresh ? "refreshing" : "getting"} tags`;
    throw new Error(errorMessage);
  }
  const data = (await response.json()).data;
  return GetAllTagsResponse.parse(data);
}

async function getSystemPrompt(
  language: Language,
  idToken: string,
  signal?: AbortSignal,
) {
  const response = await fetch(`${BASE_URL}/prompt/system/address?language=${language}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
    signal,
  });
  if (!response.ok) {
    const errorData = (await response.json()) as ServiceError;
    const errorMessage =
      errorData.error || `Error getting system prompt: ${response.status}`;
    throw new Error(errorMessage);
  }
  return (await response.json()) as GetSystemPromptResponse;
}

export {
  createNewAddress,
  getSystemPrompt,
  generateAddresses,
  getAllAddresses,
  updateAddress,
  getAllTags,
  type CreateNewAddressResponse,
  type GetSystemPromptResponse,
  type GetAllAddressesRequest,
};
