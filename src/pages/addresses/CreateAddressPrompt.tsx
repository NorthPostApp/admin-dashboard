import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import PromptInput from "@/components/address/PromptInput";
import { useTranslation } from "react-i18next";

export default function CreateAddressPrompt() {
  const { t } = useTranslation("address:newAddress");
  return (
    <form
      className="address-content__form"
      onSubmit={(e) => {
        e.preventDefault();
        console.log("submitted");
      }}
    >
      <FieldGroup className="address-content__form__group">
        <FieldSet>
          <FieldLegend>{t("prompt.legend")}</FieldLegend>
          <FieldDescription>{t("prompt.description")}</FieldDescription>
          <Field>
            <FieldLabel htmlFor="prompt">{t("prompt.userPrompt")}</FieldLabel>
            <PromptInput />
          </Field>
        </FieldSet>
      </FieldGroup>
    </form>
  );
}
