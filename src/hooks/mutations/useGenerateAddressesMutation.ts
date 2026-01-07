import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { generateAddresses } from "@/api/address";
import type {
  GenerateAddressesRequestSchema,
  GenerateAddressesResponseSchema,
} from "@/schemas/address-schema";
import { useTranslation } from "react-i18next";
import { useAuthContext } from "../useAuthContext";

export function useGenerateAddressesMutation(
  saveResultFn: (results: GenerateAddressesResponseSchema) => void
) {
  const { t } = useTranslation("address:newAddress");
  const { user } = useAuthContext();
  const mutation = useMutation({
    mutationFn: async (requestBody: GenerateAddressesRequestSchema) => {
      const idToken = (await user?.getIdToken()) || "";
      return generateAddresses(requestBody, idToken);
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data: GenerateAddressesResponseSchema) => {
      const names = data.map((address) => address.name);
      if (names.length === 0) {
        toast.error(`${t("failed.generated")}`);
        return;
      }
      saveResultFn(data);
      toast.success(`${t("success.generated")}: ${names.join(", ")}`);
    },
  });
  return mutation;
}
