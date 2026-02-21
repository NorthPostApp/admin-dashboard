import type { AddressItemWithTimeSchema } from "@/schemas/address";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogClose,
  DialogTitle,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type DeleteAddressDialogProps = {
  addressItem: AddressItemWithTimeSchema;
  handleDeleteAddress: (addressId: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function DeleteAddressDialog({
  addressItem,
  handleDeleteAddress,
  open,
  setOpen,
}: DeleteAddressDialogProps) {
  const { t } = useTranslation("address:viewAddress");
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="address-content__dialog__content"
        container={document.querySelector("main") ?? undefined}
      >
        <DialogHeader>
          <DialogTitle>{t("deleteDialog.title")}</DialogTitle>
          <DialogDescription>{t("deleteDialog.description")}</DialogDescription>
        </DialogHeader>
        <div className="text-sm text-primary space-y-1">
          <p>ID: {addressItem.id}</p>
          <p>{addressItem.name}</p>
          <p>{addressItem.briefIntro}</p>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"ghost"}>{t("controls.cancel")}</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              variant={"destructive"}
              onClick={() => handleDeleteAddress(addressItem.id)}
            >
              {t("controls.delete")}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
