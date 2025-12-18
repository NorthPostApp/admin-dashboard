import type z from "zod";
import type { NewAddressRequest } from "@/schemas/address-schema";

const BASE_URL = import.meta.env.VITE_ADMIN_ENDPOINT;
const TOKEN = import.meta.env.VITE_BEARER_TOKEN;

async function createNewAddress(data: z.infer<typeof NewAddressRequest>) {
  try {
    const response = await fetch(BASE_URL + "/address", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Error creating new address: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to create new address");
    throw error;
  }
}

export { createNewAddress };
