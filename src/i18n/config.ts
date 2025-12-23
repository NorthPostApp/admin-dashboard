import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { DEFAULT_LANGUAGE, getLocalAppConfig } from "@/consts/app-config";

const localAppConfig = getLocalAppConfig();
const initialLanguage = localAppConfig.language ?? DEFAULT_LANGUAGE;

i18n
  .use(initReactI18next)
  .use(
    resourcesToBackend((language: string, namespace: string) => {
      switch (namespace) {
        case "webpage":
          return import(`./locales/${language.toLowerCase()}/webpage.json`);
        case "sidebar":
          return import(`./locales/${language.toLowerCase()}/sidebar.json`);
        case "address:newAddress":
          return import(`./locales/${language.toLowerCase()}/address/new-address.json`);
      }
    })
  )
  .init({
    lng: initialLanguage.toLowerCase(),
    fallbackLng: "en",
    ns: ["webpage", "sidebar", "address:newAddress"],
    debug: import.meta.env.Mode === "development",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
