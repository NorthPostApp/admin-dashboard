import type { AddressRequests } from "@/schemas/address-request";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import RequestsTable from "./RequestsTable";

const mockOnSelect = vi.fn();

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
  beforeEach(() => vi.clearAllMocks());
  it("renders table items", () => {
    render(<RequestsTable requests={mockRequests} onSelect={mockOnSelect} />);
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
    render(
      <RequestsTable
        requests={mockRequests}
        onSelect={mockOnSelect}
        currSelectedID="id_2"
      />,
    );
    const row = screen.getByText("id_2");
    fireEvent.click(row);
    expect(mockOnSelect).toHaveBeenCalledWith(mockRequests[1]);
  });
});
