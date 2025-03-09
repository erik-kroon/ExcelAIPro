import { hc } from "hono/client";
import type { AppType } from "@excelaipro/api";

export const api = hc<AppType>("http://localhost:3000").api;
