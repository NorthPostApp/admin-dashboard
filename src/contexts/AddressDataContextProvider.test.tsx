import { describe, it, vi, expect, beforeEach } from "vitest";
import { fireEvent, render, screen } from "@/lib/test-utils";
import { useAddressDataContext } from "@/hooks/useAddressDataContext";
import type {
  AddressItemWithTimeSchema,
  GetAllAddressesResponseSchema,
} from "@/schemas/address";
import { DEFAULT_PAGE_DISPLAY_SIZE } from "@/consts/app-config";
import AddressDataContextProvider from "./AddressDataContextProvider";

// Test component that uses the context
function TestComponent() {
  const {
    addressData,
    currentPage,
    totalPages,
    selectPage,
    updateNextPageData,
    refreshAddressData,
  } = useAddressDataContext();
  return (
    <div>
      <div data-testid="current-page">{currentPage}</div>
      <div data-testid="total-pages">{totalPages}</div>
      <div data-testid="address-count">{addressData?.addresses.length || 0}</div>
      <div data-testid="total-count">{addressData?.totalCount || 0}</div>
      <div data-testid="has-more">{String(addressData?.hasMore)}</div>
      <div data-testid="last-doc-id">{addressData?.lastDocId || ""}</div>
      <div data-testid="language">{addressData?.language || ""}</div>
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
        data-testid="update-next-page"
        onClick={() => {
          const nextPageData: GetAllAddressesResponseSchema = {
            addresses: [
              {
                id: "new-1",
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
            totalCount: 1,
            hasMore: false,
            lastDocId: "new-last-doc",
            language: "EN",
          };
          updateNextPageData(nextPageData);
        }}
      >
        Update Next Page
      </button>
      <button
        data-testid="refresh-data"
        onClick={() => {
          const newData: GetAllAddressesResponseSchema = {
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
            totalCount: 1,
            hasMore: false,
            lastDocId: "refresh-last-doc",
            language: "ZH",
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
function createMockAddressData(
  count: number,
  startId = 0,
): GetAllAddressesResponseSchema {
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
    totalCount: count,
    hasMore: false,
    lastDocId: `address-${startId + count - 1}`,
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
    expect(screen.getByTestId("address-count").textContent).toBe("0");
    expect(screen.getByTestId("total-count").textContent).toBe("0");
    expect(screen.getByTestId("has-more").textContent).toBe("undefined");
    expect(screen.getByTestId("last-doc-id").textContent).toBe("");
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
    const currentPage = parseInt(screen.getByTestId("current-page").textContent || "1");
    const totalPages = parseInt(screen.getByTestId("total-pages").textContent || "1");
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
              const data = createMockAddressData(DEFAULT_PAGE_DISPLAY_SIZE * 3);
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
    expect(screen.getByTestId("address-count").textContent).toBe("1");
    // Now update with next page data
    const updateButton = screen.getByTestId("update-next-page");
    fireEvent.click(updateButton);
    expect(screen.getByTestId("address-count").textContent).toBe("2");
  });

  it("updates hasMore and lastDocId from new data", () => {
    render(
      <AddressDataContextProvider>
        <TestComponent />
      </AddressDataContextProvider>,
    );
    const updateButton = screen.getByTestId("update-next-page");
    fireEvent.click(updateButton);
    expect(screen.getByTestId("has-more").textContent).toBe("false");
    expect(screen.getByTestId("last-doc-id").textContent).toBe("new-last-doc");
  });

  it("updates total pages based on new address count", () => {
    render(
      <AddressDataContextProvider>
        <TestComponent />
      </AddressDataContextProvider>,
    );
    expect(screen.getByTestId("total-pages").textContent).toBe("1");
    const updateButton = screen.getByTestId("update-next-page");
    fireEvent.click(updateButton);
    expect(screen.getByTestId("total-pages").textContent).toBe("1");
  });

  it("handles updateNextPageData when no previous data exists", () => {
    render(
      <AddressDataContextProvider>
        <TestComponent />
      </AddressDataContextProvider>,
    );
    const updateButton = screen.getByTestId("update-next-page");
    fireEvent.click(updateButton);
    expect(screen.getByTestId("address-count").textContent).toBe("1");
    expect(screen.getByTestId("total-count").textContent).toBe("0");
    expect(screen.getByTestId("language").textContent).toBe("EN");
  });

  it("replaces existing data with new data", () => {
    render(
      <AddressDataContextProvider>
        <TestComponent />
      </AddressDataContextProvider>,
    );
    // Add initial data
    const updateButton = screen.getByTestId("update-next-page");
    fireEvent.click(updateButton);
    expect(screen.getByTestId("address-count").textContent).toBe("1");
    expect(screen.getByTestId("language").textContent).toBe("EN");
    // Refresh with new data
    const refreshButton = screen.getByTestId("refresh-data");
    fireEvent.click(refreshButton);
    expect(screen.getByTestId("address-count").textContent).toBe("1");
    expect(screen.getByTestId("language").textContent).toBe("ZH");
    expect(screen.getByTestId("last-doc-id").textContent).toBe("refresh-last-doc");
  });

  it("updated single data", () => {
    function TestComponentWithCustomData() {
      const { addressData, refreshAddressData, updateSingleAddressData, totalPages } =
        useAddressDataContext();
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
            {addressData?.addresses.map((data) => {
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

  it("updates total pages after refresh", () => {
    render(
      <AddressDataContextProvider>
        <TestComponent />
      </AddressDataContextProvider>,
    );
    const refreshButton = screen.getByTestId("refresh-data");
    fireEvent.click(refreshButton);
    expect(screen.getByTestId("total-pages").textContent).toBe("1");
  });

  it("calculates total pages correctly based on DEFAULT_PAGE_DISPLAY_SIZE", () => {
    function TestComponentWithCustomData() {
      const { refreshAddressData, totalPages } = useAddressDataContext();
      return (
        <div>
          <div data-testid="total-pages">{totalPages}</div>
          <button
            data-testid="load-data"
            onClick={() => {
              // Create data with exactly 2 pages worth of addresses
              const data = createMockAddressData(DEFAULT_PAGE_DISPLAY_SIZE * 2);
              refreshAddressData(data);
            }}
          >
            Load Data
          </button>
        </div>
      );
    }
    render(
      <AddressDataContextProvider>
        <TestComponentWithCustomData />
      </AddressDataContextProvider>,
    );
    const loadButton = screen.getByTestId("load-data");
    fireEvent.click(loadButton);
    expect(screen.getByTestId("total-pages").textContent).toBe("2");
  });

  it("rounds up total pages for partial pages", () => {
    function TestComponentWithPartialPage() {
      const { refreshAddressData, totalPages } = useAddressDataContext();
      return (
        <div>
          <div data-testid="total-pages">{totalPages}</div>
          <button
            data-testid="load-data"
            onClick={() => {
              // Create data with 1.5 pages worth of addresses
              const data = createMockAddressData(
                Math.floor(DEFAULT_PAGE_DISPLAY_SIZE * 1.5),
              );
              refreshAddressData(data);
            }}
          >
            Load Data
          </button>
        </div>
      );
    }
    render(
      <AddressDataContextProvider>
        <TestComponentWithPartialPage />
      </AddressDataContextProvider>,
    );
    const loadButton = screen.getByTestId("load-data");
    fireEvent.click(loadButton);
    expect(screen.getByTestId("total-pages").textContent).toBe("2");
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
      const { addressData, totalPages, refreshAddressData, deleteSingleAddressData } =
        useAddressDataContext();
      return (
        <div>
          <div>
            {addressData?.addresses.map((data) => (
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
          <div data-testid="count">{addressData?.totalCount}</div>
          <div data-testid="last-id">{addressData?.lastDocId}</div>
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
    expect(screen.getByTestId("last-id").innerHTML).toBe("address-1");
    const deleteFinalButton = screen.getByTestId("delete-address-1");
    fireEvent.click(deleteFinalButton);
    expect(screen.getByTestId("last-id").innerHTML).toBe("");
  });

  it("update total pages and current page when deletion happens", () => {
    function TestComponentWithDataDeletion() {
      const {
        addressData,
        currentPage,
        totalPages,
        selectPage,
        refreshAddressData,
        deleteSingleAddressData,
      } = useAddressDataContext();
      return (
        <div>
          <div>
            {addressData?.addresses.map((data) => (
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
          <button
            data-testid="setup-multi-page"
            onClick={() => {
              const data = createMockAddressData(DEFAULT_PAGE_DISPLAY_SIZE + 1);
              refreshAddressData(data);
            }}
          >
            Setup
          </button>
          <p data-testid="total-pages">{totalPages}</p>
          <p data-testid="curr-page">{currentPage}</p>
          <button
            onClick={() => {
              selectPage(2);
            }}
            data-testid="page-2"
          >
            Page 2
          </button>
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
    const totalPages = screen.getByTestId("total-pages");
    const currPage = screen.getByTestId("curr-page");
    expect(screen.getByText("address-0")).toBeTruthy();
    expect(totalPages.innerHTML).toBe("2");
    const selectPageButton = screen.getByTestId("page-2");
    fireEvent.click(selectPageButton);
    expect(currPage.innerHTML).toBe("2");
    const lastItemDelete = screen.getByTestId(`delete-address-16`);
    fireEvent.click(lastItemDelete);
    expect(totalPages.innerHTML).toBe("1");
    expect(currPage.innerHTML).toBe("1");
  });
});
