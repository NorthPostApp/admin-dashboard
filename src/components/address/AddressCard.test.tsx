import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import AddressCard from "./AddressCard";
import type { GeneratedAddressSchema } from "@/schemas/address";

const mockAddressItem: GeneratedAddressSchema = {
  id: "addr-123",
  name: "John Doe",
  briefIntro: "A fictional character for testing purposes",
  tags: ["historical", "royal", "18th-century"],
  address: {
    buildingName: "Buckingham Palace",
    line1: "Westminster",
    line2: "Near St. James Park",
    city: "London",
    region: "Greater London",
    postalCode: "SW1A 1AA",
    country: "United Kingdom",
  },
};

const minimalAddress: GeneratedAddressSchema = {
  id: "addr-456",
  name: "Jane Smith",
  briefIntro: "Minimal address example",
  tags: ["modern"],
  address: {
    buildingName: "",
    line1: "123 Main Street",
    line2: "",
    city: "Springfield",
    region: "Illinois",
    postalCode: "",
    country: "USA",
  },
};

const mockActions = <button>Action Button</button>;

describe("AddressCard", () => {
  it("renders the address name", () => {
    render(<AddressCard addressItem={mockAddressItem} actions={mockActions} />);
    expect(screen.getByText("John Doe")).toBeTruthy();
  });

  it("formats minimal address with only required fields", () => {
    render(<AddressCard addressItem={minimalAddress} actions={mockActions} />);
    expect(screen.getByText("Jane Smith")).toBeTruthy();
    expect(screen.getByText("123 Main Street")).toBeTruthy();
    expect(screen.getByText("Springfield, Illinois")).toBeTruthy();
    expect(screen.getByText("USA")).toBeTruthy();
  });
});
