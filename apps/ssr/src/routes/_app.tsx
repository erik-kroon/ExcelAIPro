import { Outlet, createFileRoute } from "@tanstack/react-router";
import { memo } from "react";
import { DynamicBreadcrumbs } from "~/lib/components/dynamic-breadcrumbs";
import { AppSidebar } from "~/lib/components/sidebar/nav-sidebar";
import { SidebarInset, SidebarProvider } from "~/lib/components/ui/sidebar";

const AppLayout = memo(function AppLayout() {
  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <DynamicBreadcrumbs />
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
});

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});
