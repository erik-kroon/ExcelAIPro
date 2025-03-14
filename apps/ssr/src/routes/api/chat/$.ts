import { google } from "@ai-sdk/google";
import { json } from "@tanstack/react-start";
import { createAPIFileRoute } from "@tanstack/react-start/api";
import { convertToCoreMessages, streamText } from "ai";
import { calculatorTools } from "~/lib/tools/math";
import { SYSTEM_PROMPT } from "~/lib/utils";
export const APIRoute = createAPIFileRoute("/api/chat/$")({
  POST: async ({ request }) => {
    try {
      const { messages } = await request.json();
      const attachments = messages[0]?.experimental_attachments;
      console.log(attachments);
      const result = streamText({
        maxSteps: 10,

        tools: {
          ...calculatorTools(),
        },
        model: google("gemini-2.0-flash-exp"),
        system: SYSTEM_PROMPT,
        onError: (error) => console.log(error),
        messages: convertToCoreMessages(messages),
      });

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
