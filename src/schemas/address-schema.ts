import { SUPPORTED_LANGUAGES, type Language } from "@/consts/app-config";
import * as z from "zod";

const Address = z.object({
  city: z.string().min(1, { error: "City field should't be empty." }),
  country: z.string().min(1, { error: "Country field should't be empty." }),
  line1: z.string().min(1, { error: "Line1 field should't be empty." }),
  line2: z.string().catch(""),
  buildingName: z.string().catch(""),
  postalCode: z.string().catch(""),
  region: z.string().min(1, { error: "Region field should't be empty." }),
});

const NewAddressRequest = z.object({
  language: z.enum(SUPPORTED_LANGUAGES),
  name: z.string().min(1, { error: "Name field shouldn't be empty." }),
  tags: z.array(z.string()).min(1, { error: "Please provide at least one tag." }),
  briefIntro: z.string().refine((value) => value.trim().length > 5, {
    error: "The brief introduction should have at least 5 words",
  }),
  address: Address,
});

type ZodNewAddressRequest = z.infer<typeof NewAddressRequest>;

// Create an empty form with the current language setting
const getDefaultForm = (language: Language) => {
  return {
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
  };
};

export { NewAddressRequest, Address, getDefaultForm, type ZodNewAddressRequest };
