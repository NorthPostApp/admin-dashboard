import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "sonner";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useGenerateAddressesMutation } from "./useGenerateAddressesMutation";
import { generateAddresses } from "@/api/address";
import type {
  GenerateAddressesRequestSchema,
  GenerateAddressesResponseSchema,
} from "@/schemas/address-schema";

vi.mock("sonner");
vi.mock("@/api/address");

const MOCK_REQUEST_BODY: GenerateAddressesRequestSchema = {
  language: "EN",
  systemPrompt: "Generate addresses for tech companies",
  prompt: "Create two tech-related addresses",
  model: "gpt-5-mini",
  reasoningEffort: "medium",
};

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useGenerateAddressesMutation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should successfully generate addresses and call saveResultFn", async () => {
    const mockResponse: GenerateAddressesResponseSchema = [
      {
        id: "addr-1",
        name: "Tech Hub",
        tags: ["technology", "startup"],
        briefIntro: "A vibrant technology hub with modern facilities",
        address: {
          city: "San Francisco",
          country: "USA",
          line1: "123 Tech Street",
          line2: "Suite 100",
          buildingName: "Innovation Center",
          postalCode: "94102",
          region: "California",
        },
      },
      {
        id: "addr-2",
        name: "Coffee Shop",
        tags: ["coffee", "cafe"],
        briefIntro: "Cozy coffee shop with artisan brews",
        address: {
          city: "Seattle",
          country: "USA",
          line1: "456 Coffee Ave",
          line2: "",
          buildingName: "",
          postalCode: "98101",
          region: "Washington",
        },
      },
    ];
    vi.mocked(generateAddresses).mockResolvedValue(mockResponse);
    const saveResultFn = vi.fn();
    const { result } = renderHook(() => useGenerateAddressesMutation(saveResultFn), {
      wrapper: createWrapper(),
    });
    result.current.mutate(MOCK_REQUEST_BODY);
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(generateAddresses).toHaveBeenCalledWith(MOCK_REQUEST_BODY);
    expect(saveResultFn).toHaveBeenCalledWith(mockResponse);
    expect(toast.success).toHaveBeenCalled();
  });

  it("should show error toast when generation returns empty results", async () => {
    const mockResponse: GenerateAddressesResponseSchema = [];
    vi.mocked(generateAddresses).mockResolvedValue(mockResponse);
    const saveResultFn = vi.fn();
    const { result } = renderHook(() => useGenerateAddressesMutation(saveResultFn), {
      wrapper: createWrapper(),
    });
    result.current.mutate(MOCK_REQUEST_BODY);
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(generateAddresses).toHaveBeenCalledWith(MOCK_REQUEST_BODY);
    expect(saveResultFn).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalled();
    expect(toast.success).not.toHaveBeenCalled();
  });

  it("should handle API errors and show error toast", async () => {
    const errorMessage = "Failed to generate addresses: API error";
    vi.mocked(generateAddresses).mockRejectedValue(new Error(errorMessage));
    const saveResultFn = vi.fn();
    const { result } = renderHook(() => useGenerateAddressesMutation(saveResultFn), {
      wrapper: createWrapper(),
    });
    result.current.mutate(MOCK_REQUEST_BODY);
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(generateAddresses).toHaveBeenCalledWith(MOCK_REQUEST_BODY);
    expect(saveResultFn).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith(errorMessage);
    expect(toast.success).not.toHaveBeenCalled();
  });
});
