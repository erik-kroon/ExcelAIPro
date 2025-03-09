import { createAuthClient } from "better-auth/client";
import { stripeClient } from "@better-auth/stripe/client";

export const auth = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL,
  disableDefaultFetchPlugins: true,
  fetchOptions: {
    priority: "high",
    credentials: "include",
    mode: "cors",
  },
  // plugins: [
  //   stripeClient({
  //     subscription: true,
  //   }),
  // ],
});
