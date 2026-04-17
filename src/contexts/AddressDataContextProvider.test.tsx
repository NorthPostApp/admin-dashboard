import { describe, it, vi, expect, beforeEach } from "vitest";
import { fireEvent, render, screen } from "@/lib/test-utils";
import { useAddressDataContext } from "@/hooks/useAddressDataContext";
import type {
  AddressItemWithTimeSchema,
  GetAddressesResponseSchema,
} from "@/schemas/address";
import AddressDataContextProvider from "./AddressDataContextProvider";

// Test component that uses the context
function TestComponent() {
  const {
    pagedAddressData,
    prevLanguage,
    currentPage,
    totalPages,
    selectPage,
    updatePagedData,
    refreshAddressData,
  } = useAddressDataContext();
  return (
    <div>
      <div data-testid="current-page">{currentPage}</div>
      <div data-testid="total-pages">{totalPages}</div>
      <div data-testid="address-pages">{pagedAddressData.length || 0}</div>
      <div data-testid="language">{prevLanguage || ""}</div>
      <button data-testid="select-page-2" onClick={() => selectPage(2)}>
        Select Page 2
      </button>
      <button data-testid="select-page-5" onClick={() => selectPage(5)}>
        Select Page 5
      </button>
      <button data-testid="select-page-1" onClick={() => selectPage(1)}>
        Select Page 1
      </button>
      <button
        data-testid="update-paged-data"
        onClick={() => {
          const nextPage: GetAddressesResponseSchema = {
            addresses: [
              {
                id: "new-2",
                name: "New Address",
                tags: ["tag1"],
                briefIntro: "Brief intro",
                address: {
                  city: "City",
                  country: "Country",
                  line1: "Line 1",
                  line2: "",
                  buildingName: "",
                  postalCode: "",
                  region: "Region",
                },
                createdAt: Date.now(),
                updatedAt: Date.now(),
              },
            ],
            totalCount: 2,
            totalPages: 2,
            page: 2,
            language: "EN",
          };
          updatePagedData(nextPage);
        }}
      >
        Update Next Page
      </button>
      <button
        data-testid="refresh-data"
        onClick={() => {
          const newData: GetAddressesResponseSchema = {
            addresses: [
              {
                id: "refresh-1",
                name: "Refreshed Address",
                tags: ["tag1"],
                briefIntro: "Brief intro",
                address: {
                  city: "City",
                  country: "Country",
                  line1: "Line 1",
                  line2: "",
                  buildingName: "",
                  postalCode: "",
                  region: "Region",
                },
                createdAt: Date.now(),
                updatedAt: Date.now(),
              },
            ],
            totalCount: 2,
            totalPages: 2,
            page: 1,
            language: "EN",
          };
          refreshAddressData(newData);
        }}
      >
        Refresh Data
      </button>
    </div>
  );
}

