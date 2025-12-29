import type z from "zod";
import { useCallback, useEffect } from "react";
import { useForm, revalidateLogic } from "@tanstack/react-form";
import { useTranslation } from "react-i18next";
import {
  Address,
  createNewAddressRequestSchema,
  getDefaultForm,
  type ZodNewAddressRequest,
} from "@/schemas/address-schema";
import { useAppContext } from "@/hooks/useAppContext";
import { useCreateNewAddressMutation } from "@/hooks/mutations/useCreateNewAddressMutation";
import CreateFromJsonDialog from "@/pages/addresses/CreateFromJsonDialog";
import InputAndButton from "@/components/address/InputAndButton";
import TagBadge from "@/components/address/TagBadge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";

type FormFields =
  | Exclude<keyof ZodNewAddressRequest, "address">
  | `address.${keyof z.infer<typeof Address>}`;

export default function CreateAddressesManual() {
  const { language } = useAppContext();
  const { t } = useTranslation("address:newAddress");

  const form = useForm({
    defaultValues: {
      ...getDefaultForm(language),
    } satisfies ZodNewAddressRequest,
    validationLogic: revalidateLogic({ mode: "blur" }), // validate when focus out the field
    validators: {
      onDynamic: createNewAddressRequestSchema(t),
    },
    onSubmit: ({ value }) => {
      mutation.mutate(value);
    },
  });

  // The clean up function that clean up all fields once
  // new address created successfully
  const cleanupFn = useCallback(() => {
    form.reset();
  }, [form]);

  const mutation = useCreateNewAddressMutation(cleanupFn);
  const submitPending = mutation.isPending;

  const handleAddTag = (value: string | undefined) => {
    if (!value || value.length === 0) {
      return;
    }
    const prevTags = form.getFieldValue("tags");
    const tags = value.split(";").map((tag) => tag.trim().toLowerCase());
    const filteredTags = Array.from(new Set([...tags, ...prevTags]));
    form.setFieldValue("tags", filteredTags);
  };

  const handleRemoveTag = (tag: string) => {
    const prevTags = form.getFieldValue("tags");
    const newTags = prevTags.filter((currTag) => currTag != tag);
    form.setFieldValue("tags", newTags);
  };

  const handleJsonImport = (formData: ZodNewAddressRequest) => {
    form.setFieldValue("language", formData.language);
    form.setFieldValue("name", formData.name);
    form.setFieldValue("tags", formData.tags);
    form.setFieldValue("briefIntro", formData.briefIntro);
    form.setFieldValue("address.buildingName", formData.address.buildingName);
    form.setFieldValue("address.line1", formData.address.line1);
    form.setFieldValue("address.line2", formData.address.line2);
    form.setFieldValue("address.city", formData.address.city);
    form.setFieldValue("address.region", formData.address.region);
    form.setFieldValue("address.postalCode", formData.address.postalCode);
    form.setFieldValue("address.country", formData.address.country);
  };

  // Reusable function to get to convert form's text field into UI elements
  const getFormTextField = ({
    fieldName,
    label,
    placeholder,
    type = "input",
  }: {
    fieldName: FormFields;
    label: string;
    placeholder: string;
    type?: "input" | "textarea";
  }) => {
    return (
      <form.Field
        name={fieldName}
        children={(field) => {
          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field className="address-content__form__field">
              <FieldLabel htmlFor="name">{label}</FieldLabel>
              {type === "input" && (
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder={placeholder}
                  autoComplete="off"
                />
              )}
              {type === "textarea" && (
                <Textarea
                  className="address-content__form__textarea"
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder={placeholder}
                  autoComplete="off"
                />
              )}
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      />
    );
  };

  // get array field
  const getTagField = () => {
    return (
      <form.Field
        name="tags"
        children={(field) => {
          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field className="address-content__form__field">
              <FieldLabel htmlFor="tags">{t("form.basicInfo.tags.label")}</FieldLabel>
              <InputAndButton
                id="tags"
                data-testid="address-form-tag__input"
                placeholder={t("form.basicInfo.tags.placeholder")}
                buttonSize="icon"
                onButtonClick={handleAddTag}
              />
              {field.state.value.length > 0 && (
                <div className="address-content__form__tags">
                  {field.state.value.map((tag) => (
                    <TagBadge
                      key={tag}
                      value={tag}
                      onRemoveTag={() => handleRemoveTag(tag)}
                    />
                  ))}
                </div>
              )}
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      />
    );
  };

  // update form language when language updated
  useEffect(() => {
    form.setFieldValue("language", language);
    cleanupFn();
  }, [language, form, cleanupFn]);

  return (
    <form
      className="address-content__form"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup className="address-content__form__group">
        <FieldSet>
          <FieldLegend>
            <span>{t("form.basicInfo.legend")}</span>
            <CreateFromJsonDialog handleJsonImport={handleJsonImport} />
          </FieldLegend>
          <FieldDescription>{t("form.basicInfo.description")}</FieldDescription>
          <FieldGroup className="address-content__form__group">
            {getFormTextField({
              fieldName: "name",
              label: t("form.basicInfo.name.label"),
              placeholder: t("form.basicInfo.name.placeholder"),
            })}
            {getTagField()}
            {getFormTextField({
              fieldName: "briefIntro",
              label: t("form.basicInfo.briefIntro.label"),
              placeholder: t("form.basicInfo.briefIntro.placeholder"),
              type: "textarea",
            })}
          </FieldGroup>
        </FieldSet>
        <FieldSeparator className="address-content__form__separator" />
        <FieldSet>
          <FieldLegend>{t("form.address.legend")}</FieldLegend>
          <FieldDescription>{t("form.address.description")}</FieldDescription>
          {getFormTextField({
            fieldName: "address.buildingName",
            label: t("form.address.buildingName.label"),
            placeholder: t("form.address.buildingName.placeholder"),
          })}
          {getFormTextField({
            fieldName: "address.line1",
            label: t("form.address.line1.label"),
            placeholder: t("form.address.line1.placeholder"),
          })}
          {getFormTextField({
            fieldName: "address.line2",
            label: t("form.address.line2.label"),
            placeholder: t("form.address.line2.placeholder"),
          })}
          <div className="grid grid-cols-2 gap-4">
            {getFormTextField({
              fieldName: "address.city",
              label: t("form.address.city.label"),
              placeholder: t("form.address.city.placeholder"),
            })}
            {getFormTextField({
              fieldName: "address.region",
              label: t("form.address.region.label"),
              placeholder: t("form.address.region.placeholder"),
            })}
            {getFormTextField({
              fieldName: "address.postalCode",
              label: t("form.address.postalCode.label"),
              placeholder: t("form.address.postalCode.placeholder"),
            })}
            {getFormTextField({
              fieldName: "address.country",
              label: t("form.address.country.label"),
              placeholder: t("form.address.country.placeholder"),
            })}
          </div>
        </FieldSet>
        <FieldSeparator className="address-content__form__separator" />
        <Field orientation="horizontal">
          <Button
            type="submit"
            className="address-content__form__submit"
            disabled={submitPending}
          >
            {submitPending && <Spinner />}
            {submitPending ? t("form.loading") : t("form.submit")}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
