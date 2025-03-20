"use client";

import {
  Calculator,
  Code,
  CreditCard,
  Database,
  FileSpreadsheet,
  Hash,
  MessageSquare,
} from "lucide-react";
import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Route } from "~/routes/__root";
import { NavHeader } from "./nav-header";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";

// This is sample data.
const menuItems = [
  {
    title: "Chat",
    url: "/chat",
    icon: MessageSquare,
  },
  {
    title: "Formulas",
    url: "/formulas",
    icon: Calculator,
  },
  {
    title: "Scripts",
    url: "/scripts",
    icon: Code,
  },
  {
    title: "SQL",
    url: "/sql",
    icon: Database,
  },
  {
    title: "Regex",
    url: "/regex",
    icon: Hash,
  },
  {
    title: "Billing",
    url: "/billing",
    icon: CreditCard,
  },
];
export const data = {
  name: "Team 1",
  logo: FileSpreadsheet,
  plan: "Free",
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = Route.useRouteContext();
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavHeader />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={menuItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
