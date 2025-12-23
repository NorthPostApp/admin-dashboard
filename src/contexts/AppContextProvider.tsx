import { useState, useEffect, createContext } from "react";
import { useTranslation } from "react-i18next";
import {
  getCountryAddressFormat,
  DEFAULT_LANGUAGE,
  DEFAULT_THEME,
  getLocalAppConfig,
  updateLocalAppConfig,
  type AddressFormat,
  type Language,
  type Theme,
} from "@/consts/app-config";

interface AppContextType {
  theme: Theme;
  language: Language;
  addressFormat: AddressFormat;
  updateLanguage: (newLanguage: Language) => void;
  updateTheme: (newTheme: Theme) => void;
}

type ServiceInfo = {
  language: Language;
  addressFormat: AddressFormat;
};

// Check local AppConfig, if localStorage or field miss, fill default value
const localAppConfig = getLocalAppConfig();
if (!localAppConfig["language"]) {
  localAppConfig["language"] = DEFAULT_LANGUAGE;
  updateLocalAppConfig(localAppConfig);
}
if (!localAppConfig["theme"]) {
  localAppConfig["theme"] = DEFAULT_THEME;
}

const languageConfig = localAppConfig["language"] as Language;
const themeConfig = localAppConfig["theme"] as Theme;
const addressFormat = getCountryAddressFormat(languageConfig);

// Create App context
const AppContext = createContext<AppContextType>({
  theme: themeConfig,
  language: languageConfig,
  addressFormat: addressFormat,
  updateLanguage: () => {},
  updateTheme: () => {},
});

export default function AppContextProvider({ children }: { children: React.ReactNode }) {
  const { i18n, t } = useTranslation("webpage");
  // wrap region and address information into a single state to avoid
  // unnecessary re-renderings
  const [serviceInfo, setServiceInfo] = useState<ServiceInfo>({
    language: languageConfig,
    addressFormat: addressFormat,
  });
  const [theme, setTheme] = useState<Theme>(themeConfig);

  // context update methods
  const updateLanguage = (newLanguage: Language) => {
    setServiceInfo(() => ({
      language: newLanguage,
      addressFormat: getCountryAddressFormat(newLanguage),
    }));
    localAppConfig["language"] = newLanguage;
    i18n.changeLanguage(newLanguage.toLowerCase());
    updateLocalAppConfig(localAppConfig);
  };

  const updateTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localAppConfig["theme"] = newTheme;
    updateLocalAppConfig(localAppConfig);
  };

  // use an useEffect hook to control theme
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
      return;
    }
    root.classList.add(theme);
  }, [theme]);

  // use an useEffect hook to control html lang setting, to apply different font style
  useEffect(() => {
    document.documentElement.lang = serviceInfo.language.toLowerCase(); // test
    document.title = t("title");
  }, [serviceInfo.language, t]);

  return (
    <AppContext.Provider
      value={{
        ...serviceInfo,
        theme,
        updateLanguage,
        updateTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export { AppContext };
