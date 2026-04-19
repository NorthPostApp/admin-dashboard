import { useRef } from "react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { syncAddressesWithTypesense } from "@/api/typesense";
import type { TypesenseSyncResultSchema } from "@/schemas/typesense";
import { useAppContext } from "@/hooks/useAppContext";
import { useAuthContext } from "@/hooks/useAuthContext";
import { useTranslation } from "react-i18next";

export function useSyncTypesenseMutation() {
  const { language } = useAppContext();
  const { user } = useAuthContext();
  const { t } = useTranslation("address:overview");
  const abortControllerRef = useRef<AbortController | null>(null);

  const mutation = useMutation({
    mutationFn: async () => {
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();
      const idToken = (await user?.getIdToken()) || "";
      return syncAddressesWithTypesense(
        language,
        idToken,
        abortControllerRef.current.signal,
      );
    },
    onError: (error) => {
      if (error.name === "AbortError" || error.name === "CanceledError") {
        toast.info("request cancelled");
        return;
      }
      toast.error(error.message);
    },
    onSuccess: (data: TypesenseSyncResultSchema) => {
      toast.success(
        t("syncResult.success", {
          total: data.total,
          success: data.success,
          failed: data.failed,
        }),
      );
    },
  });
  return mutation;
}
