import type z from "zod";
import type { NewAddressRequest } from "@/schemas/address-schema";

type CreateNewAddressResponse = { id: string };
type CreateNewAddressError = { error: string };

const BASE_URL = import.meta.env.VITE_ADMIN_ENDPOINT;
const TOKEN = import.meta.env.VITE_BEARER_TOKEN;

async function createNewAddress(data: z.infer<typeof NewAddressRequest>) {
  const response = await fetch(BASE_URL + "/address", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = (await response.json()) as CreateNewAddressError;
    const errorMessage =
      errorData.error || `Error creating new address: ${response.status}`;
    throw new Error(errorMessage);
  }
  return (await response.json()) as CreateNewAddressResponse;
}

export { createNewAddress, type CreateNewAddressResponse };
