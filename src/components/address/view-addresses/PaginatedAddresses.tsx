import { useRef } from "react";
import type { AddressItemWithTimeSchema } from "@/schemas/address";
import { cn } from "@/lib/utils";
import { useElementInnerSize } from "@/hooks/useElementInnerSize";
import AddressCard from "@/components/address/view-addresses/AddressCard";
import ViewAddressActions from "@/components/address/view-addresses/ViewAddressActions";

const styles = {
  layout: cn("w-full grid gap-5 overflow-y-auto px-2 sm:px-4 md:px-8 py-1"),
  defaultColumns: cn("grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"),
};
type PaginatedAddressesProps = {
  currentPage: number;
  addresses: AddressItemWithTimeSchema[];
};

const getColumnNumber = (innerWidth: number): string => {
  if (innerWidth < 470) return "grid-cols-1";
  else if (innerWidth < 800) return "grid-cols-2";
  else if (innerWidth < 1120) return "grid-cols-3";
  return "grid-cols-4";
};

export default function PaginatedAddresses({ addresses }: PaginatedAddressesProps) {
  const layoutRef = useRef<HTMLDivElement | null>(null);
  const innerSizes = useElementInnerSize(layoutRef);
  return (
    <div
      className={cn(
        styles.layout,
        innerSizes && innerSizes.length > 0
          ? getColumnNumber(innerSizes[0].width)
          : styles.defaultColumns,
      )}
      ref={layoutRef}
    >
      {addresses.map((address) => (
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
