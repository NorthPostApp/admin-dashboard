import type {
  GenerateAddressesRequestSchema,
  GenerateAddressesResponseSchema,
  GetAllAddressesResponseSchema,
  NewAddressRequestSchema,
} from "@/schemas/address";
import type { Language } from "@/consts/app-config";

type ServiceError = { error: string };

type GetAllAddressesRequest = {
  language: Language;
  tags?: string[];
  limit?: number;
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
  return (await response.json()).data as GetAllAddressesResponseSchema;
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
  type CreateNewAddressResponse,
  type GetSystemPromptResponse,
  type GetAllAddressesRequest,
};
