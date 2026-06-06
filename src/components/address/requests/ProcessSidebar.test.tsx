import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ProcessSidebar from "./ProcessSidebar";
import type { AddressRequest, AddressRequests } from "@/schemas/address-request";
import { parseDate } from "@/lib/utils";
import type { useAddressRequestContext } from "@/hooks/useAddressRequestContext";
import { useUpdateAddressRequestMutation } from "@/hooks/mutations/useUpdateAddressRequestMutation";

const date = Date.now();

const { mockUseAddressRequestContext, mockUseUpdateAddressRequestMutation } = vi.hoisted(
  () => ({
    mockUseAddressRequestContext: vi.fn<typeof useAddressRequestContext>(),
    mockUseUpdateAddressRequestMutation: vi.fn<typeof useUpdateAddressRequestMutation>(),
  }),
);

const mockRefetchFn = vi.fn();
const mockMutation = vi.fn();

vi.mock("@/hooks/useAddressRequestContext", () => ({
  useAddressRequestContext: mockUseAddressRequestContext,
}));

vi.mock("@/hooks/queries/useGetAddressRequestsQuery", () => ({
  BASE_QUERY_KEYS: ["mock_key"],
}));

vi.mock("@/hooks/mutations/useUpdateAddressRequestMutation", () => ({
  useUpdateAddressRequestMutation: mockUseUpdateAddressRequestMutation,
}));

const mockRequests: AddressRequests = [
  {
    id: "id_1",
    requestBy: "user_1",
    status: "pending",
    content: "request_1",
    notes: "temp notes",
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

const mockAddressRequestContext = (
  value: Partial<ReturnType<typeof useAddressRequestContext>>,
) => {
  mockUseAddressRequestContext.mockReturnValue({
    currentProcessing: undefined,
    updateCurrentProcessing: vi.fn(),
    ...value,
  });
};

const mockUpdateAddressRequestMutation = (
  value: Partial<ReturnType<typeof useUpdateAddressRequestMutation>>,
) => {
  mockUseUpdateAddressRequestMutation.mockImplementation(
    (callbackFn: (request: AddressRequest) => void) =>
      ({
        mutate: mockMutation.mockImplementation(() => callbackFn(mockRequests[0])),
        ...value,
      }) as unknown as ReturnType<typeof useUpdateAddressRequestMutation>,
  );
};

describe("ProcessSidebar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAddressRequestContext({});
    mockUpdateAddressRequestMutation({});
  });
  it("empty content", () => {
    mockAddressRequestContext({ currentProcessing: undefined });
    render(<ProcessSidebar refetchFn={mockRefetchFn} />);
    expect(
      screen.getByText("Click a request in the table to start processing"),
    ).toBeTruthy();
  });

  it("renders fields", () => {
    mockAddressRequestContext({ currentProcessing: mockRequests[0] });
    render(<ProcessSidebar refetchFn={mockRefetchFn} />);
    const status = screen.getByText(/pending/i);
    expect(screen.getByText(/id_1/)).toBeTruthy();
    expect(screen.getByText(/user_1/)).toBeTruthy();
    expect(status.classList.contains("bg-chart-5")).toBeTruthy();
    expect(screen.getByText(`Created At: ${parseDate(date)}`)).toBeTruthy();
  });

  it("renders processing", () => {
    mockAddressRequestContext({ currentProcessing: mockRequests[1] });
    render(<ProcessSidebar refetchFn={mockRefetchFn} />);
    const status = screen.getByText(/processing/i);
    expect(status.classList.contains("bg-chart-4")).toBeTruthy();
  });

  it("renders completed", () => {
    mockAddressRequestContext({ currentProcessing: mockRequests[2] });
    render(<ProcessSidebar refetchFn={mockRefetchFn} />);
    const status = screen.getByText(/completed/i);
    expect(status.classList.contains("bg-chart-2")).toBeTruthy();
  });

  it("renders failed", () => {
    mockAddressRequestContext({ currentProcessing: mockRequests[3] });
    render(<ProcessSidebar refetchFn={mockRefetchFn} />);
    const status = screen.getByText(/failed/i);
    expect(status.classList.contains("bg-chart-1")).toBeTruthy();
  });

  it("render pending button", () => {
    mockAddressRequestContext({ currentProcessing: mockRequests[3] });
    mockUpdateAddressRequestMutation({ isPending: true });
    render(<ProcessSidebar refetchFn={mockRefetchFn} />);
    expect(screen.getByText(/saving/i));
  });

  it("update textarea", () => {
    const mockUpdateCurrProcessing = vi.fn();
    mockAddressRequestContext({
      currentProcessing: mockRequests[0],
      updateCurrentProcessing: mockUpdateCurrProcessing,
    });
    render(<ProcessSidebar refetchFn={mockRefetchFn} />);
    expect(mockRefetchFn).not.toHaveBeenCalled();
    expect(mockUpdateCurrProcessing).not.toHaveBeenCalled();
    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;
    const submitButton = screen.getByText(/save/i);
    fireEvent.change(textarea, { target: { value: "mock edit" } });
    expect(textarea.value).toBe("mock edit");
    fireEvent.blur(textarea);
    fireEvent.click(submitButton);
    expect(mockRefetchFn).toHaveBeenCalled();
    expect(mockUpdateCurrProcessing).toHaveBeenCalled();
  });

  it("do not update textarea when nothing changed", () => {
    const mockUpdateCurrProcessing = vi.fn();
    mockAddressRequestContext({
      currentProcessing: mockRequests[0],
      updateCurrentProcessing: mockUpdateCurrProcessing,
    });
    render(<ProcessSidebar refetchFn={mockRefetchFn} />);
    expect(mockRefetchFn).not.toHaveBeenCalled();
    expect(mockUpdateCurrProcessing).not.toHaveBeenCalled();
    const submitButton = screen.getByText(/save/i);
    fireEvent.click(submitButton);
    expect(mockRefetchFn).not.toHaveBeenCalled();
    expect(mockUpdateCurrProcessing).not.toHaveBeenCalled();
  });
});
