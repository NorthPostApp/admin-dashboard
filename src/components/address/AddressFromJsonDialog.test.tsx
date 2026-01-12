import { screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AddressFromJsonDialog from "./AddressFromJsonDialog";
import { renderWithProviders } from "@/lib/test-wrappers";

// Mock the useAppContext hook
vi.mock("@/hooks/useAppContext", () => ({
  useAppContext: vi.fn(() => ({
    language: "EN",
  })),
}));
const mockHandleJsonSave = vi.fn();

const renderTestComponent = () => {
  return renderWithProviders(
    <AddressFromJsonDialog
      title="title"
      description="parse address from json"
      handleJsonSave={mockHandleJsonSave}
    >
      <button>import from json</button>
    </AddressFromJsonDialog>
  );
};

describe("AddressFromJsonDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the trigger button", () => {
    renderTestComponent();
    const triggerButton = screen.getByRole("button", { name: /import from json/i });
    expect(triggerButton).toBeTruthy();
  });

  it("should open dialog when trigger button is clicked", () => {
    renderTestComponent();
    const triggerButton = screen.getByRole("button", { name: /import from json/i });
    fireEvent.click(triggerButton);
    expect(screen.getByText(/parse address from json/i)).toBeTruthy();
  });

  it("should close dialog when cancel button is clicked", async () => {
    renderTestComponent();
    const triggerButton = screen.getByRole("button", { name: /import from json/i });
    fireEvent.click(triggerButton);
    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    fireEvent.click(cancelButton);
    await waitFor(() => {
      expect(screen.queryByText(/parse address from json/i)).not.toBeTruthy();
    });
  });

  it("should parse valid JSON and call handleJsonSave", async () => {
    renderTestComponent();
    const triggerButton = screen.getByRole("button", { name: /import from json/i });
    fireEvent.click(triggerButton);
    const textarea = screen.getByRole("textbox");
    const validJson = JSON.stringify(mockData);
    fireEvent.change(textarea, { target: { value: validJson } });
    const saveButton = screen.getByRole("button", { name: /save changes/i });
    fireEvent.click(saveButton);
    await waitFor(() => {
      expect(mockHandleJsonSave).toHaveBeenCalled();
    });
  });

  it("should display error message for invalid JSON", async () => {
    renderTestComponent();
    const triggerButton = screen.getByRole("button", { name: /import from json/i });
    fireEvent.click(triggerButton);
    const textarea = screen.getByRole("textbox");
    const invalidJson = "{ invalid json }";
    fireEvent.change(textarea, { target: { value: invalidJson } });
    const saveButton = screen.getByRole("button", { name: /save changes/i });
    fireEvent.click(saveButton);
    await waitFor(() => {
      const warningElement = screen.getByTestId("address-content__dialog__warning");
      expect(warningElement).toBeTruthy();
      expect(warningElement.textContent).toBeTruthy();
    });
    expect(mockHandleJsonSave).not.toHaveBeenCalled();
  });

  it("should display ZodError message when validation fails", async () => {
    renderTestComponent();
    const triggerButton = screen.getByRole("button", { name: /import from json/i });
    fireEvent.click(triggerButton);
    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: JSON.stringify(mockInvalidData) } });
    const saveButton = screen.getByRole("button", { name: /save changes/i });
    fireEvent.click(saveButton);
    await waitFor(() => {
      const warningElement = screen.getByTestId("address-content__dialog__warning");
      expect(warningElement).toBeTruthy();
      expect(warningElement.textContent).toBeTruthy();
    });
  });

  it("should handle non-Error exceptions gracefully", async () => {
    // Mock JSON.parse to throw a non-Error object
    const originalParse = JSON.parse;
    JSON.parse = vi.fn().mockImplementation(() => {
      throw "String error thrown"; // Throwing a string instead of Error
    });
    renderTestComponent();
    const triggerButton = screen.getByRole("button", { name: /import from json/i });
    fireEvent.click(triggerButton);
    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "some content" } });
    const saveButton = screen.getByRole("button", { name: /save changes/i });
    fireEvent.click(saveButton);
    await waitFor(() => {
      expect(screen.getByTestId("address-content__dialog__warning")).toBeTruthy();
      expect(screen.getByText("String error thrown")).toBeTruthy();
    });
    expect(mockHandleJsonSave).not.toHaveBeenCalled();
    // Restore original JSON.parse
    JSON.parse = originalParse;
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
