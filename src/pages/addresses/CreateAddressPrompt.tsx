import { useTranslation } from "react-i18next";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import UserPromptInput from "@/components/address/UserPromptInput";
import SystemPromptInput from "@/components/address/SystemPromptInput";

export default function CreateAddressPrompt() {
  const { t } = useTranslation("address:newAddress");
  return (
    <form
      className="address-content__form"
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
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
      </FieldGroup>
    </form>
  );
}
