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
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";

import { SERVICE_CATALOG } from "@/consts/service-catalog";
import "./AppSidebar.css";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarGroup>
        <SidebarGroupLabel>Application</SidebarGroupLabel>
        <SidebarMenu>
          {SERVICE_CATALOG.map((service) => {
            return (
              <Collapsible
                key={service.title}
                title={service.title}
                defaultOpen
                className="group/collapsible"
              >
                <SidebarGroup>
                  <SidebarGroupLabel asChild className="group/label sidebar-group__label">
                    <CollapsibleTrigger>
                      <SidebarMenuButton className="sidebar-menu__button">
                        {service.icon && <service.icon />}
                        <span>{service.title}</span>
                        <ChevronRight className="sidebar-collapsible__chevron" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                  </SidebarGroupLabel>
                  <CollapsibleContent>
                    <SidebarGroupContent>
                      <SidebarMenuSub>
                        {service.contents.map((content) => (
                          <SidebarMenuItem key={service.title + content.name}>
                            <SidebarMenuButton
                              asChild
                              onClick={() => console.log(content.name)}
                            >
                              <a className="hover:cursor-pointer">{content.name}</a>
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
