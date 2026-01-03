import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import type { NewAddressRequestSchema } from "@/schemas/address-schema";
import { createNewAddress, type CreateNewAddressResponse } from "@/api/address";
import { useTranslation } from "react-i18next";

export function useCreateNewAddressMutation(cleanupFn?: () => void, delay: number = 200) {
  const { t } = useTranslation("address:newAddress");
  const mutation = useMutation({
    mutationFn: (value: NewAddressRequestSchema) => {
      return new Promise<CreateNewAddressResponse>((resolve) =>
        // add some deliberate delay to avoid re-submissions
        setTimeout(() => {
          resolve(createNewAddress(value));
        }, delay)
      );
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data: CreateNewAddressResponse) => {
      if (cleanupFn) cleanupFn();
      toast.success(`${t("success.saved")}: ${data.id}`);
    },
  });
  return mutation;
}
