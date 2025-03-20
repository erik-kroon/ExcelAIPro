"use client";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { FileSpreadsheet } from "lucide-react";
export function NavHeader() {
  // const { isMobile } = useSidebar();
  const { toggleSidebar } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-sidebar-accent cursor-pointer"
          onClick={toggleSidebar}
        >
          <div className="flex justify-center items-center gap-2">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg  text-sidebar-primary-foreground hover:bg-sidebar-accent/50 hover:rounded-lg hover:p-1">
              <FileSpreadsheet className="size-6 text-green-500/90" />
            </div>
            <div className="grid flex-1 text-sidebar-accent-foreground text-left text-lg leading-tight">
              <span className="truncate font-semibold">
                ExcelAI<span className=" ml-0.5 text-green-500/90">Pro</span>
              </span>
            </div>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
