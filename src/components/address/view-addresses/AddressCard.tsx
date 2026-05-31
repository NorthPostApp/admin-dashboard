import * as React from "react";
import type { ReactNode } from "react";
import clsx from "clsx";
import {
  type GeneratedAddressSchema,
  type AddressItemSchema,
  addressItemsEqual,
} from "@/schemas/address";
import TagBadge from "@/components/address/shared/TagBadge";
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

const styles = {
  body: clsx("gap-3 justify-between p-2.5 h-full"),
  header: clsx("px-1"),
  title: clsx("w-full flex justify-between gap-2 items-center"),
  actions: clsx("flex-1 flex items-center justify-end"),
  description: clsx("text-xs text-primary/50"),
  content: clsx("flex flex-col gap-3 px-1"),
  lines: clsx("text-sm text-primary/60"),
  tags: clsx("w-full flex flex-wrap gap-1"),
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
    <Card className={styles.body}>
      <CardHeader className={styles.header}>
        <CardTitle className={styles.title}>
          <p>{addressItem.name}</p>
          <div className={styles.actions}>
            <CopyButton copyAction={() => JSON.stringify(addressItem, null, 2)} />
            {actions !== null && actions !== undefined && actions}
          </div>
        </CardTitle>
        <CardDescription className={styles.description}>
          {addressItem.briefIntro}
        </CardDescription>
      </CardHeader>
      <CardContent className={styles.content}>
        <div className={styles.lines}>
          {addressLines.map((line) => {
            return <p key={`${addressItem.id}-${line}`}>{line}</p>;
          })}
        </div>
        <div className={styles.tags}>
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
