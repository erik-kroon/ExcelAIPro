import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navbar } from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { api } from "@/lib/hono";
import type { sessionStore } from "@/lib/store";
import { qc } from "@/main";
import { Footer } from "@/components/footer";
import { auth } from "@/lib/auth";

export const Route = createRootRouteWithContext<{
  api: typeof api;
  qc: QueryClient;
  sessionStore: typeof sessionStore;
}>()({
  component: RootComponent,
  // loader: async () => {
  //   const { data } = await auth.getSession();

  //   return { session: data?.session, user: data?.user };
  // },
});

function RootComponent() {
  return (
    <QueryClientProvider client={qc}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Navbar />
        <Outlet />
        {/* {path === "/" ? <Hero /> : <Outlet />} */}

        <Footer />
        {/* <TanStackRouterDevtools position="bottom-right" /> */}
      </ThemeProvider>
    </QueryClientProvider>
  );
}
