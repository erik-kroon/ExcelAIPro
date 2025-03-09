import { create } from "zustand";
import { auth } from "./auth";

interface Session {
  user: typeof auth.$Infer.Session.user | null;
  session: typeof auth.$Infer.Session.session | null;
}

export const sessionStore = create<Session>((set) => ({
  user: null,
  session: null,
}));
