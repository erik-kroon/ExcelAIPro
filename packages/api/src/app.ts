import { Hono } from "hono";
import { auth } from "./lib/auth";
import { db } from "@excelaipro/db";
import { logger } from "hono/logger";
import { google } from "@ai-sdk/google";
import { streamText, convertToCoreMessages } from "ai";
import { cors } from "hono/cors";
import { SYSTEM_PROMPT } from "./lib/prompt";

export type Variables = {
  user: typeof auth.$Infer.Session.user | null;
  session: typeof auth.$Infer.Session.session | null;
  db: typeof db;
};

const app = new Hono<{ Variables: Variables }>().basePath("/api");

app.use(
  "*",
  cors({
    origin: "http://localhost:3001",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  }),
);

app.use("*", logger());

app.use("*", async (c, next) => {
  if (c.req.url.includes("/api/auth/-in/*")) {
    await next();
    return;
  }

  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) return c.body("Unauthorized", 401);

  c.set("user", session?.user ?? null);
  c.set("session", session?.session ?? null);
  c.set("db", db);
  await next();
});

const routes = app
  .post("/chat", async (c) => {
    const body = await c.req.json();
    console.log(body?.messages?.[0]?.experimental_attachments);
    const { messages } = await c.req.json();

    const result = streamText({
      model: google("gemini-2.0-flash-001"),
      system: SYSTEM_PROMPT,
      messages: convertToCoreMessages(messages),
    });

    return result.toDataStreamResponse();
  })
  .on(["POST", "GET"], "/auth/*", (c) => auth.handler(c.req.raw));

export default {
  port: 3000,
  fetch: app.fetch,
};

export type AppType = typeof routes;
