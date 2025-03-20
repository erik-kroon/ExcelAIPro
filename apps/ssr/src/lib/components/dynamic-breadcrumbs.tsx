import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { useRouterState } from "@tanstack/react-router";
import React from "react";
import { SidebarTrigger } from "./ui/sidebar";

export const DynamicBreadcrumbs = () => {
  const pathname = useRouterState().location.pathname;
  const pathSegments = pathname.split("/").filter((segment) => segment); // Remove empty strings from split

  return (
    <header className="flex p-3 z-20  border-b border-b-muted w-fullshrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:p-3">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            {pathSegments.map((segment, index) => {
              const isLast = index === pathSegments.length - 1;
              const path = `/${pathSegments.slice(0, index + 1).join("/")}`;
              const formattedSegment = segment.charAt(0).toUpperCase() + segment.slice(1); // Capitalize first letter

              return (
                <React.Fragment key={path}>
                  <BreadcrumbItem className={isLast ? "" : "hidden md:block"}>
                    {isLast ? (
                      <BreadcrumbPage>{formattedSegment}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={path}>{formattedSegment}</BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!isLast && <BreadcrumbSeparator className="hidden md:block" />}
                </React.Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
};
