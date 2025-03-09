import * as React from "react";
import {
  Link,
  Outlet,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { api } from "@/lib/hono";
import type { sessionStore } from "@/lib/store";
import { qc } from "@/main";
import { Footer } from "@/components/footer";

export const Route = createRootRouteWithContext<{
  api: typeof api;
  qc: QueryClient;
  sessionStore: typeof sessionStore;
}>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <QueryClientProvider client={qc}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <Navbar />
        <Outlet />
        <Footer />

        <TanStackRouterDevtools position="bottom-right" />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
