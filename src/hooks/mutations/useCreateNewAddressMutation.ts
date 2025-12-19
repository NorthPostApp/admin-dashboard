import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import type { ZodNewAddressRequest } from "@/schemas/address-schema";
import { createNewAddress, type CreateNewAddressResponse } from "@/api/address";

export function useCreateNewAddressMutation(delay: number = 200) {
  const mutation = useMutation({
    mutationFn: (value: ZodNewAddressRequest) => {
      return new Promise<CreateNewAddressResponse>((resolve) =>
        // add some deliberate delay to avoid re-submissions
        setTimeout(() => resolve(createNewAddress(value)), delay)
      );
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data: CreateNewAddressResponse) => {
      toast.success(`Address item ${data.id} has been created.`);
    },
  });
  return mutation;
}
