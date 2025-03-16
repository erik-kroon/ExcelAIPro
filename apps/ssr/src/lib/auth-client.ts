import { createAuthClient } from "better-auth/react";

console.log(import.meta.env.VITE_BASE_URL);
const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_BASE_URL,
});

export default authClient;
