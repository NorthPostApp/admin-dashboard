import { describe, it, vi, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import AddressCard from "./AddressCard";
import type { GeneratedAddressSchema } from "@/schemas/address";

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

const minimalAddress: GeneratedAddressSchema = {
  id: "addr-456",
  name: "Jane Smith",
  briefIntro: "Minimal address example",
  tags: ["modern"],
  address: {
    buildingName: "",
    line1: "123 Main Street",
    line2: "",
    city: "Springfield",
    region: "Illinois",
    postalCode: "",
    country: "USA",
  },
};

const mockActions = <button>Action Button</button>;

describe("AddressCard", () => {
  it("renders the address name", () => {
    render(<AddressCard addressItem={mockAddressItem} actions={mockActions} />);
    expect(screen.getByText("John Doe")).toBeTruthy();
  });

  it("formats minimal address with only required fields", () => {
    render(<AddressCard addressItem={minimalAddress} actions={mockActions} />);
    expect(screen.getByText("Jane Smith")).toBeTruthy();
    expect(screen.getByText("123 Main Street")).toBeTruthy();
    expect(screen.getByText("Springfield, Illinois")).toBeTruthy();
    expect(screen.getByText("USA")).toBeTruthy();
  });

  it("does not re-render when addressItem is unchanged", () => {
    let renderCount = 0;
    const TestWrapper = ({ addressItem }: { addressItem: GeneratedAddressSchema }) => {
      renderCount++;
      return <AddressCard addressItem={addressItem} actions={mockActions} />;
    };
    const { rerender } = render(<TestWrapper addressItem={mockAddressItem} />);
    expect(renderCount).toBe(1);
    // Re-render with the same address item
    renderCount = 0; // reset count
    rerender(<TestWrapper addressItem={mockAddressItem} />);
    expect(renderCount).toBe(1); // Should not re-render due to memo
    // Re-render with a modified address item
    const modifiedAddress = { ...mockAddressItem, name: "John Smith" };
    rerender(<TestWrapper addressItem={modifiedAddress} />);
    expect(renderCount).toBe(2); // Should re-render when address changes
  });

  it("renders the CopyButton and copies address JSON on click", async () => {
    // Mock clipboard API
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });
    render(<AddressCard addressItem={mockAddressItem} actions={mockActions} />);
    const copyButton = screen.getByTestId("address-card-copy-button");
    expect(copyButton).toBeTruthy();
    fireEvent.click(copyButton);
    expect(writeTextMock).toHaveBeenCalledWith(JSON.stringify(mockAddressItem, null, 2));
  });

  it("renders the brief introduction in CardDescription", () => {
    render(<AddressCard addressItem={mockAddressItem} actions={mockActions} />);
    const description = screen.getByText("A fictional character for testing purposes");
    expect(description).toBeTruthy();
    expect(description.className).toContain("address-component__card__description");
  });

  it("renders CardDescription component with briefIntro text content", () => {
    const customAddress = {
      ...mockAddressItem,
      briefIntro: "Custom brief introduction text",
    };
    render(<AddressCard addressItem={customAddress} actions={mockActions} />);
    expect(screen.getByText("Custom brief introduction text")).toBeTruthy();
  });

  it("renders actions when provided", () => {
    const customActions = <button data-testid="custom-action">Delete</button>;
    render(<AddressCard addressItem={mockAddressItem} actions={customActions} />);
    expect(screen.getByTestId("custom-action")).toBeTruthy();
  });

  it("does not render actions when null", () => {
    render(<AddressCard addressItem={mockAddressItem} actions={null} />);
    const copyButton = screen.getByTestId("address-card-copy-button");
    expect(copyButton).toBeTruthy();
    // Verify no action button is rendered
    expect(screen.queryByText("Action Button")).toBeFalsy();
  });

  it("does not render actions when undefined", () => {
    render(<AddressCard addressItem={mockAddressItem} actions={undefined} />);
    const copyButton = screen.getByTestId("address-card-copy-button");
    expect(copyButton).toBeTruthy();
    // Verify no action button is rendered
    expect(screen.queryByText("Action Button")).toBeFalsy();
  });

  it("renders multiple action buttons", () => {
    const multipleActions = (
      <>
        <button data-testid="edit-btn">Edit</button>
        <button data-testid="delete-btn">Delete</button>
      </>
    );
    render(<AddressCard addressItem={mockAddressItem} actions={multipleActions} />);
    expect(screen.getByTestId("edit-btn")).toBeTruthy();
    expect(screen.getByTestId("delete-btn")).toBeTruthy();
  });
});