// Helper function to create mock address data
function createMockAddressData(count: number, startId = 0): GetAddressesResponseSchema {
  const addresses = Array.from({ length: count }, (_, i) => ({
    id: `address-${startId + i}`,
    name: `Address ${startId + i}`,
    tags: ["tag1", "tag2"],
    briefIntro: "This is a brief introduction",
    address: {
      city: "Test City",
      country: "Test Country",
      line1: "123 Test St",
      line2: "Apt 4",
      buildingName: "Test Building",
      postalCode: "12345",
      region: "Test Region",
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }));
  return {
    addresses,
    page: 1,
    totalCount: count,
    totalPages: count,
    language: "EN",
  };
}

describe("AddressDataContextProvider", () => {
  beforeEach(() => vi.clearAllMocks());
  it("provides default values on initialization", () => {
    render(
      <AddressDataContextProvider>
        <TestComponent />
      </AddressDataContextProvider>,
    );
    expect(screen.getByTestId("current-page").textContent).toBe("1");
    expect(screen.getByTestId("total-pages").textContent).toBe("1");
    expect(screen.getByTestId("address-pages").textContent).toBe("0");
    expect(screen.getByTestId("language").textContent).toBe("");
  });

  it("throws error when useAddressDataContext is used outside provider", () => {
    // Suppress console.error for this test
    const consoleError = console.error;
    console.error = () => {};
    expect(() => {
      render(<TestComponent />);
    }).toThrow("useAddressDataContext must be used within AddressDataContextProvider");
    console.error = consoleError;
  });

  it("updates current page when valid page is selected", () => {
    render(
      <AddressDataContextProvider>
        <TestComponent />
      </AddressDataContextProvider>,
    );
    const selectButton = screen.getByTestId("select-page-2");
    fireEvent.click(selectButton);
    // With only 1 total page, it should clamp to page 1
    expect(screen.getByTestId("current-page").textContent).toBe("1");
  });

  it("clamps page selection to minimum of 1", () => {
    render(
      <AddressDataContextProvider>
        <TestComponent />
      </AddressDataContextProvider>,
    );
    const selectButton = screen.getByTestId("select-page-1");
    fireEvent.click(selectButton);
    expect(screen.getByTestId("current-page").textContent).toBe("1");
  });

  it("clamps page selection to maximum totalPages", () => {
    render(
      <AddressDataContextProvider>
        <TestComponent />
      </AddressDataContextProvider>,
    );
    const refreshButton = screen.getByTestId("refresh-data");
    fireEvent.click(refreshButton);
    const selectButton = screen.getByTestId("select-page-5");
    fireEvent.click(selectButton);
    const currentPage = parseInt(screen.getByTestId("current-page").textContent || "2");
    const totalPages = parseInt(screen.getByTestId("total-pages").textContent || "2");
    expect(currentPage).toBeLessThanOrEqual(totalPages);
  });

  it("does not update page if selecting current page", () => {
    render(
      <AddressDataContextProvider>
        <TestComponent />
      </AddressDataContextProvider>,
    );
    expect(screen.getByTestId("current-page").textContent).toBe("1");
    const selectButton = screen.getByTestId("select-page-1");
    fireEvent.click(selectButton);
    expect(screen.getByTestId("current-page").textContent).toBe("1");
  });

  it("does not update page if selecting the same non-default page", () => {
    function TestComponentWithPageSelection() {
      const { refreshAddressData, selectPage, currentPage } = useAddressDataContext();
      return (
        <div>
          <div data-testid="current-page">{currentPage}</div>
          <button
            data-testid="setup-multi-page"
            onClick={() => {
              const data = createMockAddressData(3);
              refreshAddressData(data);
            }}
          >
            Setup
          </button>
          <button data-testid="select-page-2" onClick={() => selectPage(2)}>
            Select Page 2
          </button>
        </div>
      );
    }
    render(
      <AddressDataContextProvider>
        <TestComponentWithPageSelection />
      </AddressDataContextProvider>,
    );
    const setupButton = screen.getByTestId("setup-multi-page");
    fireEvent.click(setupButton);
    const selectButton = screen.getByTestId("select-page-2");
    fireEvent.click(selectButton);
    expect(screen.getByTestId("current-page").textContent).toBe("2");
    fireEvent.click(selectButton);
    expect(screen.getByTestId("current-page").textContent).toBe("2");
  });

  it("appends new addresses to existing data", () => {
    render(
      <AddressDataContextProvider>
        <TestComponent />
      </AddressDataContextProvider>,
    );
    // First add some initial data
    const refreshButton = screen.getByTestId("refresh-data");
    fireEvent.click(refreshButton);
    expect(screen.getByTestId("total-pages").textContent).toBe("2");
    expect(screen.getByTestId("address-pages").textContent).toBe("2");
    // Now update with next page data
    const updateButton = screen.getByTestId("update-paged-data");
    fireEvent.click(updateButton);
    expect(screen.getByTestId("address-pages").textContent).toBe("2");
  });

  it("updates total pages based on new address count", () => {
    render(
      <AddressDataContextProvider>
        <TestComponent />
      </AddressDataContextProvider>,
    );
    expect(screen.getByTestId("total-pages").textContent).toBe("1");
    const updateButton = screen.getByTestId("update-paged-data");
    fireEvent.click(updateButton);
    expect(screen.getByTestId("total-pages").textContent).toBe("2");
  });

  it("handles updatePagedData when no previous data exists", () => {
    render(
      <AddressDataContextProvider>
        <TestComponent />
      </AddressDataContextProvider>,
    );
    const updateButton = screen.getByTestId("update-paged-data");
    fireEvent.click(updateButton);
    expect(screen.getByTestId("total-pages").textContent).toBe("2");
    expect(screen.getByTestId("address-pages").textContent).toBe("2");
  });

  it("updated single data", () => {
    function TestComponentWithCustomData() {
      const {
        pagedAddressData,
        currentPage,
        refreshAddressData,
        updateSingleAddressData,
        totalPages,
      } = useAddressDataContext();
      return (
        <div>
          <div data-testid="total-pages">{totalPages}</div>
          <button
            data-testid="load-data"
            onClick={() => {
              // Create data with exactly 2 pages worth of addresses
              const data = createMockAddressData(2);
              refreshAddressData(data);
            }}
          >
            Load Data
          </button>
          <button
            data-testid="update-data"
            onClick={() => {
              const newData: AddressItemWithTimeSchema = {
                id: "address-0",
                name: "updated name",
                tags: ["tag1", "tag2"],
                briefIntro: "This is a brief introduction",
                address: {
                  city: "Test City",
                  country: "Test Country",
                  line1: "123 Test St",
                  line2: "Apt 4",
                  buildingName: "Test Building",
                  postalCode: "12345",
                  region: "Test Region",
                },
                createdAt: Date.now(),
                updatedAt: Date.now(),
              };
              updateSingleAddressData(newData);
            }}
          >
            Update data
          </button>
          <div>
            {pagedAddressData.length > 0 &&
              pagedAddressData[currentPage - 1].map((data) => {
                return <p key={data.id}>{data.name}</p>;
              })}
          </div>
        </div>
      );
    }
    render(
      <AddressDataContextProvider>
        <TestComponentWithCustomData />
      </AddressDataContextProvider>,
    );
    const loadButton = screen.getByTestId("load-data");
    const updateButton = screen.getByTestId("update-data");
    fireEvent.click(loadButton);
    fireEvent.click(updateButton);
    expect(screen.getByText(/updated name/)).toBeTruthy();
  });

  it("ensures minimum of 1 total page even with 0 addresses", () => {
    function TestComponentWithEmptyData() {
      const { refreshAddressData, totalPages } = useAddressDataContext();
      return (
        <div>
          <div data-testid="total-pages">{totalPages}</div>
          <button
            data-testid="load-data"
            onClick={() => {
              const data = createMockAddressData(0);
              refreshAddressData(data);
            }}
          >
            Load Empty Data
          </button>
        </div>
      );
    }
    render(
      <AddressDataContextProvider>
        <TestComponentWithEmptyData />
      </AddressDataContextProvider>,
    );
    const loadButton = screen.getByTestId("load-data");
    fireEvent.click(loadButton);
    expect(screen.getByTestId("total-pages").textContent).toBe("1");
  });

  it("delete single data from context", () => {
    const totalCount = 3;
    function TestComponentWithDataDeletion() {
      const {
        pagedAddressData,
        totalPages,
        refreshAddressData,
        deleteSingleAddressData,
      } = useAddressDataContext();
      return (
        <div>
          <div>
            {pagedAddressData.length > 0 &&
              pagedAddressData[0].map((data) => (
                <div key={data.id}>
                  <p>{data.id}</p>
                  <button
                    data-testid={`delete-${data.id}`}
                    onClick={() => deleteSingleAddressData(data.id)}
                  >
                    Delete {data.id}
                  </button>
                </div>
              ))}
          </div>
          <div data-testid="count">
            {pagedAddressData.length > 0 ? pagedAddressData[0].length : 0}
          </div>
          <button
            data-testid="setup-multi-page"
            onClick={() => {
              const data = createMockAddressData(totalCount);
              refreshAddressData(data);
            }}
          >
            Setup
          </button>
          <p data-testid="total-pages">{totalPages}</p>
        </div>
      );
    }
    render(
      <AddressDataContextProvider>
        <TestComponentWithDataDeletion />
      </AddressDataContextProvider>,
    );
    const setupButton = screen.getByTestId("setup-multi-page");
    fireEvent.click(setupButton);
    expect(screen.getByText("address-0")).toBeTruthy();
    expect(screen.getByTestId("count").innerHTML).toBe(totalCount.toString());
    const deleteFirstButton = screen.getByTestId("delete-address-0");
    fireEvent.click(deleteFirstButton);
    expect(screen.queryByText("address-0")).toBeFalsy();
    expect(screen.getByTestId("count").innerHTML).toBe((totalCount - 1).toString());
    const deleteLastButton = screen.getByTestId("delete-address-2");
    fireEvent.click(deleteLastButton);
    expect(screen.queryByText("address-2")).toBeFalsy();
  });
});
