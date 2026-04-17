import { useRef } from "react";
import type { AddressItemWithTimeSchema } from "@/schemas/address";
import { cn } from "@/lib/utils";
import { useElementInnerSize } from "@/hooks/useElementInnerSize";
import AddressCard from "@/components/address/AddressCard";
import ViewAddressActions from "@/components/address/ViewAddressActions";
import "./Address.css";

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
        "address-layout__grid",
        innerSizes && innerSizes.length > 0
          ? getColumnNumber(innerSizes[0].width)
          : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4",
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
