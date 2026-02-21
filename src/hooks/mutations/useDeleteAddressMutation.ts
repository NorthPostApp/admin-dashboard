import { useRef } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import { deleteAddress, type DeleteAddressResponse } from "@/api/address";
import { useAuthContext } from "@/hooks/useAuthContext";
import { useAppContext } from "@/hooks/useAppContext";
import { useAddressDataContext } from "@/hooks/useAddressDataContext";

export function useDeleteAddressMutation() {
  const { user } = useAuthContext();
  const { t } = useTranslation("address:viewAddress");
  const { language } = useAppContext();
  const { deleteSingleAddressData } = useAddressDataContext();
  const abortControllerRef = useRef<AbortController | null>(null);
  const mutation = useMutation({
    mutationFn: async (addressId: string) => {
      abortControllerRef?.current?.abort();
      abortControllerRef.current = new AbortController();
      const idToken = (await user?.getIdToken()) || "";
      return deleteAddress(
        addressId,
        language,
        idToken,
        abortControllerRef.current.signal,
      );
    },
    onError: (error) => {
      if (error.name === "AbortError" || error.name === "CanceledError") {
        toast.info(t("deleteResult.cancelled"));
        return;
      }
      toast.error(t("deleteResult.failed") + " " + error.message);
    },
    onSuccess: (data: DeleteAddressResponse) => {
      deleteSingleAddressData(data.id);
      toast.success(t("deleteResult.success") + " " + data.id);
    },
  });
  return mutation;
}
