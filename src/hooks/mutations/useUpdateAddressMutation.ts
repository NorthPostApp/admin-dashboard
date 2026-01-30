import type {
  UpdateAddressRequestSchema,
  UpdateAddressResponseSchema,
} from "@/schemas/address";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useAuthContext } from "../useAuthContext";
import { updateAddress } from "@/api/address";
import { useAddressDataContext } from "../useAddressDataContext";

export function useUpdateAddressMutation() {
  const { user } = useAuthContext();
  const { updateSingleAddressData } = useAddressDataContext();
  const mutation = useMutation({
    mutationFn: async (requestBody: UpdateAddressRequestSchema) => {
      const idToken = (await user?.getIdToken()) || "";
      return updateAddress(requestBody, idToken);
    },
    onSuccess: (response: UpdateAddressResponseSchema) => {
      updateSingleAddressData(response.data);
      toast.success(`Address ${response.data.id} updated`);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return mutation;
}
