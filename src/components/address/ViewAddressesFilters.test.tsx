import { describe, it, expect, vi, beforeEach } from "vitest";
import { toast } from "sonner";
import { fireEvent, screen, waitFor } from "@/lib/test-utils";
import { renderWithProviders } from "@/lib/test-wrappers";
import { useAddressDataContext } from "@/hooks/useAddressDataContext";
import ViewAddressesFilters from "./ViewAddressesFilters";

// Mock sonner toast
vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
  },
}));

vi.mock("@/consts/app-config", async () => {
  const actual = await vi.importActual("@/consts/app-config");
  return {
    ...actual,
    DEFAULT_PAGE_DISPLAY_SIZE: 1,
    DEFAULT_PAGE_FETCH_SIZE: 3,
  };
});

// Mock the query hooks
const mockRefetch = vi.fn();
const mockRefetchAddressData = vi.fn();
const mockUseGetAllTagsQuery = vi.fn();
const mockUseGetAllAddressesQuery = vi.fn();

vi.mock("@/hooks/queries/useGetAllTagsQuery", () => ({
  useGetAllTagsQuery: (...args: unknown[]) => mockUseGetAllTagsQuery(...args),
}));

vi.mock("@/hooks/queries/useGetAllAddressesQuery", () => ({
  useGetAllAddressesQuery: (...args: unknown[]) => mockUseGetAllAddressesQuery(...args),
}));

const mockTagsData = {
  tags: {
    country: ["china", "russia"],
    roles: ["urban", "rural", "suburban"],
  },
  refreshedAt: Math.floor(Date.now() / 1000),
};

const mockAddressData = {
  addresses: [
    { id: "1", name: "Address 1" },
    { id: "2", name: "Address 2" },
    { id: "3", name: "Address 3" },
    { id: "4", name: "Address 4" },
  ],
  lastDocId: "last-doc-id",
  totalCount: 4,
};

