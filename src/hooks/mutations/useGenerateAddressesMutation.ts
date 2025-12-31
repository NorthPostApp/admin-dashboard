import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { generateAddresses } from "@/api/address";
import type {
  GenerateAddressesRequestSchema,
  GenerateAddressesResponseSchema,
} from "@/schemas/address-schema";

export function useGenerateAddressesMutation(
  saveResultFn: (results: GenerateAddressesResponseSchema) => void
) {
  const mutation = useMutation({
    mutationFn: (requestBody: GenerateAddressesRequestSchema) => {
      return generateAddresses(requestBody);
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data: GenerateAddressesResponseSchema) => {
      const names = data.map((address) => address.name);
      if (names.length === 0) {
        toast.error(`failed to recognize the user prompt, got 0 result.`);
        return;
      }
      saveResultFn(data);
      toast.success(`addresses generated successfully: ${names.join(", ")}`);
    },
  });
  return mutation;
}
