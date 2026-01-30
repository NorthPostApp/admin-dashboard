import { DEFAULT_PAGE_DISPLAY_SIZE } from "@/consts/app-config";
import type { AddressItemWithTimeSchema } from "@/schemas/address";
import AddressCard from "@/components/address/AddressCard";
import ViewAddressActions from "@/components/address/ViewAddressActions";
import "./Address.css";

type PaginatedAddressesProps = {
  currentPage: number;
  addresses: AddressItemWithTimeSchema[];
};

export default function PaginatedAddresses({
  currentPage,
  addresses,
}: PaginatedAddressesProps) {
  // currentPage - 1 because the page settings are 1-i
  const currDataRange = [
    (currentPage - 1) * DEFAULT_PAGE_DISPLAY_SIZE,
    currentPage * DEFAULT_PAGE_DISPLAY_SIZE,
  ] as const;
  const currPageData = addresses.slice(...currDataRange);

  return (
    <div className="address-layout__grid">
      {currPageData.map((address) => (
        <div key={address.id}>
          <AddressCard
            addressItem={address}
            actions={<ViewAddressActions addressItem={address} />}
          />
        </div>
      ))}
    </div>
  );
}
