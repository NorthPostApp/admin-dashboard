import { useState, createContext } from "react";
import {
  getCountryAddressFormat,
  type AddressFormat,
  type ServiceRegion,
} from "@/consts/regions";

interface RegionContext {
  region: ServiceRegion;
  addressFormat: AddressFormat;
  updateRegion: (newRegion: ServiceRegion) => void;
}

type RegionInfo = {
  region: ServiceRegion;
  addressFormat: AddressFormat;
};

// first check the localStorage, if exists, set service region, else default CN
const DEFAULT_REGION: ServiceRegion = "CN";
const DEFAULT_ADDRESS_FORMAT: AddressFormat = getCountryAddressFormat(DEFAULT_REGION);

// service region content
const RegionContext = createContext<RegionContext>({
  region: DEFAULT_REGION,
  addressFormat: DEFAULT_ADDRESS_FORMAT,
  updateRegion: () => {},
});

export default function RegionProvider({ children }: { children: React.ReactNode }) {
  // wrap region and address information into a single state to avoid
  // unnecessary re-renderings
  const [regionInfo, setRegionInfo] = useState<RegionInfo>({
    region: DEFAULT_REGION,
    addressFormat: DEFAULT_ADDRESS_FORMAT,
  });

  const updateRegion = (newRegion: ServiceRegion) => {
    setRegionInfo(() => ({
      region: newRegion,
      addressFormat: getCountryAddressFormat(newRegion),
    }));
  };

  return (
    <RegionContext.Provider
      value={{
        ...regionInfo,
        updateRegion,
      }}
    >
      {children}
    </RegionContext.Provider>
  );
}
