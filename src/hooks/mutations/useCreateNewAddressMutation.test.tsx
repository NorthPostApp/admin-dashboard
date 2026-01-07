import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "sonner";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useCreateNewAddressMutation } from "./useCreateNewAddressMutation";
import { createNewAddress } from "@/api/address";
import { getDefaultForm, type NewAddressRequestSchema } from "@/schemas/address-schema";
import type { CreateNewAddressResponse } from "@/api/address";
import AuthContextProvider from "@/contexts/AuthContextProvider";
import { MOCK_ID_TOKEN } from "@/lib/test-utils";

vi.mock("sonner");
vi.mock("@/api/address");

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>{children}</AuthContextProvider>
    </QueryClientProvider>
  );
};

describe("useCreateNewAddressMutation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should successfully create a new address", async () => {
    const mockResponse: CreateNewAddressResponse = {
      id: "123",
    };
    vi.mocked(createNewAddress).mockResolvedValue(mockResponse);
    const { result } = renderHook(() => useCreateNewAddressMutation(), {
      wrapper: createWrapper(),
    });
    const requestData: NewAddressRequestSchema = getDefaultForm("ZH");
    result.current.mutate(requestData);
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(createNewAddress).toHaveBeenCalledWith(requestData, MOCK_ID_TOKEN);
    expect(toast.success).toHaveBeenCalledWith("Address item has been saved: 123");
  });

  it("should call clean up function when succeeded", async () => {
    const mockResponse: CreateNewAddressResponse = {
      id: "123",
    };
    vi.mocked(createNewAddress).mockResolvedValue(mockResponse);
    const cleanupFn = vi.fn();
    const { result } = renderHook(() => useCreateNewAddressMutation(cleanupFn), {
      wrapper: createWrapper(),
    });
    const requestData: NewAddressRequestSchema = getDefaultForm("ZH");
    result.current.mutate(requestData);
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(cleanupFn).toHaveBeenCalled();
  });

  it("should handle errors and show error toast", async () => {
    const errorMessage = "Failed to create address";
    vi.mocked(createNewAddress).mockRejectedValue(new Error(errorMessage));
    const { result } = renderHook(() => useCreateNewAddressMutation(), {
      wrapper: createWrapper(),
    });
    const requestData: NewAddressRequestSchema = getDefaultForm("ZH");
    result.current.mutate(requestData);
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(toast.error).toHaveBeenCalledWith(errorMessage);
  });
});
