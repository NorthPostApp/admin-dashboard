import { describe, it, expect, vi, beforeEach } from "vitest";
import { fireEvent, screen, waitFor } from "@/lib/test-utils";
import { renderWithProviders } from "@/lib/test-wrappers";
import ViewAddressesFilters from "./ViewAddressesFilters";

// Mock the query hook
const mockRefetch = vi.fn();
const mockUseGetAllTagsQuery = vi.fn();

vi.mock("@/hooks/queries/useGetAllTagsQuery", () => ({
  useGetAllTagsQuery: (...args: unknown[]) => mockUseGetAllTagsQuery(...args),
}));

const mockTagsData = {
  tags: {
    country: ["china", "russia"],
    roles: ["urban", "rural", "suburban"],
  },
  refreshedAt: Math.floor(Date.now() / 1000),
};

describe("ViewAddressesFilters", () => {
  beforeEach(() => {
    mockRefetch.mockReset();
    mockUseGetAllTagsQuery.mockReset();
    mockUseGetAllTagsQuery.mockReturnValue({
      refetch: mockRefetch,
      isFetching: false,
    });
    mockRefetch.mockResolvedValue({
      data: mockTagsData,
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
});
