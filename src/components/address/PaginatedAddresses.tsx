import { DEFAULT_PAGE_DISPLAY_SIZE } from "@/consts/app-config";
import type { AddressItemWithTimeSchema } from "@/schemas/address";
import AddressCard from "@/components/address/AddressCard";

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
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 overflow-y-auto px-2 sm:px-4 md:px-8">
      {currPageData.map((address) => (
        <div key={address.id}>
          <AddressCard addressItem={address} actions={[]} />
        </div>
      ))}
    </div>
  );
}
