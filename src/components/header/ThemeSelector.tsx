import { THEMES, type Theme } from "@/consts/app-config";
import { Select, SelectItem, SelectTrigger, SelectContent } from "@/components/ui/select";
import { useAppContext } from "@/hooks/useAppContext";
import { Sun, Moon, Monitor } from "lucide-react";

const getIcon = (theme: Theme) => {
  switch (theme) {
    case "light":
      return <Sun />;
    case "dark":
      return <Moon />;
    default:
      return <Monitor />;
  }
};

export default function ThemeSelector() {
  const { theme, updateTheme } = useAppContext();
  return (
    <section className="header-selector">
      <Select defaultValue={theme} onValueChange={(value) => updateTheme(value as Theme)}>
        <SelectTrigger className="header-selector__trigger">
          {getIcon(theme)}
        </SelectTrigger>
        <SelectContent>
          {THEMES.map((theme) => {
            return (
              <SelectItem key={`theme-selector-${theme}`} value={theme}>
                {getIcon(theme)}
                {theme}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </section>
  );
}
