import { it, vi, describe, beforeEach, expect } from "vitest";
import { screen } from "@testing-library/react";
import type { AddressItemWithTimeSchema } from "@/schemas/address";
import { renderWithProviders } from "@/lib/test-wrappers";
import { DEFAULT_PAGE_DISPLAY_SIZE } from "@/consts/app-config";
import PaginatedAddresses from "./PaginatedAddresses";

vi.mock("./AddressCard", () => ({
  default: vi.fn(({ addressItem }) => (
    <div data-testid={`address-card-${addressItem.id}`}>
      <span>{addressItem.name}</span>
    </div>
  )),
}));

// Mock ResizeObserver
globalThis.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

vi.mock("./ViewAddressActions", () => ({
  default: vi.fn(() => <div data-testid="view-actions">Actions</div>),
}));

const createMockAddress = (id: string, name: string): AddressItemWithTimeSchema => ({
  id,
  name,
  briefIntro: `Brief intro for ${name}`,
  tags: ["tag1", "tag2"],
  address: {
    buildingName: "Building",
    line1: "123 Main St",
    line2: "Apt 4B",
    city: "City",
    region: "Region",
    postalCode: "12345",
    country: "Country",
  },
  createdAt: Date.now(),
  updatedAt: Date.now(),
});

describe("PaginatedAddresses", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders addresses for page 1 only", () => {
    const addresses = Array.from({ length: DEFAULT_PAGE_DISPLAY_SIZE + 4 }).map(
      (_, index) => createMockAddress(`addr-${index}`, `Person ${index}`),
    );
    renderWithProviders(<PaginatedAddresses currentPage={1} addresses={addresses} />);
    expect(screen.getByTestId("address-card-addr-1")).toBeTruthy();
    expect(
      screen.getByTestId(`address-card-addr-${DEFAULT_PAGE_DISPLAY_SIZE - 1}`),
    ).toBeTruthy();
    expect(
      screen.queryByTestId(`address-card-addr-${DEFAULT_PAGE_DISPLAY_SIZE + 1}`),
    ).toBeFalsy();
  });
});

describe("getColumnNumber via useElementInnerSize mock", () => {
  beforeEach(() => {
    vi.mock("@/hooks/useElementInnerSize", () => ({
      useElementInnerSize: vi.fn(),
    }));
  });

  const widthCases: [number, string][] = [
    [300, "grid-cols-1"],
    [600, "grid-cols-2"],
    [900, "grid-cols-3"],
    [1200, "grid-cols-4"],
  ];

  it.each(widthCases)(
    "applies %s => %s based on container width",
    async (width, expectedClass) => {
      const { useElementInnerSize } = await import("@/hooks/useElementInnerSize");
      vi.mocked(useElementInnerSize).mockReturnValue([{ width, height: 500 }]);

      const addresses = [createMockAddress("addr-0", "Person 0")];
      const { container } = renderWithProviders(
        <PaginatedAddresses currentPage={1} addresses={addresses} />,
      );
      const grid = container.querySelector("div")?.querySelector("div") as HTMLElement;
      expect(grid.className).toContain(expectedClass);
    },
  );
});
