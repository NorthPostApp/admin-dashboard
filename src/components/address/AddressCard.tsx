import * as React from "react";
import type { ReactNode } from "react";
import {
  type GeneratedAddressSchema,
  type AddressItemSchema,
  addressItemsEqual,
} from "@/schemas/address";
import TagBadge from "@/components/address/TagBadge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CopyButton from "@/components/ui/copy-button";

type AddressCardProps = {
  addressItem: GeneratedAddressSchema;
  actions: ReactNode;
};

// Address will be in the international format
// because the user will send the letter to the person in different country/era
const formatAddressLines = (addressItem: AddressItemSchema) => {
  const lines = [];
  const { line1, line2, city, country, buildingName, postalCode, region } =
    addressItem.address;
  if (buildingName) lines.push(buildingName);
  lines.push(line1);
  if (line2) lines.push(line2);
  lines.push([city, region, postalCode].filter(Boolean).join(", "));
  lines.push(country);
  return lines;
};

function AddressCard({ addressItem, actions }: AddressCardProps) {
  const addressLines = formatAddressLines(addressItem as AddressItemSchema);

  return (
    <Card className="address-component__card">
      <CardHeader className="address-component__card__header">
        <CardTitle className="address-component__card__title">
          <p>{addressItem.name}</p>
          <div className="flex-1 flex items-center justify-end">
            <CopyButton copyAction={() => JSON.stringify(addressItem, null, 2)} />
            {actions !== null && actions !== undefined && actions}
          </div>
        </CardTitle>
        <CardDescription className="address-component__card__description">
          {addressItem.briefIntro}
        </CardDescription>
      </CardHeader>
      <CardContent className="address-component__card__content">
        <div className="address-component__card__content__lines">
          {addressLines.map((line) => {
            return <p key={`${addressItem.id}-${line}`}>{line}</p>;
          })}
        </div>
        <div className="address-component__card__content__tags">
          {addressItem.tags.map((tag) => (
            <TagBadge key={`${addressItem.id}-${tag}`} value={tag} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default React.memo(AddressCard, (prevProps, nextProps) => {
  return addressItemsEqual(prevProps.addressItem, nextProps.addressItem);
});
