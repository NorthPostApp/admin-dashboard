import { useRef } from "react";
import { updateAddressRequest } from "@/api/address-requests";
import { useAuthContext } from "@/hooks/useAuthContext";
import { useMutation } from "@tanstack/react-query";
import { useAppContext } from "@/hooks/useAppContext";
import type { AddressRequest } from "@/schemas/address-request";
import { toast } from "sonner";

export function useUpdateAddressRequestMutation(
  updateStateFn: (request: AddressRequest) => void,
) {
  const { user } = useAuthContext();
  const { language } = useAppContext();
  const abortControllerRef = useRef<AbortController>(null);
  const mutation = useMutation({
    mutationFn: async (updatedRequest: AddressRequest) => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
      abortControllerRef.current = new AbortController();
      const idToken = await user?.getIdToken();
      if (!idToken) throw new Error("user id token is required");
      return updateAddressRequest(
        language,
        updatedRequest,
        idToken,
        abortControllerRef.current.signal,
      );
    },
    onSuccess: (response: AddressRequest) => {
      updateStateFn(response);
      toast.success(`Request ${response.id} updated`);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return mutation;
}
