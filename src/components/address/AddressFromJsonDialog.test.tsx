import { useState } from "react";
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

  it("should render without children when children prop is not provided", () => {
    renderWithProviders(
      <AddressFromJsonDialog
        title="title"
        description="description"
        handleJsonSave={mockHandleJsonSave}
        open={true}
      />
    );
    expect(screen.getByText(/description/i)).toBeTruthy();
  });

  it("should use controlled open state when open and setOpen props are provided", () => {
    const TestWrapper = () => {
      const [open, setOpen] = useState(false);
      return (
        <div>
          <button onClick={() => setOpen(true)}>open dialog</button>
          <AddressFromJsonDialog
            title="Controlled Dialog"
            description="This is a controlled dialog"
            handleJsonSave={mockHandleJsonSave}
            open={open}
            setOpen={setOpen}
          >
            <button>trigger</button>
          </AddressFromJsonDialog>
        </div>
      );
    };
    renderWithProviders(<TestWrapper />);
    const openButton = screen.getByRole("button", { name: /open dialog/i });
    fireEvent.click(openButton);
    expect(screen.getByText(/This is a controlled dialog/i)).toBeTruthy();
  });

  it("should populate textarea with initialData when provided", () => {
    const initialData = JSON.stringify(mockData, null, 2);
    renderWithProviders(
      <AddressFromJsonDialog
        title="title"
        description="description"
        handleJsonSave={mockHandleJsonSave}
        initialData={initialData}
        open={true}
      />
    );
    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;
    expect(textarea.value).toBe(initialData);
  });

  it("should close dialog after successful save when using controlled state", async () => {
    const TestWrapper = () => {
      const [open, setOpen] = useState(true);
      return (
        <AddressFromJsonDialog
          title="title"
          description="description"
          handleJsonSave={mockHandleJsonSave}
          open={open}
          setOpen={setOpen}
        />
      );
    };
    renderWithProviders(<TestWrapper />);
    expect(screen.getByText(/description/i)).toBeTruthy();
    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: JSON.stringify(mockData) } });
    const saveButton = screen.getByRole("button", { name: /save changes/i });
    fireEvent.click(saveButton);
    await waitFor(() => {
      expect(mockHandleJsonSave).toHaveBeenCalled();
      expect(screen.queryByText(/description/i)).not.toBeTruthy();
    });
  });

  it("should use internal state when open and setOpen props are not provided", () => {
    renderTestComponent();
    const triggerButton = screen.getByRole("button", { name: /import from json/i });
    expect(screen.queryByText(/parse address from json/i)).not.toBeTruthy();
    fireEvent.click(triggerButton);
    expect(screen.getByText(/parse address from json/i)).toBeTruthy();
  });

  it("should handle external open state changes", () => {
    const TestWrapper = () => {
      const [open, setOpen] = useState(false);
      return (
        <div>
          <button onClick={() => setOpen(!open)}>toggle dialog</button>
          <AddressFromJsonDialog
            title="External Control"
            description="Externally controlled dialog"
            handleJsonSave={mockHandleJsonSave}
            open={open}
            setOpen={setOpen}
          >
            <button>trigger</button>
          </AddressFromJsonDialog>
        </div>
      );
    };
    renderWithProviders(<TestWrapper />);
    const toggleButton = screen.getByRole("button", { name: /toggle dialog/i });
    fireEvent.click(toggleButton);
    expect(screen.getByText(/Externally controlled dialog/i)).toBeTruthy();
    fireEvent.click(toggleButton);
    expect(screen.queryByText(/Externally controlled dialog/i)).not.toBeTruthy();
  });

  it("should clear error message when parsing content successfully after an error", async () => {
    renderTestComponent();
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
    const validJson = JSON.stringify(mockData);
    fireEvent.change(textarea, { target: { value: validJson } });
    fireEvent.click(saveButton);
    await waitFor(() => {
      expect(screen.queryByTestId("address-content__dialog__warning")).not.toBeTruthy();
      expect(mockHandleJsonSave).toHaveBeenCalled();
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
