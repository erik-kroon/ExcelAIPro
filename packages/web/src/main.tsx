import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

import "../index.css";
import { QueryClient } from "@tanstack/react-query";
import { api } from "./lib/hono";
import { sessionStore } from "./lib/store";
import { NotFound } from "./components/not-found";

export const qc = new QueryClient();

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  context: {
    qc: qc,
    api: api,
    sessionStore: sessionStore,
  },
  scrollRestoration: true,
  defaultNotFoundComponent: () => NotFound(),
});

// Register things for typesafety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("app")!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<RouterProvider router={router} />);
}
