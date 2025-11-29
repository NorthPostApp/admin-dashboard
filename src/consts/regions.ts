// We currently only support these two regions. Will expand in the future
export type ServiceRegion = "US" | "CN";
export type AddressFormat = "building-first" | "country-first";
export type CountryAddressFormat = Record<ServiceRegion, AddressFormat>;

export function getCountryAddressFormat(region: ServiceRegion): AddressFormat {
  switch (region) {
    case "CN":
      return "country-first";
    case "US":
      return "building-first";
    default:
      return "building-first";
  }
}
