import { useTranslation } from "react-i18next";
import clsx from "clsx";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import SystemPromptInput from "@/components/address/create-addresses/SystemPromptInput";
import UserPromptInput from "@/components/address/create-addresses/UserPromptInput";
import GeneratedAddresses from "@/components/address/create-addresses/GeneratedAddresses";

const styles = {
  create: clsx("flex-1 flex justify-center overflow-y-auto px-10"),
  contentBody: clsx("flex flex-col justify-between w-full max-w-240 text-left pt-6"),
  formGroup: clsx("gap-4"),
};

export default function CreateAddressPrompt() {
  const { t } = useTranslation("address:newAddress");

  return (
    <div className={styles.create}>
      <div className={styles.contentBody}>
        <form>
          <FieldGroup className={styles.formGroup}>
            <FieldSet>
              <FieldLegend>{t("prompt.legend")}</FieldLegend>
              <FieldDescription>{t("prompt.description")}</FieldDescription>
              <Field>
                <SystemPromptInput />
              </Field>
              <Field>
                <UserPromptInput />
              </Field>
            </FieldSet>
            <FieldSet>
              <GeneratedAddresses />
            </FieldSet>
          </FieldGroup>
        </form>
      </div>
    </div>
  );
}
