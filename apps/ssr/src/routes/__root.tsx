import type { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";
import React from "react";
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
    });
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

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}
function RootDocument({ children }: { readonly children: React.ReactNode }) {
  React.useEffect(() => {
    if (localStorage.theme === "light") {
      document.documentElement.classList.remove("dark");
    } else if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
    }
  });
  return (
    // suppress since we're updating the "dark" class in a custom script below suppressHydrationWarning
    <html className="supressHydrationWarnings dark">
      <head>
        <HeadContent />
        <script src="https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js"></script>
      </head>
      <body>
        {children}
        {/* {process.env.NODE_ENV !== "production" && (
          <>
            <ReactQueryDevtools buttonPosition="bottom-right" />
            <TanStackRouterDevtools position="top-right" />
          </>
        )} */}
        <Scripts />
      </body>
    </html>
  );
}
