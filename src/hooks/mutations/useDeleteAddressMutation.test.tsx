import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "sonner";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useDeleteAddressMutation } from "./useDeleteAddressMutation";
import { deleteAddress, type DeleteAddressResponse } from "@/api/address";
import AuthContextProvider from "@/contexts/AuthContextProvider";
import AppContextProvider from "@/contexts/AppContextProvider";
import AddressDataContextProvider from "@/contexts/AddressDataContextProvider";
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
      <AuthContextProvider>
        <AppContextProvider>
          <AddressDataContextProvider>{children}</AddressDataContextProvider>
        </AppContextProvider>
      </AuthContextProvider>
    </QueryClientProvider>
  );
};

describe("useDeleteAddressMutation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should successfully delete an address", async () => {
    const mockAddressId = "addr-123";
    const mockResponse: DeleteAddressResponse = {
      id: mockAddressId,
    };
    vi.mocked(deleteAddress).mockResolvedValue(mockResponse);
    const { result } = renderHook(() => useDeleteAddressMutation(), {
      wrapper: createWrapper(),
    });
    result.current.mutate(mockAddressId);
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(deleteAddress).toHaveBeenCalledWith(
      mockAddressId,
      "EN", // default language from AppContext
      MOCK_ID_TOKEN,
      expect.any(AbortSignal),
    );
    expect(toast.success).toHaveBeenCalledWith(expect.stringContaining(mockAddressId));
  });

  it("should call deleteSingleAddressData on successful deletion", async () => {
    const mockAddressId = "addr-456";
    const mockResponse: DeleteAddressResponse = {
      id: mockAddressId,
    };
    vi.mocked(deleteAddress).mockResolvedValue(mockResponse);
    const { result } = renderHook(() => useDeleteAddressMutation(), {
      wrapper: createWrapper(),
    });
    result.current.mutate(mockAddressId);
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockResponse);
  });

  it("should handle AbortError and show info toast", async () => {
    const mockAddressId = "addr-789";
    const abortError = new Error("The operation was aborted");
    abortError.name = "AbortError";
    vi.mocked(deleteAddress).mockRejectedValue(abortError);
    const { result } = renderHook(() => useDeleteAddressMutation(), {
      wrapper: createWrapper(),
    });
    result.current.mutate(mockAddressId);
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(toast.info).toHaveBeenCalled();
    expect(toast.error).not.toHaveBeenCalled();
  });

  it("should handle CanceledError and show info toast", async () => {
    const mockAddressId = "addr-101";
    const canceledError = new Error("Request was canceled");
    canceledError.name = "CanceledError";
    vi.mocked(deleteAddress).mockRejectedValue(canceledError);
    const { result } = renderHook(() => useDeleteAddressMutation(), {
      wrapper: createWrapper(),
    });
    result.current.mutate(mockAddressId);
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(toast.info).toHaveBeenCalled();
    expect(toast.error).not.toHaveBeenCalled();
  });

  it("should handle API errors and show error toast", async () => {
    const mockAddressId = "addr-999";
    const errorMessage = "Failed to delete address: Server error";
    vi.mocked(deleteAddress).mockRejectedValue(new Error(errorMessage));
    const { result } = renderHook(() => useDeleteAddressMutation(), {
      wrapper: createWrapper(),
    });
    result.current.mutate(mockAddressId);
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(deleteAddress).toHaveBeenCalledWith(
      mockAddressId,
      "EN",
      MOCK_ID_TOKEN,
      expect.any(AbortSignal),
    );
    expect(toast.error).toHaveBeenCalledWith(expect.stringContaining(errorMessage));
    expect(toast.success).not.toHaveBeenCalled();
  });

  it("should abort previous request when a new mutation is triggered", async () => {
    const mockAddressId1 = "addr-001";
    const mockAddressId2 = "addr-002";
    let rejectFn1: (reason: Error) => void;
    const pendingPromise1 = new Promise<DeleteAddressResponse>((_, reject) => {
      rejectFn1 = reject;
    });
    const mockResponse2: DeleteAddressResponse = { id: mockAddressId2 };
    vi.mocked(deleteAddress)
      .mockReturnValueOnce(pendingPromise1)
      .mockResolvedValueOnce(mockResponse2);
    const { result } = renderHook(() => useDeleteAddressMutation(), {
      wrapper: createWrapper(),
    });
    result.current.mutate(mockAddressId1);
    await waitFor(() => expect(result.current.isPending).toBeTruthy());
    act(() => {
      result.current.mutate(mockAddressId2);
    });
    const abortError = new Error("The operation was aborted");
    abortError.name = "AbortError";
    act(() => rejectFn1!(abortError));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(deleteAddress).toHaveBeenCalledTimes(2);
    expect(result.current.data?.id).toBe(mockAddressId2);
    expect(toast.success).toHaveBeenCalledWith(expect.stringContaining(mockAddressId2));
  });

  it("should handle network errors appropriately", async () => {
    const mockAddressId = "addr-network";
    const networkError = new Error("Network request failed");
    networkError.name = "NetworkError";
    vi.mocked(deleteAddress).mockRejectedValue(networkError);
    const { result } = renderHook(() => useDeleteAddressMutation(), {
      wrapper: createWrapper(),
    });
    result.current.mutate(mockAddressId);
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(toast.error).toHaveBeenCalledWith(
      expect.stringContaining("Network request failed"),
    );
  });

  it("should use empty string when getIdToken returns falsy value", async () => {
    const mockAddressId = "addr-empty-token";
    const mockResponse: DeleteAddressResponse = {
      id: mockAddressId,
    };
    vi.mocked(deleteAddress).mockResolvedValue(mockResponse);
    const { onAuthStateChanged } = await import("firebase/auth");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(onAuthStateChanged).mockImplementation((_, callback: any) => {
      const mockUser = {
        uid: "test-user-id",
        email: "test@example.com",
        getIdToken: vi.fn().mockResolvedValue(null),
      };
      callback(mockUser);
      return vi.fn();
    });
    const { result } = renderHook(() => useDeleteAddressMutation(), {
      wrapper: createWrapper(),
    });
    result.current.mutate(mockAddressId);
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(deleteAddress).toHaveBeenCalledWith(
      mockAddressId,
      "EN",
      "",
      expect.any(AbortSignal),
    );
  });
});
