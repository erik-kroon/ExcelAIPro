import type { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import { Link, useNavigate } from "@tanstack/react-router";
import { FileSpreadsheet } from "lucide-react";
import React from "react";
import authClient from "~/lib/auth-client";
import ThemeToggle from "~/lib/components/theme-toggle";
import { Button } from "~/lib/components/ui/button";
import { auth } from "~/lib/server/auth";
import appCss from "~/lib/styles/app.css?url";

const getUser = createServerFn({ method: "GET" }).handler(async () => {
  const { headers } = getWebRequest()!;
  const session = await auth.api.getSession({ headers });

  return session?.user || null;
});

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  theme: string;
  user: Awaited<ReturnType<typeof getUser>>;
}>()({
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.fetchQuery({
      queryKey: ["user"],
      queryFn: ({ signal }) => getUser({ signal }),
    }); // we're using react-query for caching, see router.tsx
    return { user };
  },
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "ExcelAIPro",
      },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  component: RootComponent,
});

export const Navbar = () => {
  const { user, queryClient } = Route.useRouteContext();

  const navigate = useNavigate();

  const handleLogout = async () => {
    await authClient.signOut();
    queryClient.invalidateQueries({ queryKey: ["user"] });
    navigate({ to: "/login" });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-20 h-16 transition-all backdrop-blur-md shadow-border">
      <div className="flex items-center justify-between h-full mx-10 md:mx-20">
        <div className="text-xl flex h-14 items-center px-4 lg:h-[60px] lg:px-6">
          <Link to={"/"} className="flex gap-1 items-center relative font-semibold">
            <FileSpreadsheet className="w-8 h-8 text-green-400" />
            <span>
              ExcelAI<span className=" text-green-400">Pro</span>
            </span>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          {user ? (
            <Button
              className="relative cursor-pointer rounded-lg px-4  py-2  overflow-hidden group"
              onClick={async () => handleLogout()}
            >
              Logout
            </Button>
          ) : (
            <Button
              asChild
              className="relative cursor-pointer rounded-lg px-4  py-2  overflow-hidden group"
            >
              <Link to="/login">
                <span className="relative z-10">Login</span>
                <div className="absolute inset-0  from-green-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

function RootComponent() {
  return (
    <RootDocument>
      {/* <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme"> */}
      <Navbar />
      <Outlet />
      {/* </ThemeProvider> */}
    </RootDocument>
  );
}
function RootDocument({ children }: { readonly children: React.ReactNode }) {
  // React.useEffect(() => {
  //   setIsClient(true);
  // }, []);

  React.useEffect(() => {
    // if (isClient) {
    if (localStorage.theme === "light") {
      document.documentElement.classList.remove("dark");
    } else if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
    }
    // }
  }, []);
  return (
    // suppress since we're updating the "dark" class in a custom script below suppressHydrationWarning
    <html className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {/* <ScriptOnce>
          {`
            if (localStorage.theme === 'light') {
              document.documentElement.classList.remove('dark')
            } else if (
              localStorage.theme === 'dark' ||
              (!('theme' in localStorage) &&
                window.matchMedia('(prefers-color-scheme: dark)').matches)
            ) {
              document.documentElement.classList.add('dark')
            }
          `}
        </ScriptOnce> */}
        <script src="https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js"></script>

        {children}
        {process.env.NODE_ENV !== "production" && (
          <>
            <ReactQueryDevtools buttonPosition="bottom-left" />
            <TanStackRouterDevtools position="bottom-right" />
          </>
        )}
        <Scripts />
      </body>
    </html>
  );
}
