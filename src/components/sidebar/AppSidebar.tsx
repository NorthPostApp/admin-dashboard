import { ChevronRight } from "lucide-react";
import {
  Sidebar,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenuSub,
  SidebarProvider,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";

import { SERVICE_CATALOG } from "@/consts/service-catalog";
import { NavLink } from "react-router";
import "./AppSidebar.css";
import { useTranslation } from "react-i18next";

export default function AppSidebar() {
  const { t } = useTranslation("sidebar");
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarGroup>
        <SidebarGroupLabel>{t("application")}</SidebarGroupLabel>
        <SidebarMenu>
          {SERVICE_CATALOG.map((service) => {
            return (
              <Collapsible
                key={service.titleKey}
                title={service.titleKey}
                defaultOpen
                className="group/collapsible"
              >
                <SidebarGroup>
                  <SidebarGroupLabel asChild className="group/label sidebar-group__label">
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className="sidebar-menu__button">
                        {service.icon && <service.icon />}
                        <span data-testid={`sidebar-${service.titleKey}`}>
                          {t(`${service.titleKey}.title`)}
                        </span>
                        <ChevronRight className="sidebar-collapsible__chevron" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                  </SidebarGroupLabel>
                  <CollapsibleContent>
                    <SidebarGroupContent>
                      <SidebarMenuSub>
                        {service.contents.map((content) => (
                          <SidebarMenuItem key={service.titleKey + content.i18nKey}>
                            <SidebarMenuButton asChild>
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
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ))}
                      </SidebarMenuSub>
                    </SidebarGroupContent>
                  </CollapsibleContent>
                </SidebarGroup>
              </Collapsible>
            );
          })}
        </SidebarMenu>
      </SidebarGroup>
      <SidebarFooter />
    </Sidebar>
  );
}

export { SidebarProvider };
