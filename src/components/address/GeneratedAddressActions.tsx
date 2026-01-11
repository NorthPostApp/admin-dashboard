import { EllipsisVertical } from "lucide-react";
import { useAppContext } from "@/hooks/useAppContext";
import { useCreateNewAddressMutation } from "@/hooks/mutations/useCreateNewAddressMutation";
import type { GeneratedAddressSchema, NewAddressRequestSchema } from "@/schemas/address";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { PopoverMenu, type PopoverOption } from "@/components/address/PopoverMenu";
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
  const options: PopoverOption[] = [
    {
      label: `${t("prompt.controls.save")}`,
      fn: () => {
        const addressBody = { language, ...addressItem } as NewAddressRequestSchema;
        mutate(addressBody);
      },
    },
    // { label: "Edit", fn: () => {} },
  ];

  return (
    <PopoverMenu id={addressItem.id} options={options}>
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
