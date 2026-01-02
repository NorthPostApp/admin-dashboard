import { useState, useEffect, useCallback, createContext } from "react";
import { useTranslation } from "react-i18next";
import {
  DEFAULT_LANGUAGE,
  DEFAULT_THEME,
  getLocalAppConfig,
  updateLocalAppConfig,
  type Language,
  type Theme,
} from "@/consts/app-config";
import AddressContextProvider from "@/contexts/AddressContextProvider";

interface AppContextType {
  theme: Theme;
  language: Language;
  updateLanguage: (newLanguage: Language) => void;
  updateTheme: (newTheme: Theme) => void;
}

type ServiceInfo = {
  language: Language;
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

// Create App context
const AppContext = createContext<AppContextType | undefined>(undefined);

export default function AppContextProvider({ children }: { children: React.ReactNode }) {
  const { i18n, t } = useTranslation("webpage");
  // wrap region and address information into a single state to avoid
  // unnecessary re-renderings
  const [serviceInfo, setServiceInfo] = useState<ServiceInfo>({
    language: languageConfig,
  });
  const [theme, setTheme] = useState<Theme>(themeConfig);

  // context update methods
  const updateLanguage = useCallback(
    (newLanguage: Language) => {
      setServiceInfo(() => ({
        language: newLanguage,
      }));
      localAppConfig["language"] = newLanguage;
      i18n.changeLanguage(newLanguage.toLowerCase());
      updateLocalAppConfig(localAppConfig);
    },
    [i18n]
  );

  const updateTheme = useCallback((newTheme: Theme) => {
    setTheme(newTheme);
    localAppConfig["theme"] = newTheme;
    updateLocalAppConfig(localAppConfig);
  }, []);

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
      <AddressContextProvider>{children}</AddressContextProvider>
    </AppContext.Provider>
  );
}

export { AppContext };
