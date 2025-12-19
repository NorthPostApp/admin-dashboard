import { describe, vi, it, expect, beforeEach } from "vitest";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { useCreateNewAddressMutation } from "@/hooks/mutations/useCreateNewAddressMutation";
import { renderWithProviders } from "@/lib/test-wrappers";
import CreateAddressesManual from "./CreateAddressManual";

vi.mock("@/hooks/useAppContext", () => ({
  useAppContext: vi.fn(() => ({
    language: "EN",
  })),
}));

vi.mock("@/api/address", () => ({
  createNewAddress: vi.fn(),
}));

vi.mock("@/hooks/mutations/useCreateNewAddressMutation", () => ({
  useCreateNewAddressMutation: vi.fn(),
}));

const mockMutate = vi.fn();

describe("CreateAddressesManual", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useCreateNewAddressMutation).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      isError: false,
      isSuccess: false,
      error: null,
    } as never);
  });

  it("renders the form with all required fields", () => {
    renderWithProviders(<CreateAddressesManual />);

    // Check for Basic Info section
    expect(screen.getByText("Basic Info")).toBeTruthy();
    expect(screen.getByLabelText("Name")).toBeTruthy();
    expect(screen.getByLabelText("Tags")).toBeTruthy();
    expect(screen.getByLabelText("Brief Introduction")).toBeTruthy();

    // Check for Address section
    expect(screen.getByText("Address")).toBeTruthy();
    expect(screen.getByLabelText("Building Name (Optional)")).toBeTruthy();
    expect(screen.getByLabelText("Line 1")).toBeTruthy();
    expect(screen.getByLabelText("Line 2")).toBeTruthy();
    expect(screen.getByLabelText("City")).toBeTruthy();
    expect(screen.getByLabelText("Region")).toBeTruthy();
    expect(screen.getByLabelText("Postal Code")).toBeTruthy();
    expect(screen.getByLabelText("Country")).toBeTruthy();

    // Check for action buttons
    expect(screen.getByRole("button", { name: "Submit" })).toBeTruthy();
  });

  it("renders with correct placeholder texts", () => {
    renderWithProviders(<CreateAddressesManual />);

    expect(screen.getByPlaceholderText("e.g. Anton Chekhov")).toBeTruthy();
    expect(screen.getByTestId("address-form-tag__input")).toBeTruthy();
    expect(
      screen.getByPlaceholderText("A Russian playwright and short-story writer.")
    ).toBeTruthy();
    expect(screen.getByPlaceholderText("e.g. White Dacha")).toBeTruthy();
    expect(screen.getByPlaceholderText("e.g. 112 Darsan Hill Road")).toBeTruthy();
    expect(screen.getByPlaceholderText("e.g. Yalta")).toBeTruthy();
    expect(screen.getByPlaceholderText("e.g. 347900")).toBeTruthy();
    expect(screen.getByPlaceholderText("e.g. Russian Empire")).toBeTruthy();
  });

  it("updates input values when user types", async () => {
    renderWithProviders(<CreateAddressesManual />);
    const nameInput = screen.getByPlaceholderText("e.g. Anton Chekhov");
    fireEvent.change(nameInput, { target: { value: "Anton Chekhov" } });
    await waitFor(() => {
      expect(screen.getByDisplayValue("Anton Chekhov")).toBeTruthy();
    });
  });

  it("updates textarea value when user types", async () => {
    renderWithProviders(<CreateAddressesManual />);
    const briefInput = screen.getByPlaceholderText(
      "A Russian playwright and short-story writer."
    );
    fireEvent.change(briefInput, { target: { value: "A famous Russian writer" } });
    await waitFor(() => {
      expect(screen.getByDisplayValue(/Russian writer/)).toBeTruthy();
    });
  });

  it("updates address fields correctly", async () => {
    renderWithProviders(<CreateAddressesManual />);
    const buildingNameInput = screen.getByPlaceholderText("e.g. White Dacha");
    fireEvent.change(buildingNameInput, { target: { value: "White Dacha Building" } });
    expect(screen.getByDisplayValue(/White Dacha Building/)).toBeTruthy();
    const line1Input = screen.getByPlaceholderText("e.g. 112 Darsan Hill Road");
    fireEvent.change(line1Input, { target: { value: "112 Street" } });
    await waitFor(() => {
      expect(screen.getByDisplayValue(/112 Street/)).toBeTruthy();
    });
  });

  it("adds a single tag when add button is clicked", async () => {
    renderWithProviders(<CreateAddressesManual />);
    const tagInput = screen.getByTestId("address-form-tag__input");
    const addButton = screen.getByTestId("input-and-button__button");
    fireEvent.change(tagInput, { target: { value: "writer" } });
    fireEvent.click(addButton);
    await waitFor(() => {
      expect(screen.getByText("writer")).toBeTruthy();
    });
  });

  it("add button is clicked with empty input", async () => {
    renderWithProviders(<CreateAddressesManual />);
    const addButton = screen.getByTestId("input-and-button__button");
    fireEvent.click(addButton);
    // await waitFor(() => {
    //   expect(screen.getByText("writer")).toBeTruthy();
    // });
  });

  it("removes a tag when remove button is clicked", async () => {
    renderWithProviders(<CreateAddressesManual />);
    const tagInput = screen.getByTestId("address-form-tag__input");
    const addButton = screen.getByTestId("input-and-button__button");
    fireEvent.change(tagInput, { target: { value: "writer;playwright" } });
    fireEvent.click(addButton);
    await waitFor(() => {
      expect(screen.getByText("writer")).toBeTruthy();
      expect(screen.getByText("playwright")).toBeTruthy();
    });
    // Find the remove button within the writer badge
    const writerBadge = screen.getByText("writer").closest("div");
    const removeButton = writerBadge?.querySelector("svg");
    if (removeButton) {
      fireEvent.click(removeButton);
    }
    await waitFor(() => {
      expect(screen.queryByText("writer")).toBeNull();
      expect(screen.getByText("playwright")).toBeTruthy();
    });
  });

  it("calls prevent default with form values on submit", async () => {
    renderWithProviders(<CreateAddressesManual />);
    // Fill all required fields
    const nameInput = screen.getByPlaceholderText("e.g. Anton Chekhov");
    fireEvent.change(nameInput, { target: { value: "Anton Chekhov" } });
    const tagInput = screen.getByTestId("address-form-tag__input");
    const addButton = screen.getByTestId("input-and-button__button");
    fireEvent.change(tagInput, { target: { value: "writer" } });
    fireEvent.click(addButton);
    const briefInput = screen.getByPlaceholderText(
      "A Russian playwright and short-story writer."
    );
    fireEvent.change(briefInput, {
      target: { value: "A famous Russian playwright and writer" },
    });
    const line1Input = screen.getByPlaceholderText("e.g. 112 Darsan Hill Road");
    fireEvent.change(line1Input, { target: { value: "112 Darsan Hill Road" } });
    const cityInput = screen.getByPlaceholderText("e.g. Yalta");
    fireEvent.change(cityInput, { target: { value: "Yalta" } });
    const regionInput = screen.getByPlaceholderText("e.g. Taurida Governorate");
    fireEvent.change(regionInput, { target: { value: "Taurida Governorate" } });
    const countryInput = screen.getByPlaceholderText("e.g. Russian Empire");
    fireEvent.change(countryInput, { target: { value: "Russian Empire" } });
    // Submit the form
    const submitButton = screen.getByRole("button", { name: "Submit" });
    const submitEvent = new Event("submit", { bubbles: true, cancelable: true });
    const preventDefaultSpy = vi.spyOn(submitEvent, "preventDefault");
    fireEvent.click(submitButton);
    submitButton?.dispatchEvent(submitEvent);
    await waitFor(() => {
      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  it("create address from JSON", async () => {
    renderWithProviders(<CreateAddressesManual />);
    const triggerButton = screen.getByRole("button", { name: /create from json/i });
    fireEvent.click(triggerButton);
    const textarea = screen.getByRole("textbox");
    const validJson = JSON.stringify(mockData);
    fireEvent.change(textarea, { target: { value: validJson } });
    const saveButton = screen.getByRole("button", { name: /save changes/i });
    fireEvent.click(saveButton);
    await waitFor(() => {
      expect(screen.getByText(/mockIntroData/i)).toBeTruthy();
    });
  });

  it("shows loading state when mutation is pending", () => {
    vi.mocked(useCreateNewAddressMutation).mockReturnValue({
      mutate: mockMutate,
      isPending: true,
      isError: false,
      isSuccess: false,
      error: null,
    } as never);
    renderWithProviders(<CreateAddressesManual />);
    const submitButton = screen.getByRole("button", { name: /loading/i });
    expect(submitButton).toBeTruthy();
    expect(submitButton).toHaveProperty("disabled", true);
  });
});

const mockData = {
  name: "name",
  briefIntro: "mockIntroData",
  tags: ["a", "b", "c"],
  address: {
    city: "city",
    country: "russia",
    line1: "line1",
    postalCode: "347900",
    region: "region",
  },
};
