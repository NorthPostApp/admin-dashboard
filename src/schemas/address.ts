import {
  GPT_MODELS,
  REASONING_EFFORTS,
  SUPPORTED_LANGUAGES,
  type Language,
} from "@/consts/app-config";
import type { TFunction } from "i18next";
import * as z from "zod";

// Address schemas
const Address = z.object({
  city: z.string().min(1),
  country: z.string().min(1),
  line1: z.string().min(1),
  line2: z.string().catch(""),
  buildingName: z.string().catch(""),
  postalCode: z.string().catch(""),
  region: z.string().min(1),
});

const AddressItem = z.object({
  name: z.string().min(1),
  tags: z.array(z.string()).min(1),
  briefIntro: z.string().refine((value) => value.trim().length > 5),
  address: Address,
});

const NewAddressRequest = AddressItem.extend({
  language: z.enum(SUPPORTED_LANGUAGES),
});

const GenerateAddressesRequest = z.object({
  language: z.enum(SUPPORTED_LANGUAGES),
  systemPrompt: z.string().min(10),
  prompt: z.string().min(10),
  model: z.enum(GPT_MODELS),
  reasoningEffort: z.enum(REASONING_EFFORTS),
});

const GeneratedAddress = AddressItem.extend({
  id: z.string().min(3),
});

const GenerateAddressesResponse = z.array(GeneratedAddress);

type AddressItemSchema = z.infer<typeof AddressItem>;
type NewAddressRequestSchema = z.infer<typeof NewAddressRequest>;
type GenerateAddressesRequestSchema = z.infer<typeof GenerateAddressesRequest>;
type GenerateAddressesResponseSchema = z.infer<typeof GenerateAddressesResponse>;
type GeneratedAddressSchema = z.infer<typeof GeneratedAddress>;

// Extend error messages based on the i18n language
const extendAddressSchema = (t: TFunction) =>
  Address.safeExtend({
    city: z.string().min(1, { error: t("errors.cityField") }),
    country: z.string().min(1, { error: t("errors.countryField") }),
    line1: z.string().min(1, { error: t("errors.line1Field") }),
    region: z.string().min(1, { error: t("errors.regionField") }),
  });

const createNewAddressRequestSchema = (t: TFunction) =>
  NewAddressRequest.safeExtend({
    name: z.string().min(1, { error: t("errors.nameField") }),
    tags: z.array(z.string()).min(1, { error: t("errors.tagsField") }),
    briefIntro: z.string().refine((value) => value.trim().length > 5, {
      error: t("errors.briefIntroField"),
    }),
    address: extendAddressSchema(t),
  });

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

export {
  NewAddressRequest,
  GenerateAddressesRequest,
  GenerateAddressesResponse,
  Address,
  createNewAddressRequestSchema,
  getDefaultForm,
  type AddressItemSchema,
  type NewAddressRequestSchema,
  type GenerateAddressesRequestSchema,
  type GenerateAddressesResponseSchema,
  type GeneratedAddressSchema,
};
