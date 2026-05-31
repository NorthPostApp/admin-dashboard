import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { EllipsisVertical } from "lucide-react";
import clsx from "clsx";
import {
  addressItemsEqual,
  type AddressItemSchema,
  type AddressItemWithTimeSchema,
  type UpdateAddressRequestSchema,
} from "@/schemas/address";
import { useAppContext } from "@/hooks/useAppContext";
import { useDeleteAddressMutation } from "@/hooks/mutations/useDeleteAddressMutation";
import { useUpdateAddressMutation } from "@/hooks/mutations/useUpdateAddressMutation";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  PopoverMenu,
  type PopoverControls,
} from "@/components/address/shared/PopoverMenu";
import AddressFromJsonDialog from "@/components/address/AddressFromJsonDialog";
import DeleteAddressDialog from "@/components/address/view-addresses/DeleteAddressDialog";

const styles = {
  popoverButton: clsx("w-full flex justify-between gap-4 text-xs"),
  dangerPopoverButton: clsx(
    "w-full flex justify-between gap-4 text-xs text-destructive hover:text-background hover:bg-destructive dark:hover:bg-destructive dark:hover:text-primary",
  ),
  trigger: clsx("text-primary/70 px-2 text-left"),
};

type ViewAddressActionsProps = {
  addressItem: AddressItemWithTimeSchema;
};

export default function ViewAddressActions({ addressItem }: ViewAddressActionsProps) {
  const { language } = useAppContext();
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const { mutate, isPending: isUpdateAddressPending } = useUpdateAddressMutation();
  const { mutate: deleteAddressMutate, isPending: isDeleteAddressIsPending } =
    useDeleteAddressMutation();
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
          className={styles.popoverButton}
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
          className={styles.popoverButton}
        >
          {t("controls.search")}
        </Button>
      ),
    },
    {
      name: "delete",
      actionComponent: (
        <Button
          variant="ghost"
          size="sm"
          className={styles.dangerPopoverButton}
          onClick={() => {
            setDeleteDialogOpen(true);
          }}
        >
          {t("controls.delete")}
        </Button>
      ),
    },
  ];

  const stringData = useMemo(() => {
    const data = JSON.stringify(prevAddress, null, 2);
    return data;
  }, [prevAddress]);

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

  const handleDeleteSingleAddress = (addressId: string) => {
    deleteAddressMutate(addressId);
  };

  const pending = isDeleteAddressIsPending || isUpdateAddressPending;

  return (
    <>
      <PopoverMenu id={addressItem.id} controls={controls}>
        <Button
          size="icon-sm"
          variant="ghost"
          className={styles.trigger}
          type="button"
          disabled={pending}
        >
          {pending ? <Spinner /> : <EllipsisVertical />}
        </Button>
      </PopoverMenu>
      {editDialogOpen && (
        <AddressFromJsonDialog
          title={t("editDialog.title")}
          description={t("editDialog.description")}
          handleJsonSave={handleSaveNewAddress}
          initialData={stringData}
          open={editDialogOpen}
          setOpen={setEditDialogOpen}
        />
      )}
      {deleteDialogOpen && (
        <DeleteAddressDialog
          addressItem={addressItem}
          handleDeleteAddress={handleDeleteSingleAddress}
          open={deleteDialogOpen}
          setOpen={setDeleteDialogOpen}
        />
      )}
    </>
  );
}