describe("ViewAddressesFilters", () => {
  beforeEach(() => {
    // vi.resetAllMocks();
    mockRefetch.mockReset();
    mockRefetchAddressData.mockReset();
    mockUseGetAllTagsQuery.mockReset();
    mockUseGetAllAddressesQuery.mockReset();
    vi.mocked(toast.error).mockReset();
    mockUseGetAllTagsQuery.mockReturnValue({
      refetch: mockRefetch,
      isFetching: false,
    });
    mockUseGetAllAddressesQuery.mockReturnValue({
      refetch: mockRefetchAddressData,
      isFetching: false,
    });
    mockRefetch.mockResolvedValue({
      data: mockTagsData,
    });
    mockRefetchAddressData.mockResolvedValue({
      data: mockAddressData,
    });
  });

  it("fetches tags on initial mount when tagsData is not available", async () => {
    renderWithProviders(<ViewAddressesFilters />);
    expect(screen.getByText(/filter/i)).toBeTruthy();
    await waitFor(() => {
      expect(mockRefetch).toHaveBeenCalled();
    });
  });

  it("renders checkbox sections when tags data is available", async () => {
    mockRefetch.mockResolvedValue({
      data: mockTagsData,
    });
    renderWithProviders(<ViewAddressesFilters />);
    await waitFor(() => {
      expect(screen.getByText(/country/i)).toBeTruthy();
      expect(screen.getByText(/roles/i)).toBeTruthy();
    });
  });

  it("not render checkbox sections when tags data is unavailable", async () => {
    mockRefetch.mockResolvedValue({
      data: undefined,
    });
    renderWithProviders(<ViewAddressesFilters />);
    await waitFor(() => {
      expect(screen.queryByText(/country/i)).not.toBeTruthy();
    });
  });

  it("should call refetch when refresh icon clicked", async () => {
    renderWithProviders(<ViewAddressesFilters />);
    await waitFor(() => {
      const refreshButton = screen.getByTestId("viewaddressfilters-refresh");
      fireEvent.click(refreshButton);
    });
    expect(mockRefetch).toBeCalled();
  });

  it("click to check tags", async () => {
    mockRefetch.mockResolvedValue({
      data: mockTagsData,
    });
    renderWithProviders(<ViewAddressesFilters />);
    await waitFor(() => {
      expect(screen.getByText(/country/i)).toBeTruthy();
      expect(screen.getByText(/roles/i)).toBeTruthy();
    });
    const tagButton = screen.getByText(/china/);
    fireEvent.click(tagButton);
    const parentElement = tagButton.parentElement;
    const checkbox = parentElement?.querySelector("button");
    await waitFor(() => {
      expect(checkbox!.getAttribute("data-state")).toBe("checked");
    });
    fireEvent.click(tagButton);
    await waitFor(() => {
      expect(checkbox!.getAttribute("data-state")).toBe("checked");
    });
  });

  it("show spinner when fetching is pending", async () => {
    mockUseGetAllTagsQuery.mockReturnValue({
      refetch: mockRefetch,
      isFetching: true,
    });
    renderWithProviders(<ViewAddressesFilters />);
    await waitFor(() =>
      expect(screen.getByTestId("view-addresses-filters-spinner")).toBeTruthy(),
    );
  });

  it("should update address data successfully when clicking update button", async () => {
    mockRefetchAddressData.mockResolvedValue({
      data: mockAddressData,
    });
    renderWithProviders(<ViewAddressesFilters />);
    await waitFor(() => {
      expect(screen.getByText(/Update Addresses/i)).toBeTruthy();
    });
    const updateButton = screen.getByText(/Update Addresses/i);
    fireEvent.click(updateButton);
    await waitFor(() => {
      expect(mockRefetchAddressData).toHaveBeenCalled();
    });
  });

  it("should not call refetch when already fetching address data", async () => {
    mockUseGetAllAddressesQuery.mockReturnValue({
      refetch: mockRefetchAddressData,
      isFetching: true,
    });
    renderWithProviders(<ViewAddressesFilters />);
    await waitFor(() => {
      const updateButton = screen.getByText(/Updating Addresses/i);
      expect(updateButton).toBeTruthy();
    });
    const updateButton = screen.getByText(/Updating Addresses/i);
    fireEvent.click(updateButton);
    // Should not call refetch when already fetching
    expect(mockRefetchAddressData).not.toHaveBeenCalled();
  });

  it("should show error toast when address data fetch fails", async () => {
    mockRefetchAddressData.mockResolvedValue({
      error: { message: "Network error" },
    });
    renderWithProviders(<ViewAddressesFilters />);
    await waitFor(() => {
      const updateButton = screen.getByText(/Update Addresses/i);
      expect(updateButton).toBeTruthy();
    });
    const updateButton = screen.getByText(/Update Addresses/i);
    fireEvent.click(updateButton);
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(expect.any(String));
    });
  });

  it("should refresh address data and reset to page 1 when on different page", async () => {
    mockRefetchAddressData.mockResolvedValue({
      data: mockAddressData,
    });
    const TestComponent = () => {
      const { selectPage, currentPage } = useAddressDataContext();
      return (
        <>
          <ViewAddressesFilters />
          <div data-testid="current-page">{currentPage}</div>
          <button data-testid="select-page-2" onClick={() => selectPage(2)}>
            Go to Page 2
          </button>
        </>
      );
    };
    renderWithProviders(<TestComponent />);
    await waitFor(() => {
      expect(screen.getByText(/Update Addresses/i)).toBeTruthy();
    });
    const updateButton = screen.getByText(/Update Addresses/i);
    fireEvent.click(updateButton);
    await waitFor(() => {
      expect(mockRefetchAddressData).toHaveBeenCalled();
    });
    await waitFor(() => {
      fireEvent.click(screen.getByTestId("select-page-2"));
    });
    await waitFor(() => {
      expect(screen.getByTestId("current-page").textContent).toBe("2");
    });
    fireEvent.click(screen.getByText(/Update Addresses/i));
    await waitFor(() => {
      expect(screen.getByTestId("current-page").textContent).toBe("1");
    });
  });
});
