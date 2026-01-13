import { describe, expect, it } from "vitest";
import { getDefaultForm, addressItemsEqual, type AddressItemSchema } from "./address";

describe("getDefaultForm", () => {
  it("should return an empty address form with correct structure", () => {
    const form = getDefaultForm();

    expect(form.name).toBe("");
    expect(form.tags).toEqual([]);
    expect(form.briefIntro).toBe("");
    expect(form.address).toEqual({
      buildingName: "",
      line1: "",
      line2: "",
      city: "",
      region: "",
      postalCode: "",
      country: "",
    });
  });
});

describe("addressItemsEqual", () => {
  const baseAddress: AddressItemSchema = {
    name: "John Doe",
    tags: ["author", "poet"],
    briefIntro: "A famous writer",
    address: {
      buildingName: "Tower",
      line1: "123 Main St",
      line2: "Apt 4",
      city: "New York",
      region: "NY",
      postalCode: "10001",
      country: "USA",
    },
  };

  it("should return true for identical addresses", () => {
    const addressA = { ...baseAddress };
    const addressB = { ...baseAddress };
    expect(addressItemsEqual(addressA, addressB)).toBe(true);
  });

  it("should return false when names differ", () => {
    const addressA = { ...baseAddress };
    const addressB = { ...baseAddress, name: "Jane Doe" };
    expect(addressItemsEqual(addressA, addressB)).toBe(false);
  });

  it("should return false when tags differ in length", () => {
    const addressA = { ...baseAddress };
    const addressB = { ...baseAddress, tags: ["author"] };
    expect(addressItemsEqual(addressA, addressB)).toBe(false);
  });

  it("should return true when tags have same values but different order", () => {
    const addressA = { ...baseAddress, tags: ["author", "poet"] };
    const addressB = { ...baseAddress, tags: ["poet", "author"] };
    expect(addressItemsEqual(addressA, addressB)).toBe(true);
  });

  it("should return false when tags are different", () => {
    const addressA = { ...baseAddress, tags: ["author", "poet"] };
    const addressB = { ...baseAddress, tags: ["musician", "author"] };
    expect(addressItemsEqual(addressA, addressB)).toBe(false);
  });

  it("should return false when any address field differs", () => {
    const addressA = { ...baseAddress };
    const addressB = {
      ...baseAddress,
      address: { ...baseAddress.address, city: "Boston" },
    };
    expect(addressItemsEqual(addressA, addressB)).toBe(false);
  });
});
