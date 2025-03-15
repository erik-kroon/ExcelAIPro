import { google } from "@ai-sdk/google";
import { json } from "@tanstack/react-start";
import { createAPIFileRoute } from "@tanstack/react-start/api";
import { convertToCoreMessages, generateId, Message, streamText } from "ai";
import { SYSTEM_PROMPT } from "~/lib/prompt";
import { analysisTools } from "~/lib/tools/analysis";
import { coreTools } from "~/lib/tools/core";
import { exportTools } from "~/lib/tools/export";
import { calculatorTools } from "~/lib/tools/math";
import { transformationTools } from "~/lib/tools/transformation";

export const APIRoute = createAPIFileRoute("/api/chat/$")({
  POST: async ({ request }) => {
    try {
      const body = await request.json();
      const schema = body?.schema;
      const messages: Message[] = body.messages;

      messages.push({
        id: generateId(),
        role: "data",
        content: JSON.stringify(schema, null, 2),
        parts: [{ type: "text", text: JSON.stringify(schema, null, 2) }],
      });

      // console.log(messages);

      // {
      //   console.dir(body, { depth: null });
      // }

      const result = streamText({
        maxSteps: 25,

        tools: {
          ...calculatorTools(),
          ...coreTools(),
          ...exportTools(),
          ...transformationTools(),
          ...analysisTools(),
        },

        model: google("gemini-2.0-flash-exp"),
        system: SYSTEM_PROMPT,

        onError: (error) => console.log(error),
        messages: convertToCoreMessages(messages),
      });

      // console.log(result);

      const errorHandler = (error: unknown) => {
        if (error == null) {
          return "unknown error";
        }

        if (typeof error === "string") {
          return error;
        }

        if (error instanceof Error) {
          return error.message;
        }

        return JSON.stringify(error);
      };
      return result.toDataStreamResponse({ getErrorMessage: errorHandler });
    } catch (error) {
      console.error("Error processing chat request:", error);
      return json({ error: "Failed to process chat request" }, { status: 500 });
    }
  },
});
