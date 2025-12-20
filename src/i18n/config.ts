import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { DEFAULT_LANGUAGE, getLocalAppConfig } from "@/consts/app-config";

// Import namespaced translations
import enSidebar from "./locales/en/sidebar.json";
import enNewAddress from "./locales/en/address/new-address.json";

import zhSidebar from "./locales/zh/sidebar.json";
import zhNewAddress from "./locales/zh/address/new-address.json";

const localAppConfig = getLocalAppConfig();
const initialLanguage = localAppConfig.language ?? DEFAULT_LANGUAGE;

i18n.use(initReactI18next).init({
  lng: initialLanguage.toLowerCase(),
  resources: {
    en: {
      sidebar: enSidebar,
      "address:newAddress": enNewAddress,
    },
    zh: {
      sidebar: zhSidebar,
      "address:newAddress": zhNewAddress,
    },
  },
  fallbackLng: "en",
  ns: ["sidebar", "address:newAddress"],
  debug: import.meta.env.Mode === "development",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
