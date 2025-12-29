// We currently only support these two regions. Will expand in the future
export const SUPPORTED_LANGUAGES = ["EN", "ZH"] as const;
export const THEMES = ["dark", "light", "system"] as const;
export const LOCALSTORAGE_KEY = "northpost";
export const GPT_MODELS = [
  "gpt-5-mini",
  "gpt-5-nano",
  "gpt-4.1-mini",
  "gpt-4.1-nano",
] as const;
// reference: https://platform.openai.com/docs/guides/latest-model#gpt-5-2-parameter-compatibility
// https://github.com/openai/openai-go/blob/1094636e1d496ed46d2f9e3b8cb5ee8614e443e9/shared/shared.go#L914
export const REASONING_EFFORTS = ["none", "low", "medium", "high", "xhigh"] as const;

export type Language = (typeof SUPPORTED_LANGUAGES)[number];
export type GPTModel = (typeof GPT_MODELS)[number];
export type AddressFormat = "building-first" | "country-first";
export type CountryAddressFormat = Record<Language, AddressFormat>;
export type Theme = (typeof THEMES)[number];
export type ReasonEffort = (typeof REASONING_EFFORTS)[number];
export interface AppConfigLocalstorageType {
  language?: Language;
  theme?: Theme;
}

export const DEFAULT_MODEL: GPTModel = "gpt-5-mini";
export const DEFAULT_LANGUAGE: Language = "EN";
export const DEFAULT_THEME: Theme = "system";
export const DEFAULT_EFFORT: ReasonEffort = "low";

export function getLocalAppConfig(): AppConfigLocalstorageType {
  return JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY) || "{}");
}
export function updateLocalAppConfig(newAppConfig: AppConfigLocalstorageType) {
  localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(newAppConfig));
}

export function getCountryAddressFormat(language: Language): AddressFormat {
  switch (language) {
    case "ZH":
      return "country-first";
    case "EN":
      return "building-first";
    default:
      return "building-first";
  }
}
