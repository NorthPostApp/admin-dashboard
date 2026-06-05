import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ProcessSidebar from "./ProcessSidebar";
import type { AddressRequests } from "@/schemas/address-request";
import { parseDate } from "@/lib/utils";
import type { useAddressRequestContext } from "@/hooks/useAddressRequestContext";

const date = Date.now();

const mockUseAddressRequestContext = vi.hoisted(() =>
  vi.fn<typeof useAddressRequestContext>(),
);

vi.mock("@/hooks/useAddressRequestContext", () => ({
  useAddressRequestContext: mockUseAddressRequestContext,
}));

const mockAddressRequestContext = (
  value: Partial<ReturnType<typeof useAddressRequestContext>>,
) => {
  mockUseAddressRequestContext.mockReturnValue({
    currentProcessing: undefined,
    updateCurrentProcessing: vi.fn(),
    ...value,
  });
};

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
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("empty content", () => {
    mockAddressRequestContext({ currentProcessing: undefined });
    render(<ProcessSidebar />);
    expect(
      screen.getByText("Click a request in the table to start processing"),
    ).toBeTruthy();
  });

  it("renders fields", () => {
    mockAddressRequestContext({ currentProcessing: mockRequests[0] });
    render(<ProcessSidebar />);
    const status = screen.getByText(/pending/i);
    expect(screen.getByText(/id_1/)).toBeTruthy();
    expect(screen.getByText(/user_1/)).toBeTruthy();
    expect(status.classList.contains("bg-chart-5")).toBeTruthy();
    expect(screen.getByText(`Created At: ${parseDate(date)}`)).toBeTruthy();
  });

  it("renders processing", () => {
    mockAddressRequestContext({ currentProcessing: mockRequests[1] });
    render(<ProcessSidebar />);
    const status = screen.getByText(/processing/i);
    expect(status.classList.contains("bg-chart-4")).toBeTruthy();
  });

  it("renders completed", () => {
    mockAddressRequestContext({ currentProcessing: mockRequests[2] });
    render(<ProcessSidebar />);
    const status = screen.getByText(/completed/i);
    expect(status.classList.contains("bg-chart-2")).toBeTruthy();
  });

  it("renders failed", () => {
    mockAddressRequestContext({ currentProcessing: mockRequests[3] });
    render(<ProcessSidebar />);
    const status = screen.getByText(/failed/i);
    expect(status.classList.contains("bg-chart-1")).toBeTruthy();
  });
});
