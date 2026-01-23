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
import { useAddressContext } from "../useAddressContext";

export function useGenerateAddressesMutation() {
  const { t } = useTranslation("address:newAddress");
  const { user } = useAuthContext();
  const { setGeneratingState, saveGeneratedAddresses } = useAddressContext();
  const abortControllerRef = useRef<AbortController | null>(null);

  const mutation = useMutation({
    mutationFn: async (requestBody: GenerateAddressesRequestSchema) => {
      setGeneratingState(true);
      abortControllerRef.current?.abort(); // clean up if there exists a current controller
      abortControllerRef.current = new AbortController();
      const idToken = (await user?.getIdToken()) || "";
      return generateAddresses(requestBody, idToken, abortControllerRef.current.signal);
    },
    onError: (error) => {
      setGeneratingState(false);
      if (error.name === "AbortError" || error.name === "CanceledError") {
        toast.info(`${t("failed.canceled")}`);
        return;
      }
      toast.error(error.message);
    },
    onSuccess: (data: GenerateAddressesResponseSchema) => {
      setGeneratingState(false);
      const names = data.map((address) => address.name);
      if (names.length === 0) {
        toast.error(`${t("failed.generated")}`);
        return;
      }
      saveGeneratedAddresses(data);
      toast.success(`${t("success.generated")}: ${names.join(", ")}`);
    },
  });

  const cancelRequest = () => {
    abortControllerRef.current?.abort();
    setGeneratingState(false);
  };

  return { ...mutation, cancelRequest };
}
