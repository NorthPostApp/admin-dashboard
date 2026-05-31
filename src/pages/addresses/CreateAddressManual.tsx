import type z from "zod";
import { useCallback, useEffect } from "react";
import clsx from "clsx";
import { useForm, revalidateLogic } from "@tanstack/react-form";
import { useTranslation } from "react-i18next";
import {
  Address,
  createAddressItemSchema,
  getDefaultForm,
  type AddressItemSchema,
} from "@/schemas/address";
import { useAppContext } from "@/hooks/useAppContext";
import { useCreateNewAddressMutation } from "@/hooks/mutations/useCreateNewAddressMutation";
import AddressFromJsonDialog from "@/components/address/create-addresses/AddressFromJsonDialog";
import InputAndButton from "@/components/address/shared/InputAndButton";
import TagBadge from "@/components/address/shared/TagBadge";
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
  | Exclude<keyof AddressItemSchema, "address">
  | `address.${keyof z.infer<typeof Address>}`;

const styles = {
  create: clsx("flex-1 flex justify-center overflow-y-auto px-10"),
  contentBody: clsx("flex flex-col justify-between w-full max-w-240 text-left pt-6"),
  formGroup: clsx("gap-4"),
  formField: clsx("gap-2"),
  formTextarea: clsx("resize-none h-30"),
  formTags: clsx("w-full flex flex-wrap gap-1"),
  dialogTrigger: clsx(
    "mx-2 text-xs h-full opacity-50 underline hover:opacity-90 focus:ring-0",
  ),
  formSeparator: clsx("my-0.5"),
  addressGrid: clsx("grid grid-cols-2 gap-4"),
  submit: clsx("mx-auto w-full mb-6"),
};

export default function CreateAddressesManual() {
  const { language } = useAppContext();
  const { t } = useTranslation("address:newAddress");

  const form = useForm({
    defaultValues: {
      ...getDefaultForm(),
    } satisfies AddressItemSchema,
    validationLogic: revalidateLogic({ mode: "blur" }), // validate when focus out the field
    validators: {
      onDynamic: createAddressItemSchema(t),
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

  const handleJsonSave = (formData: AddressItemSchema) => {
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
            <Field className={styles.formField}>
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
                  className={styles.formTextarea}
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
            <Field className={styles.formField}>
              <FieldLabel htmlFor="tags">{t("form.basicInfo.tags.label")}</FieldLabel>
              <InputAndButton
                id="tags"
                data-testid="address-form-tag__input"
                placeholder={t("form.basicInfo.tags.placeholder")}
                buttonSize="icon"
                onButtonClick={handleAddTag}
              />
              {field.state.value.length > 0 && (
                <div className={styles.formTags}>
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
    cleanupFn();
  }, [language, form, cleanupFn]);

  return (
    <div className={styles.create}>
      <form
        className={styles.contentBody}
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <FieldGroup className={styles.formGroup}>
          <FieldSet>
            <FieldLegend>
              <span>{t("form.basicInfo.legend")}</span>
              <AddressFromJsonDialog
                handleJsonSave={handleJsonSave}
                title={t("json.title")}
                description={t("json.description")}
              >
                <Button variant="link" size="sm" className={styles.dialogTrigger}>
                  {t("json.trigger")}
                </Button>
              </AddressFromJsonDialog>
            </FieldLegend>
            <FieldDescription>{t("form.basicInfo.description")}</FieldDescription>
            <FieldGroup className={styles.formGroup}>
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
          <FieldSeparator className={styles.formSeparator} />
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
            <div className={styles.addressGrid}>
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
          <FieldSeparator className={styles.formSeparator} />
          <Field orientation="horizontal">
            <Button type="submit" className={styles.submit} disabled={submitPending}>
              {submitPending && <Spinner />}
              {submitPending ? t("form.loading") : t("form.submit")}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
