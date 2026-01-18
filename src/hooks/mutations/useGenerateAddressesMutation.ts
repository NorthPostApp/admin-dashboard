import { useRef } from "react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { generateAddresses } from "@/api/address";
import type {
  GenerateAddressesRequestSchema,
  GenerateAddressesResponseSchema,
} from "@/schemas/address";
import { useTranslation } from "react-i18next";
import { useAuthContext } from "../useAuthContext";

export function useGenerateAddressesMutation(
  saveResultFn: (results: GenerateAddressesResponseSchema) => void,
) {
  const { t } = useTranslation("address:newAddress");
  const { user } = useAuthContext();
  const abortControllerRef = useRef<AbortController | null>(null);

  const mutation = useMutation({
    mutationFn: async (requestBody: GenerateAddressesRequestSchema) => {
      abortControllerRef.current?.abort(); // clean up if there exists a current controller
      abortControllerRef.current = new AbortController();

      const idToken = (await user?.getIdToken()) || "";
      return generateAddresses(requestBody, idToken, abortControllerRef.current.signal);
    },
    onError: (error) => {
      if (error.name === "AbortError" || error.name === "CanceledError") {
        toast.info(`${t("failed.canceled")}`);
        return;
      }
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

  const cancelRequest = () => {
    abortControllerRef.current?.abort();
  };

  return { ...mutation, cancelRequest };
}
