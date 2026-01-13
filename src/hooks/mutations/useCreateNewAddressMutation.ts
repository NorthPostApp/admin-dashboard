import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import type { AddressItemSchema, NewAddressRequestSchema } from "@/schemas/address";
import { createNewAddress, type CreateNewAddressResponse } from "@/api/address";
import { useTranslation } from "react-i18next";
import { useAuthContext } from "../useAuthContext";
import { useAppContext } from "../useAppContext";

export function useCreateNewAddressMutation(cleanupFn?: () => void, delay: number = 200) {
  const { t } = useTranslation("address:newAddress");
  const { language } = useAppContext();
  const { user } = useAuthContext();
  const mutation = useMutation({
    mutationFn: async (value: AddressItemSchema) => {
      const requestData: NewAddressRequestSchema = {
        ...(value as NewAddressRequestSchema),
        language,
      };
      const idToken = (await user?.getIdToken()) || "";
      await new Promise((resolve) => setTimeout(resolve, delay));
      // add some deliberate delay to avoid submission race conditions
      return createNewAddress(requestData, idToken);
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
