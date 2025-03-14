import { createAuthClient } from "better-auth/react";

const authClient = createAuthClient({
  baseURL: import.meta.env.VERCEL_URL,
});

export default authClient;
