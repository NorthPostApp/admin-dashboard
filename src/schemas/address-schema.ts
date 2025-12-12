import { SUPPORTED_LANGUAGES } from "@/consts/app-config";
import * as z from "zod";

// const AddressItem = z.object({});

const Address = z.object({
  city: z.string(),
  country: z.string(),
  line1: z.string(),
  line2: z.string().optional(),
  buildingName: z.string().optional(),
  postalCode: z.string(),
  region: z.string(),
});

const NewAddressRequest = z.object({
  language: z.enum(SUPPORTED_LANGUAGES),
  name: z.string(),
  tags: z.array(z.string()),
  briefIntroduction: z.string(),
  address: Address,
});

export { NewAddressRequest };
