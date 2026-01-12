import { EllipsisVertical } from "lucide-react";
import { useAppContext } from "@/hooks/useAppContext";
import { useCreateNewAddressMutation } from "@/hooks/mutations/useCreateNewAddressMutation";
import type { GeneratedAddressSchema, NewAddressRequestSchema } from "@/schemas/address";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { PopoverMenu, type PopoverControls } from "@/components/address/PopoverMenu";
import { useTranslation } from "react-i18next";

type GeneratedAddressActionsProps = {
  addressItem: GeneratedAddressSchema;
};

export default function GeneratedAddressActions({
  addressItem,
}: GeneratedAddressActionsProps) {
  const { language } = useAppContext();
  const { t } = useTranslation("address:newAddress");
  const { mutate, isPending } = useCreateNewAddressMutation();
  const controls: PopoverControls[] = [
    {
      name: "save",
      actionComponent: (
        <Button
          variant="ghost"
          size={"sm"}
          onClick={() => {
            const addressBody = { language, ...addressItem } as NewAddressRequestSchema;
            mutate(addressBody);
          }}
          className="address-component__popover__body__button text-xs"
        >
          {t("prompt.controls.save")}
        </Button>
      ),
    },
  ];

  return (
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
  );
}
