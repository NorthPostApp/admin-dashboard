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
import {
  PopoverMenu,
  type PopoverControls,
} from "@/components/address/shared/PopoverMenu";
import AddressFromJsonDialog from "@/components/address/shared/AddressFromJsonDialog";
import clsx from "clsx";

type GeneratedAddressActionsProps = {
  addressItem: GeneratedAddressSchema;
};

const styles = {
  menuButton: clsx("w-full flex justify-between gap-4 text-xs"),
  trigger: clsx("text-primary/70 px-2 text-left"),
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
          className={styles.menuButton}
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
          className={styles.menuButton}
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
          className={styles.menuButton}
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

  const { id: _, ...addressWithoutID } = addressItem;

  return (
    <>
      <PopoverMenu id={addressItem.id} controls={controls}>
        <Button
          size="icon-sm"
          variant="ghost"
          className={styles.trigger}
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
          initialData={addressWithoutID}
          open={editDialogOpen}
          setOpen={setEditDialogOpen}
        />
      )}
    </>
  );
}
