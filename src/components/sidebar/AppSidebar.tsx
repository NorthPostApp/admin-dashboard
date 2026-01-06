import { NavLink } from "react-router";
import { useTranslation } from "react-i18next";
import { SERVICE_CATALOG } from "@/consts/service-catalog";
import { ChevronRight } from "lucide-react";
import {
  Sidebar,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuSub,
  SidebarProvider,
  SidebarContent,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import "./AppSidebar.css";
import { Button } from "../ui/button";
import { useAuthContext } from "@/hooks/useAuthContext";

export default function AppSidebar() {
  const { t } = useTranslation("sidebar");
  const { signOut } = useAuthContext();
  return (
    <Sidebar className="sidebar" collapsible="icon">
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="sidebar-group__label">
            {t("application")}
          </SidebarGroupLabel>
          <SidebarMenu>
            {SERVICE_CATALOG.map((service) => {
              return (
                <Collapsible
                  key={service.titleKey}
                  title={service.titleKey}
                  defaultOpen
                  className="group/collapsible"
                >
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="sidebar-menu__button">
                      {service.icon && <service.icon />}
                      <span
                        data-testid={`sidebar-${service.titleKey}`}
                        className="sidebar-menu__button__text"
                      >
                        {t(`${service.titleKey}.title`)}
                      </span>
                      <ChevronRight className="sidebar-collapsible__chevron" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {service.contents.map((content) => (
                        <SidebarMenuSubItem key={service.titleKey + content.i18nKey}>
                          <SidebarMenuSubButton asChild>
                            <NavLink to={content.path}>
                              {({ isActive }) => {
                                return (
                                  <span
                                    data-testid={`sidebar-${service.titleKey}-${content.i18nKey}`}
                                    className={
                                      isActive ? "sidebar-menu__button__active" : ""
                                    }
                                  >
                                    {t(`${service.titleKey}.${content.i18nKey}`)}
                                  </span>
                                );
                              }}
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Button variant="secondary" onClick={signOut}>
          Sign out
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}

export { SidebarProvider };
