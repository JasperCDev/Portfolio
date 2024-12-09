"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ChartArea, CircleDollarSign, MapPinHouse } from "lucide-react";

const items = [
  {
    title: "Overview",
    url: "/dashboard/overview",
    icon: ChartArea,
  },
  {
    title: "Real Estate",
    url: "/dashboard/real-estate",
    icon: MapPinHouse,
  },
  {
    title: "Stocks",
    url: "/dashboard/stocks",
    icon: CircleDollarSign,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a
                      href={item.url}
                      className={
                        item.url.split("/").at(-1) ===
                        window.location.href.split("/").at(-1)
                          ? "bg-accent text-accent-foreground"
                          : ""
                      }
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
