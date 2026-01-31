import { useState } from "react";
import { useTranslation } from "react-i18next";
import { EllipsisVertical } from "lucide-react";
import { useAppContext } from "@/hooks/useAppContext";
import { useNewAddressContext } from "@/hooks/useNewAddressContext";
import { useCreateNewAddressMutation } from "@/hooks/mutations/useCreateNewAddressMutation";
import {
  addressItemsEqual,
  type AddressItemSchema,
  type GeneratedAddressSchema,
  type NewAddressRequestSchema,
} from "@/schemas/address";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { PopoverMenu, type PopoverControls } from "@/components/address/PopoverMenu";
import AddressFromJsonDialog from "@/components/address/AddressFromJsonDialog";

type GeneratedAddressActionsProps = {
  addressItem: GeneratedAddressSchema;
};

export default function GeneratedAddressActions({
  addressItem,
}: GeneratedAddressActionsProps) {
  const { language } = useAppContext();
  const { updateGeneratedAddress } = useNewAddressContext();
  const { t } = useTranslation("address:newAddress");
  const { mutate, isPending } = useCreateNewAddressMutation();
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const controls: PopoverControls[] = [
    {
      name: "save",
      actionComponent: (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            const addressBody = { language, ...addressItem } as NewAddressRequestSchema;
            mutate(addressBody);
          }}
          className="address-component__popover__body__button__sm"
        >
          {t("prompt.controls.save")}
        </Button>
      ),
    },
    {
      name: "edit",
      actionComponent: (
        <Button
          variant="ghost"
          size="sm"
          className="address-component__popover__body__button__sm"
          onClick={() => {
            setEditDialogOpen(true);
          }}
        >
          {t("prompt.controls.edit")}
        </Button>
      ),
    },
    {
      name: "search",
      actionComponent: (
        <Button
          variant="ghost"
          size="sm"
          className="address-component__popover__body__button__sm"
          onClick={() => {
            const searchQuery = `${addressItem.name} ${addressItem.address.country}`;
            const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
            window.open(googleSearchUrl, "_blank");
          }}
        >
          {t("prompt.controls.search")}
        </Button>
      ),
    },
  ];

  const stringifyData = () => {
    const { id: _, ...addressWithoutID } = addressItem;
    const data = JSON.stringify(addressWithoutID, null, 2);
    return data;
  };

  return (
    <>
      <PopoverMenu id={addressItem.id} controls={controls}>
        <Button
          size="icon-sm"
          variant="ghost"
          className="address-component__prompt__trigger"
          type="button"
          disabled={isPending}
        >
          {isPending ? <Spinner /> : <EllipsisVertical />}
        </Button>
      </PopoverMenu>
      {editDialogOpen && (
        <AddressFromJsonDialog
          title={t("json.title-edit")}
          description={t("json.description-edit")}
          handleJsonSave={(newAddress: AddressItemSchema) => {
            const { id: _, ...prevAddress } = addressItem;
            if (!addressItemsEqual(prevAddress, newAddress)) {
              updateGeneratedAddress(addressItem.id, newAddress);
            }
          }}
          initialData={stringifyData()}
          open={editDialogOpen}
          setOpen={setEditDialogOpen}
        />
      )}
    </>
  );
}
