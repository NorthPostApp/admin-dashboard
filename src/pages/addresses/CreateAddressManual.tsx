import { X } from "lucide-react";
import {
  Field,
  // FieldContent,
  FieldDescription,
  // FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  // FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export default function CreateAddressesManual() {
  // we need a form section and a display section
  // display section basically displays rendered card
  return (
    <form className="flex flex-col justify-between w-full max-w-140 text-left">
      <FieldGroup className="flex-1">
        <FieldSet>
          <FieldLegend>Basic Info</FieldLegend>
          <FieldDescription>
            Provide the basic infomation of the person. These fields are important for
            indexing and searching in the database.
          </FieldDescription>
          <FieldGroup className="gap-4">
            <Field>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input id="name" placeholder="e.g. Anton Chekhov" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="tags">Tags</FieldLabel>
              <Input id="tags" placeholder="e.g. Anton Chekhov" required />
              <div className="w-full flex flex-wrap gap-1">
                <Badge asChild>
                  <div className="flex gap-2 items-center h-6">
                    <p>Badge</p>
                    <div className="hover:cursor-pointer">
                      <X width={14} />
                    </div>
                  </div>
                </Badge>
              </div>
            </Field>
            <Field>
              <FieldLabel htmlFor="briefIntro">Brief Introduction</FieldLabel>
              <Textarea
                id="briefIntro"
                className="resize-none"
                placeholder="A Russian playwright and short-story writer."
                rows={4}
              />
            </Field>
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
          <FieldGroup className="gap-4">
            <Field>
              <FieldLabel htmlFor="buildingName">Building Name (Optional)</FieldLabel>
              <Input id="buildingName" placeholder="e.g. White Dacha" />
            </Field>
            <Field>
              <FieldLabel htmlFor="line1">Line 1</FieldLabel>
              <Input id="line1" placeholder="e.g. 112 Darsan Hill Road" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="line2">Line 2 (Optional)</FieldLabel>
              <Input id="line2" placeholder="e.g. (Near Autka Settlement)" />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="city">City</FieldLabel>
                <Input id="city" placeholder="e.g. Yalta" required />
              </Field>
              <Field>
                <FieldLabel htmlFor="region">Region</FieldLabel>
                <Input id="region" placeholder="e.g. Taurida Governorate" required />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="postalCode">Postal Code (Optional)</FieldLabel>
                <Input id="postalCode" placeholder="e.g. 347900" />
              </Field>
              <Field>
                <FieldLabel htmlFor="country">Country</FieldLabel>
                <Input id="country" placeholder="e.g. Russian Empire" required />
              </Field>
            </div>
          </FieldGroup>
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
