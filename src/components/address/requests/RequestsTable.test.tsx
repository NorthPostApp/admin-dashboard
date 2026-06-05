import type { AddressRequests } from "@/schemas/address-request";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import RequestsTable from "./RequestsTable";
import type { useAddressRequestContext } from "@/hooks/useAddressRequestContext";

const mockUseAddressRequestContext = vi.hoisted(() =>
  vi.fn<typeof useAddressRequestContext>(),
);
vi.mock("@/hooks/useAddressRequestContext", () => ({
  useAddressRequestContext: mockUseAddressRequestContext,
}));

const mockRequests: AddressRequests = [
  {
    id: "id_1",
    requestBy: "user_1",
    status: "pending",
    content: "request_1",
    notes: "",
    createdAt: 123456,
    updatedAt: 789012,
  },
  {
    id: "id_2",
    requestBy: "user_2",
    status: "processing",
    content: "request_2",
    notes: "",
    createdAt: 23456,
    updatedAt: 123478,
  },
];

describe("RequestTable", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAddressRequestContext.mockReturnValue({
      currentProcessing: undefined,
      updateCurrentProcessing: vi.fn(),
    });
  });
  it("renders table items", () => {
    render(<RequestsTable requests={mockRequests} />);
    // renders table head
    expect(screen.getByText("ID")).toBeTruthy();
    expect(screen.getByText(/created at/i)).toBeTruthy();
    expect(screen.getByText(/updated at/i)).toBeTruthy();
    expect(screen.getByText(/content/i)).toBeTruthy();
    expect(screen.getByText(/status/i)).toBeTruthy();
    // renders table body
    expect(screen.getAllByText(/id/).length).toBe(2);
    expect(screen.getAllByText(/request/).length).toBe(2);
    expect(screen.getAllByText(/Processing/).length).toBe(1);
    expect(screen.getAllByText(/Pending/).length).toBe(1);
  });

  it("triggers onSelect", () => {
    const mockOnSelect = vi.fn();
    mockUseAddressRequestContext.mockReturnValue({
      currentProcessing: mockRequests[1],
      updateCurrentProcessing: mockOnSelect,
    });
    render(<RequestsTable requests={mockRequests} />);
    const row = screen.getByText("id_2");
    fireEvent.click(row);
    expect(mockOnSelect).toHaveBeenCalledWith(mockRequests[1]);
  });
});
