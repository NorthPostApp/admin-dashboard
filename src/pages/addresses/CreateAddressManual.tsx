import type z from "zod";
import { useEffect } from "react";
import { useForm, revalidateLogic } from "@tanstack/react-form";
import { useAppContext } from "@/hooks/useAppContext";
import { Address, NewAddressRequest } from "@/schemas/address-schema";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import InputAndButton from "@/components/address/InputAndButton";
import TagBadge from "@/components/address/TagBadge";
import { createNewAddress } from "@/api/address";

type FormFields =
  | Exclude<keyof z.infer<typeof NewAddressRequest>, "address">
  | `address.${keyof z.infer<typeof Address>}`;

export default function CreateAddressesManual() {
  const { language } = useAppContext();
  const form = useForm({
    defaultValues: {
      language: language,
      name: "",
      tags: [] as string[],
      briefIntro: "",
      address: {
        buildingName: "",
        line1: "",
        line2: "",
        city: "",
        region: "",
        postalCode: "",
        country: "",
      },
    } satisfies z.infer<typeof NewAddressRequest>,
    validationLogic: revalidateLogic({ mode: "blur" }),
    validators: {
      onDynamic: NewAddressRequest,
    },
    onSubmit: async ({ value }) => {
      createNewAddress(value);
    },
  });

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
            <Field className="gap-2">
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
                  className="resize-none h-30"
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
            <Field>
              <FieldLabel htmlFor="tags">Tags</FieldLabel>
              <InputAndButton
                id="tags"
                placeholder="Tags, multiple tags can separate by ;"
                onButtonClick={handleAddTag}
              />
              {field.state.value.length > 0 && (
                <div className="w-full flex flex-wrap gap-1">
                  {field.state.value.map((tag) => {
                    return (
                      <TagBadge
                        key={tag}
                        value={tag}
                        onRemoveTag={() => handleRemoveTag(tag)}
                      />
                    );
                  })}
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
  }, [language, form]);

  return (
    <form
      className="flex flex-col justify-between w-full max-w-140 text-left"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup className="gap-5">
        <FieldSet>
          <FieldLegend>Basic Info</FieldLegend>
          <FieldDescription>
            Provide the basic infomation of the person. These fields are important for
            indexing and searching in the database.
          </FieldDescription>
          <FieldGroup className="gap-4">
            {getFormTextField({
              fieldName: "name",
              label: "Name",
              placeholder: "e.g. Anton Chekhov",
            })}
            {getTagField()}
            {getFormTextField({
              fieldName: "briefIntro",
              label: "Brief Introduction",
              placeholder: "A Russian playwright and short-story writer.",
              type: "textarea",
            })}
          </FieldGroup>
        </FieldSet>
        <FieldSeparator />
        <FieldSet>
          <FieldLegend>Address</FieldLegend>
          <FieldDescription>
            Provide the person's address. It doesn't necessary to be an very accurate
            address but should at least reflect the era and the region the person
            living/lived in.
          </FieldDescription>
          {getFormTextField({
            fieldName: "address.buildingName",
            label: "Building Name (Optional)",
            placeholder: "e.g. White Dacha",
          })}
          {getFormTextField({
            fieldName: "address.line1",
            label: "Line 1",
            placeholder: "e.g. 112 Darsan Hill Road",
          })}
          {getFormTextField({
            fieldName: "address.line2",
            label: "Line 2",
            placeholder: "e.g. (Near Autka Settlement)",
          })}
          <div className="grid grid-cols-2 gap-4">
            {getFormTextField({
              fieldName: "address.city",
              label: "City",
              placeholder: "e.g. Yalta",
            })}
            {getFormTextField({
              fieldName: "address.region",
              label: "Region",
              placeholder: "e.g. Taurida Governorate",
            })}
            {getFormTextField({
              fieldName: "address.postalCode",
              label: "Postal Code",
              placeholder: "e.g. 347900",
            })}
            {getFormTextField({
              fieldName: "address.country",
              label: "Country",
              placeholder: "e.g. Russian Empire",
            })}
          </div>
        </FieldSet>
      </FieldGroup>
      <FieldGroup>
        <Field orientation="horizontal">
          <Button type="submit">Submit</Button>
          <Button variant="outline" type="button">
            Cancel
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
