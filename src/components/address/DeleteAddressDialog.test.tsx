import { describe, it, expect, vi, beforeEach } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import DeleteAddressDialog from "./DeleteAddressDialog";
import type { AddressItemWithTimeSchema } from "@/schemas/address";

describe("DeleteAddressDialog", () => {
  const mockAddressItem: AddressItemWithTimeSchema = {
    id: "123",
    name: "Test Address",
    briefIntro: "Test Description",
  } as AddressItemWithTimeSchema;

  const mockHandleDeleteAddress = vi.fn();
  const mockSetOpen = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("renders dialog when open is true", () => {
    render(
      <DeleteAddressDialog
        addressItem={mockAddressItem}
        handleDeleteAddress={mockHandleDeleteAddress}
        open={true}
        setOpen={mockSetOpen}
      />,
    );
    expect(screen.getByText("Delete Address")).toBeTruthy();
    expect(screen.getByText("This action cannot be undone")).toBeTruthy();
  });

  it("should call corresponding actions", () => {
    render(
      <DeleteAddressDialog
        addressItem={mockAddressItem}
        handleDeleteAddress={mockHandleDeleteAddress}
        open={true}
        setOpen={mockSetOpen}
      />,
    );
    const deleteButton = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(deleteButton);
    expect(mockHandleDeleteAddress).toHaveBeenCalled();
    const cancelButton = screen.getByText(/cancel/i);
    fireEvent.click(cancelButton);
    expect(mockSetOpen).toHaveBeenCalledWith(false);
  });
});
