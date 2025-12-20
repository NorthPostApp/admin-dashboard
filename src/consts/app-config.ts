// We currently only support these two regions. Will expand in the future
export const SUPPORTED_LANGUAGES = ["EN", "ZH"] as const;
export const THEMES = ["dark", "light", "system"] as const;
export const LOCALSTORAGE_KEY = "northpost";
export const DEFAULT_LANGUAGE = "EN";
export const DEFAULT_THEME = "system";

export type Language = (typeof SUPPORTED_LANGUAGES)[number];
export type AddressFormat = "building-first" | "country-first";
export type CountryAddressFormat = Record<Language, AddressFormat>;
export type Theme = (typeof THEMES)[number];
export interface AppConfigLocalstorageType {
  language?: Language;
  theme?: Theme;
}

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
