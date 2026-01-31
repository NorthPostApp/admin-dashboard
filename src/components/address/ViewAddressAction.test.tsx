import { describe, it, vi, expect, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithProviders } from "@/lib/test-wrappers";
import ViewAddressActions from "./ViewAddressActions";
import type { AddressItemWithTimeSchema } from "@/schemas/address";
import { useUpdateAddressMutation } from "@/hooks/mutations/useUpdateAddressMutation";

vi.mock("@/hooks/useAppContext", () => ({
  useAppContext: vi.fn(() => ({
    language: "EN",
  })),
}));

const mockMutate = vi.fn();
vi.mock("@/hooks/mutations/useUpdateAddressMutation", () => ({
  useUpdateAddressMutation: vi.fn(() => ({
    mutate: mockMutate,
    isPending: false,
  })),
}));

const mockAddressItem: AddressItemWithTimeSchema = {
  id: "addr-123",
  name: "John Doe",
  briefIntro: "A fictional character for testing purposes",
  tags: ["historical", "royal", "18th-century"],
  address: {
    buildingName: "Buckingham Palace",
    line1: "Westminster",
    line2: "Near St. James Park",
    city: "London",
    region: "Greater London",
    postalCode: "SW1A 1AA",
    country: "United Kingdom",
  },
  createdAt: new Date().getTime(),
  updatedAt: new Date().getTime(),
};

const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent("John Doe United Kingdom")}`;

const getMockMutationValue = (isPending: boolean) => {
  return {
    mutate: mockMutate,
    isPending: isPending,
    isError: false,
    isSuccess: false,
    error: null,
    data: undefined,
    reset: vi.fn(),
    isIdle: false,
    status: "pending",
    submittedAt: 0,
    variables: {
      language: "EN",
      id: "addr-123",
      address: mockAddressItem,
    },
    context: undefined,
    failureCount: 0,
    failureReason: null,
    isPaused: false,
    mutateAsync: vi.fn(),
  } as ReturnType<typeof useUpdateAddressMutation>;
};

describe("ViewAddressActions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("disables the button and shows spinner when pending", async () => {
    vi.mocked(useUpdateAddressMutation).mockReturnValue(getMockMutationValue(true));
    renderWithProviders(<ViewAddressActions addressItem={mockAddressItem} />);
    const triggerButton = screen.getByRole("button");
    expect(triggerButton).toHaveProperty("disabled", true);
  });

  it("opens popover menu when trigger button is clicked", async () => {
    vi.mocked(useUpdateAddressMutation).mockReturnValue(getMockMutationValue(false));
    renderWithProviders(<ViewAddressActions addressItem={mockAddressItem} />);
    const triggerButton = screen.getByRole("button");
    fireEvent.click(triggerButton);
    await waitFor(() => {
      expect(screen.getByText("Edit")).toBeTruthy();
      expect(screen.getByText("Search")).toBeTruthy();
    });
  });

  it("calls mutate with correct data when saving edited address", async () => {
    renderWithProviders(<ViewAddressActions addressItem={mockAddressItem} />);
    const triggerButton = screen.getByRole("button");
    fireEvent.click(triggerButton);
    await waitFor(() => {
      const editButton = screen.getByRole("button", { name: /edit/i });
      fireEvent.click(editButton);
    });
    await waitFor(() => {
      const textarea = screen.getByRole("textbox");
      expect(textarea).toBeTruthy();
    });
    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;
    const saveButton = screen.getByRole("button", { name: /save/i });
    const updatedAddress = {
      ...mockAddressItem,
      name: "Jane Doe",
    };
    const {
      id: _,
      createdAt: __,
      updatedAt: ___,
      ...addressWithoutTimestamps
    } = updatedAddress;
    fireEvent.change(textarea, {
      target: { value: JSON.stringify(addressWithoutTimestamps, null, 2) },
    });
    fireEvent.click(saveButton);
    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        id: mockAddressItem.id,
        language: "EN",
        address: {
          ...addressWithoutTimestamps,
          id: mockAddressItem.id,
          createdAt: mockAddressItem.createdAt,
          updatedAt: mockAddressItem.updatedAt,
        },
      });
    });
  });

  it("does not call mutate when address data is unchanged", async () => {
    renderWithProviders(<ViewAddressActions addressItem={mockAddressItem} />);
    const triggerButton = screen.getByRole("button");
    fireEvent.click(triggerButton);
    await waitFor(() => {
      const editButton = screen.getByRole("button", { name: /edit/i });
      fireEvent.click(editButton);
    });
    await waitFor(() => {
      const textarea = screen.getByRole("textbox");
      expect(textarea).toBeTruthy();
    });
    const saveButton = screen.getByRole("button", { name: /save/i });
    fireEvent.click(saveButton);
    await waitFor(() => {
      expect(mockMutate).not.toHaveBeenCalled();
    });
  });

  it("calls window.open api and open google search with URI query", async () => {
    vi.mocked(useUpdateAddressMutation).mockReturnValue(getMockMutationValue(false));
    const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);
    renderWithProviders(<ViewAddressActions addressItem={mockAddressItem} />);
    const triggerButton = screen.getByRole("button");
    fireEvent.click(triggerButton);
    const searchButton = screen.getByText("Search");
    fireEvent.click(searchButton);
    expect(openSpy).toHaveBeenCalled();
    expect(openSpy).toHaveBeenCalledWith(googleSearchUrl, "_blank");
  });
});
