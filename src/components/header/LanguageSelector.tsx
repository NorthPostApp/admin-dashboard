import { SUPPORTED_LANGUAGES, type Language } from "@/consts/app-config";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useAppContext } from "@/hooks/useAppContext";

export default function LanguageSelector() {
  const { language, updateLanguage } = useAppContext();
  return (
    <section className="header-selector">
      <Label>Service Language</Label>
      <Select
        defaultValue={language}
        onValueChange={(value) => updateLanguage(value as Language)}
      >
        <SelectTrigger className="header-selector__trigger">
          <SelectValue>{language}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {SUPPORTED_LANGUAGES.map((language) => {
            return (
              <SelectItem key={`language-selector-${language}`} value={language}>
                {language}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </section>
  );
}
