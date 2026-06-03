import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ProcessSidebar from "./ProcessSidebar";
import type { AddressRequests } from "@/schemas/address-request";
import { parseDate } from "@/lib/utils";

const date = Date.now();

const mockRequests: AddressRequests = [
  {
    id: "id_1",
    requestBy: "user_1",
    status: "pending",
    content: "request_1",
    notes: "",
    createdAt: date,
    updatedAt: date,
  },
  {
    id: "id_2",
    requestBy: "user_2",
    status: "processing",
    content: "request_2",
    notes: "",
    createdAt: date,
    updatedAt: date,
  },
  {
    id: "id_3",
    requestBy: "user_3",
    status: "completed",
    content: "request_3",
    notes: "",
    createdAt: date,
    updatedAt: date,
    resolvedID: "",
  },
  {
    id: "id_4",
    requestBy: "user_4",
    status: "failed",
    content: "request_4",
    notes: "",
    createdAt: date,
    updatedAt: date,
    failedReason: "",
  },
];

describe("ProcessSidebar", () => {
  it("empty content", () => {
    render(<ProcessSidebar request={undefined} />);
    expect(
      screen.getByText("Click a request in the table to start processing"),
    ).toBeTruthy();
  });

  it("renders fields", () => {
    render(<ProcessSidebar request={mockRequests[0]} />);
    const status = screen.getByText(/pending/i);
    expect(screen.getByText(/id_1/)).toBeTruthy();
    expect(screen.getByText(/user_1/)).toBeTruthy();
    expect(status.classList.contains("bg-chart-5")).toBeTruthy();
    expect(screen.getByText(`Created At: ${parseDate(date)}`)).toBeTruthy();
  });

  it("renders processing", () => {
    render(<ProcessSidebar request={mockRequests[1]} />);
    const status = screen.getByText(/processing/i);
    expect(status.classList.contains("bg-chart-4")).toBeTruthy();
  });

  it("renders completed", () => {
    render(<ProcessSidebar request={mockRequests[2]} />);
    const status = screen.getByText(/completed/i);
    expect(status.classList.contains("bg-chart-2")).toBeTruthy();
  });

  it("renders failed", () => {
    render(<ProcessSidebar request={mockRequests[3]} />);
    const status = screen.getByText(/failed/i);
    expect(status.classList.contains("bg-chart-1")).toBeTruthy();
  });
});
