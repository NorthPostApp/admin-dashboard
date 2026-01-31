import { useState } from "react";
import { useAppContext } from "@/hooks/useAppContext";
import {
  addressItemsEqual,
  type AddressItemSchema,
  type AddressItemWithTimeSchema,
  type UpdateAddressRequestSchema,
} from "@/schemas/address";
import { PopoverMenu, type PopoverControls } from "./PopoverMenu";
import { Button } from "../ui/button";
import { EllipsisVertical } from "lucide-react";
import AddressFromJsonDialog from "./AddressFromJsonDialog";
import { useUpdateAddressMutation } from "@/hooks/mutations/useUpdateAddressMutation";
import { Spinner } from "../ui/spinner";
import { useTranslation } from "react-i18next";

type ViewAddressActionsProps = {
  addressItem: AddressItemWithTimeSchema;
};

export default function ViewAddressActions({ addressItem }: ViewAddressActionsProps) {
  const { language } = useAppContext();
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const { mutate, isPending } = useUpdateAddressMutation();
  const { t } = useTranslation("address:viewAddress");
  const { id, createdAt, updatedAt, ...prevAddress } = addressItem;
  const controls: PopoverControls[] = [
    {
      name: "edit",
      actionComponent: (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setEditDialogOpen(true);
          }}
          className="address-component__popover__body__button__sm"
        >
          {t("controls.edit")}
        </Button>
      ),
    },
    {
      name: "search",
      actionComponent: (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            const searchQuery = `${addressItem.name} ${addressItem.address.country}`;
            const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
            window.open(googleSearchUrl, "_blank");
          }}
          className="address-component__popover__body__button__sm"
        >
          {t("controls.search")}
        </Button>
      ),
    },
  ];

  const stringifyData = () => {
    const data = JSON.stringify(prevAddress, null, 2);
    return data;
  };

  const handleSaveNewAddress = (newAddress: AddressItemSchema) => {
    if (!addressItemsEqual(prevAddress, newAddress)) {
      // the updatedAt timestamp will be updated in the backend
      const newData = { ...newAddress, id, createdAt, updatedAt };
      const requestBody: UpdateAddressRequestSchema = {
        id,
        language,
        address: newData,
      };
      mutate(requestBody);
    }
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
          title={t("editDialog.title")}
          description={t("editDialog.description")}
          handleJsonSave={handleSaveNewAddress}
          initialData={stringifyData()}
          open={editDialogOpen}
          setOpen={setEditDialogOpen}
        />
      )}
    </>
  );
}
