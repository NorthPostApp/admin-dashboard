import { screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import CreateFromJsonDialog from "./CreateFromJsonDialog";
import { renderWithProviders } from "@/lib/test-wrappers";

// Mock the useAppContext hook
vi.mock("@/hooks/useAppContext", () => ({
  useAppContext: vi.fn(() => ({
    language: "EN",
  })),
}));

const mockHandleJsonImport = vi.fn();
describe("CreateFromJsonDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the trigger button", () => {
    renderWithProviders(<CreateFromJsonDialog handleJsonImport={mockHandleJsonImport} />);
    const triggerButton = screen.getByRole("button", { name: /import from json/i });
    expect(triggerButton).toBeTruthy();
  });

  it("should open dialog when trigger button is clicked", () => {
    renderWithProviders(<CreateFromJsonDialog handleJsonImport={mockHandleJsonImport} />);
    const triggerButton = screen.getByRole("button", { name: /import from json/i });
    fireEvent.click(triggerButton);
    expect(screen.getByText(/parse address from json/i)).toBeTruthy();
  });

  it("should close dialog when cancel button is clicked", async () => {
    renderWithProviders(<CreateFromJsonDialog handleJsonImport={mockHandleJsonImport} />);
    const triggerButton = screen.getByRole("button", { name: /import from json/i });
    fireEvent.click(triggerButton);
    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    fireEvent.click(cancelButton);
    await waitFor(() => {
      expect(screen.queryByText(/parse address from json/i)).not.toBeTruthy();
    });
  });

  it("should parse valid JSON and call handleJsonImport", async () => {
    renderWithProviders(<CreateFromJsonDialog handleJsonImport={mockHandleJsonImport} />);
    const triggerButton = screen.getByRole("button", { name: /import from json/i });
    fireEvent.click(triggerButton);
    const textarea = screen.getByRole("textbox");
    const validJson = JSON.stringify(mockData);
    fireEvent.change(textarea, { target: { value: validJson } });
    const saveButton = screen.getByRole("button", { name: /save changes/i });
    fireEvent.click(saveButton);
    await waitFor(() => {
      expect(mockHandleJsonImport).toHaveBeenCalled();
    });
  });

  it("should display error message for invalid JSON", async () => {
    renderWithProviders(<CreateFromJsonDialog handleJsonImport={mockHandleJsonImport} />);
    const triggerButton = screen.getByRole("button", { name: /import from json/i });
    fireEvent.click(triggerButton);
    const textarea = screen.getByRole("textbox");
    const invalidJson = "{ invalid json }";
    fireEvent.change(textarea, { target: { value: invalidJson } });
    const saveButton = screen.getByRole("button", { name: /save changes/i });
    fireEvent.click(saveButton);
    await waitFor(() => {
      expect(screen.getByTestId("address-content__dialog__warning")).toBeTruthy();
    });
    expect(mockHandleJsonImport).not.toHaveBeenCalled();
  });

  it("should display ZodError message when validation fails", async () => {
    renderWithProviders(<CreateFromJsonDialog handleJsonImport={mockHandleJsonImport} />);
    const triggerButton = screen.getByRole("button", { name: /import from json/i });
    fireEvent.click(triggerButton);
    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: mockInvalidData } });
    const saveButton = screen.getByRole("button", { name: /save changes/i });
    fireEvent.click(saveButton);
    await waitFor(() => {
      expect(screen.getByTestId("address-content__dialog__warning")).toBeTruthy();
    });
  });
});

// Mock input data

const mockData = {
  name: "name",
  briefIntro: "briefIntro",
  tags: ["a", "b", "c"],
  address: {
    city: "city",
    country: "russia",
    line1: "line1",
    postalCode: "347900",
    region: "region",
  },
};
const mockInvalidData = {
  name: "name",
  briefIntro: "briefIntro",
};
