import type {
  ZodGenerateAddressesRequest,
  ZodGenerateAddressesResponse,
  ZodNewAddressRequest,
} from "@/schemas/address-schema";
import type { Language } from "@/consts/app-config";

type ServiceError = { error: string };
type CreateNewAddressResponse = { id: string };
type GetSystemPromptResponse = { data: string };

const BASE_URL = import.meta.env.VITE_ADMIN_ENDPOINT;
const TOKEN = import.meta.env.VITE_BEARER_TOKEN;

async function createNewAddress(data: ZodNewAddressRequest) {
  const response = await fetch(BASE_URL + "/address", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
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

async function generateAddresses(requestBody: ZodGenerateAddressesRequest) {
  const response = await fetch(`${BASE_URL}/address/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify(requestBody),
  });
  if (!response.ok) {
    const errorData = (await response.json()) as ServiceError;
    const errorMessage =
      errorData.error || `Error generating new address: ${response.status}`;
    throw new Error(errorMessage);
  }
  return (await response.json()).data as ZodGenerateAddressesResponse;
}

async function getSystemPrompt(language: Language, signal?: AbortSignal) {
  const response = await fetch(`${BASE_URL}/prompt/system/address?language=${language}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
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
  type CreateNewAddressResponse,
  type GetSystemPromptResponse,
};
