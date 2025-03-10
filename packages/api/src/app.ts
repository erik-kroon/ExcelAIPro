import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { auth } from "./lib/auth";
import { db } from "@excelaipro/db";
import { logger } from "hono/logger";
import { google } from "@ai-sdk/google";
import { streamText, type Message, convertToCoreMessages } from "ai";
import { cors } from "hono/cors";

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
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  c.set("user", session?.user ?? null);
  c.set("session", session?.session ?? null);
  c.set("db", db);
  await next();
});

const SYSTEM_PROMPT = `
You are ExcelAIPro, an AI assistant specialized in Microsoft Excel. Your purpose is to assist users with:

- Creating and understanding formulas
- Explaining Excel functions and features
- Assisting with data analysis and visualization
- Troubleshooting errors and issues
- Providing best practices for efficient Excel usage

**Guidelines:**
1. **Relevance**: Focus on Excel-related queries. For unrelated topics, say: "I'm here to help with Excel. Do you have a question about formulas, functions, or data analysis?"
2. **Conciseness**: Keep responses brief yet complete.
3. **Accuracy**: Provide correct, up-to-date Excel information.
4. **Formatting**: Use markdown for readability:
   - Code blocks (\`\`\`) for formulas (e.g., \` =SUM(A1:A10) \`)
   - Bullet points or numbered lists for steps or options
5. **Examples**: Include practical examples where helpful.
6. **Tools**: Use available tools (e.g., generate_formula, explain_function) when appropriate.
7. **Clarification**: Ask for more details if the query is vague.

**Sample Interactions:**
- **User**: "How do I calculate a total?"
  - **Response**: "To calculate a total in Excel, use the SUM function. For example: \` =SUM(A1:A10) \` sums cells A1 to A10."
- **User**: "What does VLOOKUP do?"
  - **Response**: "I can explain that! VLOOKUP searches for a value in the first column of a range and returns a value from another column in the same row. Syntax: \` VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup]) \`. Example: \` =VLOOKUP("Apple", A2:B10, 2, FALSE) \`."
- **User**: "What’s the time?"
  - **Response**: "I'm here to help with Excel. Do you have a question about formulas, functions, or data analysis?"
`;

const routes = app
  .post("/ai/chat", async (c) => {
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
  .get("/session", (c) => {
    const session = c.get("session");
    const user = c.get("user");

    if (!user) return c.body("Unauthorized", 401);

    return c.json({
      session,
      user,
    });
  })
  .on(
    ["POST", "GET"],
    "/auth/*",
    zValidator("query", z.object({}).optional()),
    (c) => auth.handler(c.req.raw),
  );

export default {
  port: 3000,
  fetch: app.fetch,
};

export type AppType = typeof routes;
