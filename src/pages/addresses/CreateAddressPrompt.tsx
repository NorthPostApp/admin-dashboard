import { useTranslation } from "react-i18next";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import SystemPromptInput from "@/components/address/SystemPromptInput";
import UserPromptInput from "@/components/address/UserPromptInput";
import GeneratedAddresses from "@/components/address/GeneratedAddresses";

export default function CreateAddressPrompt() {
  const { t } = useTranslation("address:newAddress");

  return (
    <div className="address-content__body">
      <form>
        <FieldGroup className="address-content__form__group">
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
  );
}
