import { describe, it, vi, expect, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithProviders } from "@/lib/test-wrappers";
import GeneratedAddressActions from "./GeneratedAddressActions";
import type { GeneratedAddressSchema, AddressItemSchema } from "@/schemas/address";
import { useNewAddressContext } from "@/hooks/useNewAddressContext";
import * as useCreateNewAddressMutation from "@/hooks/mutations/useCreateNewAddressMutation";

// Mock the mutation hook
vi.mock("@/hooks/mutations/useCreateNewAddressMutation", () => ({
  useCreateNewAddressMutation: vi.fn(),
}));

vi.mock("@/hooks/useNewAddressContext", () => ({
  useNewAddressContext: vi.fn(),
}));

const mockAddressItem: GeneratedAddressSchema = {
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
};

const mockMutate = vi.fn();
const mockUpdateGeneratedAddress = vi.fn();
const mockUseCreateNewAddressMutation = vi.mocked(
  useCreateNewAddressMutation.useCreateNewAddressMutation,
);
const mockuseNewAddressContext = vi.mocked(useNewAddressContext);

describe("GeneratedAddressActions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseCreateNewAddressMutation.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      mutateAsync: vi.fn(),
      data: undefined,
      error: null,
      isError: false,
      isIdle: true,
      isSuccess: false,
      failureCount: 0,
      failureReason: null,
      isPaused: false,
      variables: undefined,
      status: "idle",
      reset: vi.fn(),
      context: undefined,
      submittedAt: 0,
    });

    mockuseNewAddressContext.mockReturnValue({
      updateGeneratedAddress: mockUpdateGeneratedAddress,
      systemPrompt: undefined,
      userPrompt: "",
      generating: false,
      generatedAddresses: [],
      updateSystemPrompt: vi.fn(),
      updateUserPrompt: vi.fn(),
      setGeneratingState: vi.fn(),
      saveGeneratedAddresses: vi.fn(),
    });
  });

  it("renders the popover trigger button", () => {
    renderWithProviders(<GeneratedAddressActions addressItem={mockAddressItem} />);
    const triggerButton = screen.getByRole("button");
    expect(triggerButton).toBeTruthy();
  });

  it("opens popover menu when trigger button is clicked", async () => {
    renderWithProviders(<GeneratedAddressActions addressItem={mockAddressItem} />);
    const triggerButton = screen.getByRole("button");
    fireEvent.click(triggerButton);
    await waitFor(() => {
      expect(screen.getByText(/save/i)).toBeTruthy();
      expect(screen.getByText(/edit/i)).toBeTruthy();
    });
  });

  it("calls mutate with correct data when save button is clicked", async () => {
    renderWithProviders(<GeneratedAddressActions addressItem={mockAddressItem} />);
    const triggerButton = screen.getByRole("button");
    fireEvent.click(triggerButton);
    await waitFor(() => {
      expect(screen.getByText(/save/i)).toBeTruthy();
    });
    const saveButton = screen.getByText(/save/i);
    fireEvent.click(saveButton);
    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledTimes(1);
      expect(mockMutate).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "John Doe",
          briefIntro: "A fictional character for testing purposes",
          tags: ["historical", "royal", "18th-century"],
          address: mockAddressItem.address,
          language: expect.any(String),
        }),
      );
    });
  });

  it("opens edit dialog when edit button is clicked", async () => {
    renderWithProviders(<GeneratedAddressActions addressItem={mockAddressItem} />);
    const triggerButton = screen.getByRole("button");
    fireEvent.click(triggerButton);
    await waitFor(() => {
      expect(screen.getByText(/edit/i)).toBeTruthy();
    });
    const editButton = screen.getByText(/edit/i);
    fireEvent.click(editButton);
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeTruthy();
    });
  });

  it("stringifies address data without id for edit dialog", async () => {
    renderWithProviders(<GeneratedAddressActions addressItem={mockAddressItem} />);
    const triggerButton = screen.getByRole("button");
    fireEvent.click(triggerButton);
    await waitFor(() => {
      expect(screen.getByText(/edit/i)).toBeTruthy();
    });
    const editButton = screen.getByText(/edit/i);
    fireEvent.click(editButton);
    await waitFor(() => {
      const textarea = screen.getByRole("textbox");
      const textareaValue = (textarea as HTMLTextAreaElement).value;
      const parsedData = JSON.parse(textareaValue);
      // Should not include id
      expect(parsedData.id).toBeUndefined();
      // Should include other fields
      expect(parsedData.name).toBe("John Doe");
      expect(parsedData.briefIntro).toBe("A fictional character for testing purposes");
      expect(parsedData.tags).toEqual(["historical", "royal", "18th-century"]);
    });
  });

  it("does not update when edit dialog saves with unchanged data", async () => {
    renderWithProviders(<GeneratedAddressActions addressItem={mockAddressItem} />);
    const triggerButton = screen.getByRole("button");
    fireEvent.click(triggerButton);
    await waitFor(() => {
      expect(screen.getByText(/edit/i)).toBeTruthy();
    });
    const editButton = screen.getByText(/edit/i);
    fireEvent.click(editButton);
    await waitFor(() => {
      expect(screen.getByRole("textbox")).toBeTruthy();
    });
  });

  it("closes edit dialog when setOpen is called", async () => {
    renderWithProviders(<GeneratedAddressActions addressItem={mockAddressItem} />);
    const triggerButton = screen.getByRole("button");
    fireEvent.click(triggerButton);
    await waitFor(() => {
      expect(screen.getByText(/edit/i)).toBeTruthy();
    });
    const editButton = screen.getByText(/edit/i);
    fireEvent.click(editButton);
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeTruthy();
    });
    const cancelButton = screen.getByText(/cancel/i);
    fireEvent.click(cancelButton);
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).toBeNull();
    });
  });

  it("includes language from AppContext when calling mutate", async () => {
    renderWithProviders(<GeneratedAddressActions addressItem={mockAddressItem} />);
    const triggerButton = screen.getByRole("button");
    fireEvent.click(triggerButton);
    await waitFor(() => {
      expect(screen.getByText(/save/i)).toBeTruthy();
    });
    const saveButton = screen.getByText(/save/i);
    fireEvent.click(saveButton);
    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(
        expect.objectContaining({
          language: expect.any(String),
        }),
      );
    });
  });

  it("renders two control buttons in popover menu", async () => {
    renderWithProviders(<GeneratedAddressActions addressItem={mockAddressItem} />);
    const triggerButton = screen.getByRole("button");
    fireEvent.click(triggerButton);
    await waitFor(() => {
      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBeGreaterThanOrEqual(3);
    });
  });

  it("calls updateGeneratedAddress when address data is modified", async () => {
    renderWithProviders(<GeneratedAddressActions addressItem={mockAddressItem} />);
    const triggerButton = screen.getByRole("button");
    fireEvent.click(triggerButton);
    await waitFor(() => {
      expect(screen.getByText(/edit/i)).toBeTruthy();
    });
    const editButton = screen.getByText(/edit/i);
    fireEvent.click(editButton);
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeTruthy();
    });
    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;
    const modifiedData: AddressItemSchema = {
      name: "Jane Doe", // Changed name
      briefIntro: mockAddressItem.briefIntro,
      tags: mockAddressItem.tags,
      address: mockAddressItem.address,
    };
    fireEvent.change(textarea, {
      target: { value: JSON.stringify(modifiedData, null, 2) },
    });
    const saveButtons = screen
      .getAllByRole("button")
      .filter((btn) => btn.textContent?.toLowerCase().includes("save"));
    const dialogSaveButton = saveButtons[saveButtons.length - 1];
    fireEvent.click(dialogSaveButton);
    await waitFor(() => {
      expect(mockUpdateGeneratedAddress).toHaveBeenCalledTimes(1);
      expect(mockUpdateGeneratedAddress).toHaveBeenCalledWith("addr-123", modifiedData);
    });
  });

  it("does NOT call updateGeneratedAddress when address data is unchanged", async () => {
    renderWithProviders(<GeneratedAddressActions addressItem={mockAddressItem} />);
    const triggerButton = screen.getByRole("button");
    fireEvent.click(triggerButton);
    await waitFor(() => {
      expect(screen.getByText(/edit/i)).toBeTruthy();
    });
    const editButton = screen.getByText(/edit/i);
    fireEvent.click(editButton);
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeTruthy();
    });
    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;
    const { id: _, ...addressWithoutId } = mockAddressItem;
    fireEvent.change(textarea, {
      target: { value: JSON.stringify(addressWithoutId, null, 2) },
    });
    const saveButtons = screen
      .getAllByRole("button")
      .filter((btn) => btn.textContent?.toLowerCase().includes("save"));
    const dialogSaveButton = saveButtons[saveButtons.length - 1];
    fireEvent.click(dialogSaveButton);
    await waitFor(() => {
      expect(mockUpdateGeneratedAddress).not.toHaveBeenCalled();
    });
  });
});
