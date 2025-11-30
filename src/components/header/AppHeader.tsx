import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import LanguageSelector from "@/components/header/LanguageSelector";
import ThemeSelector from "./ThemeSelector";
import "./AppHeader.css";

export default function AppHeader() {
  return (
    <header className="header">
      <SidebarTrigger />
      <section className="header-configs">
        <LanguageSelector />
        <Separator orientation="vertical" />
        <ThemeSelector />
      </section>
    </header>
  );
}
