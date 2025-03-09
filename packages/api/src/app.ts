import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { hc } from "hono/client";
import { auth } from "./lib/auth";
import { db } from "@excelaipro/db";
import { logger } from "hono/logger";
import { google } from "@ai-sdk/google";
import { generateText, streamText } from "ai";
import { cors } from "hono/cors";
import { streamText as honoStreamText } from "hono/streaming";

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

const tools = {
  generate_formula: {
    description: "Generate an Excel formula based on a user’s description.",
    parameters: {
      description: {
        type: "string",
        description:
          "A description of what the user wants to achieve in Excel.",
      },
    },
    execute: async ({ description }: { description: string }) => {
      // Placeholder: In a real implementation, this could call an external service or use AI logic
      // For now, return a sample response based on common patterns
      if (description.toLowerCase().includes("sum")) {
        return {
          formula: "=SUM(A1:A10)",
          explanation: "This formula sums values in cells A1 to A10.",
        };
      } else if (description.toLowerCase().includes("average")) {
        return {
          formula: "=AVERAGE(A1:A10)",
          explanation:
            "This formula calculates the average of values in cells A1 to A10.",
        };
      }
      return {
        formula: "=ERROR",
        explanation:
          "Couldn’t generate a formula. Please provide more details.",
      };
    },
  },
  explain_function: {
    description: "Explain an Excel function and provide an example.",
    parameters: {
      function_name: {
        type: "string",
        description:
          "The name of the Excel function to explain (e.g., VLOOKUP).",
      },
    },
    execute: async ({ function_name }: { function_name: string }) => {
      // Placeholder: Could query a database in a real setup
      if (function_name.toUpperCase() === "VLOOKUP") {
        return {
          explanation:
            "VLOOKUP searches for a value in the first column of a range and returns a value in the same row from a specified column.",
          syntax:
            "VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])",
          example:
            '=VLOOKUP("Apple", A2:B10, 2, FALSE) returns the value in column B where "Apple" is found in column A.',
        };
      }
      return {
        explanation:
          "Function not recognized. Please specify a valid Excel function.",
      };
    },
  },
};

const routes = app
  .post(
    "/ai/chat",
    zValidator(
      "json",
      z.object({
        message: z.string(),
      }),
    ),
    async (c) => {
      return honoStreamText(c, async (stream) => {
        const userMessage = c.req.valid("json").message;
        console.log(userMessage);

        const fullPrompt = `${SYSTEM_PROMPT}\n\nUser: ${userMessage}\nAssistant:`;

        const result = streamText({
          model: google("gemini-2.0-flash-001"),
          prompt: fullPrompt,
          // tools,
        });

        for await (const textPart of result.textStream) {
          await stream.write(textPart);
        }
      });
    },
  )
  .get("/test", async (c) => {
    return honoStreamText(c, async (stream) => {
      const result = streamText({
        model: google("gemini-2.0-flash-001"),

        prompt: "Invent a new holiday and describe its traditions.",
      });

      for await (const textPart of result.textStream) {
        await stream.write(textPart);
      }
    });
  })
  .get("/session", zValidator("query", z.object({}).optional()), (c) => {
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
