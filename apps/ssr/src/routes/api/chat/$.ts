import { google } from "@ai-sdk/google";
import { json } from "@tanstack/react-start";
import { createAPIFileRoute } from "@tanstack/react-start/api";
import { CoreMessage, generateId, generateObject, streamText } from "ai";
import * as XLSX from "xlsx";
import { tools } from "~/lib/tools";
import {
  buildClassificationPrompt,
  classificationSchema,
  extractFileDetails,
  FileInfo,
  Message,
} from "~/lib/utils/classification";
import { SYSTEM_PROMPT } from "~/lib/utils/prompt";

export const APIRoute = createAPIFileRoute("/api/chat/$")({
  POST: async ({ request }) => {
    try {
      const body = await request.json();
      const messages: Message[] = body.messages;

      if (!messages || messages.length === 0) {
        return json({ error: "No messages found." }, { status: 400 });
      }

      const lastUserMessage = messages.filter((m) => m.role === "user").pop();
      if (!lastUserMessage) {
        return json({ error: "No user message found." }, { status: 400 });
      }

      const fileInfoArray = extractFileDetails(lastUserMessage);
      const classificationPrompt = buildClassificationPrompt(
        lastUserMessage.content,
        fileInfoArray,
      );

      // Phase 1: Input Classification and Early Filtering (1st LLM Call)
      const { object: classificationResult } = await generateObject({
        model: google("gemini-2.0-flash-lite-preview-02-05"),
        schema: classificationSchema,
        prompt: classificationPrompt,
      });

      // Phase 2: Data Extraction and Preparation
      let sheetData: (string | number)[][] | undefined = undefined;
      let sheetNames: string[] = []; // Added to store sheet names

      if (
        classificationResult.file_present &&
        fileInfoArray &&
        fileInfoArray.length > 0
      ) {
        const fileInfo: FileInfo = fileInfoArray[0];

        // Handle unsupported file types
        if (fileInfo.type !== "xlsx" && fileInfo.type !== "xls") {
          console.warn("Unsupported file type:", fileInfo.type);
          return json(
            {
              error: "Unsupported file type. Please upload an .xlsx or .xls file.",
            },
            { status: 400 },
          );
        }

        try {
          if (lastUserMessage.experimental_attachments?.[0].url.startsWith("data:")) {
            const getXlsxWorkbookFromBase64 = (base64String: string) => {
              const base64Data = base64String.split(",")[1];
              const buffer = Buffer.from(base64Data, "base64");
              return XLSX.read(buffer, { type: "buffer" });
            };

            const xlsxWorkbook = getXlsxWorkbookFromBase64(
              lastUserMessage.experimental_attachments[0].url,
            );
            sheetNames = xlsxWorkbook.SheetNames;
            sheetData = XLSX.utils.sheet_to_json(
              xlsxWorkbook.Sheets[xlsxWorkbook.SheetNames[0]],
              { header: 1 },
            ) as (string | number)[][];
          }
        } catch (e: unknown) {
          console.error("Error processing file:", e);
          return json({ error: "Failed to process the uploaded file." }, { status: 400 });
        }
      }

      // Prepare sample data for formula generation
      let headers: (string | number)[] | undefined = undefined;
      let sampleRows: (string | number)[][] | undefined = undefined;
      if (sheetData) {
        headers = sheetData[0];
        sampleRows = sheetData.slice(1, Math.min(6, sheetData.length));
      }

      // Phase 3: Formula Generation with Tailored Prompts
      const category = classificationResult.message_subject_category;
      let formulaGenerationPrompt = "";

      switch (category) {
        case "formula_generation":
          formulaGenerationPrompt = `Given the Excel data:
      Headers: ${JSON.stringify(headers)}
      Sample rows: ${JSON.stringify(sampleRows)}
      Provide an Excel formula to "${lastUserMessage.content}". The formula should:
      - Use valid Excel syntax compatible with HyperFormula.
      - Handle edge cases (e.g., empty cells, non-numeric values).
      - Support advanced functions if needed (e.g., VLOOKUP, SUMIFS).
      Use the 'evaluateFormula' tool to calculate the expected result based on the sample data, and the 'checkFormulaSyntax' tool to validate the formula syntax.
      Format your response as:
      Formula: [formula]
      Expected Result: [number]
      Explanation: [brief explanation]`;
          break;

        case "date_time_calculation":
          formulaGenerationPrompt = `Given the Excel data:
      Headers: ${JSON.stringify(headers)}
      Sample rows: ${JSON.stringify(sampleRows)}
      Provide an Excel formula to perform a date or time calculation for "${lastUserMessage.content}". The formula should:
      - Use valid Excel date/time functions (e.g., DATEDIF, TODAY, NETWORKDAYS).
      - Handle edge cases (e.g., invalid dates, empty cells).
      Use the 'evaluateFormula' tool to calculate the expected result based on the sample data, and the 'checkFormulaSyntax' tool to validate the formula syntax.
      Format your response as:
      Formula: [formula]
      Expected Result: [number or date]
      Explanation: [brief explanation]`;
          break;

        case "financial_calculation":
          formulaGenerationPrompt = `Given the Excel data:
      Headers: ${JSON.stringify(headers)}
      Sample rows: ${JSON.stringify(sampleRows)}
      Provide an Excel formula to perform a financial calculation for "${lastUserMessage.content}". The formula should:
      - Use valid Excel financial functions (e.g., PMT, FV, NPV).
      - Handle edge cases (e.g., non-numeric values, zero division).
      Use the 'evaluateFormula' tool to calculate the expected result based on the sample data, and the 'checkFormulaSyntax' tool to validate the formula syntax.
      Format your response as:
      Formula: [formula]
      Expected Result: [number]
      Explanation: [brief explanation]`;
          break;

        case "power_query":
          formulaGenerationPrompt = `The user is asking for a Power Query M code. If a file is present, the workbook has sheets: ${JSON.stringify(sheetNames)}, and for the first sheet, headers: ${JSON.stringify(headers)} and sample rows: ${JSON.stringify(sampleRows)}. Generate a Power Query M code to fulfill the user's request: "${lastUserMessage.content}". The M code should be valid and executable in Excel's Power Query editor. If the request involves data from the file, use the provided data. If not, generate the M code accordingly. Provide the code in a code block (using \`\`\`m and \`\`\`) and include a brief explanation.`;
          break;

        case "vba":
          formulaGenerationPrompt = `The user is asking for a VBA code. If a file is present, the workbook has sheets: ${JSON.stringify(sheetNames)}. Generate a VBA code to fulfill the user's request: "${lastUserMessage.content}". The code should be valid VBA syntax and achieve the desired functionality. If the request involves data from the file, assume the data is in the workbook. Provide the code in a code block (using \`\`\`vba and \`\`\`) and include a brief explanation.`;
          break;

        case "vague_query":
          formulaGenerationPrompt = `The query is vague. respond to user with a message asking for clarifications on what they want you to do`;
          break;

        case "unrelated":
          formulaGenerationPrompt = `The query was categorized as unrelated, so respond to the user with a message explaining that the query is unrelated to the data.`;
          break;

        default:
          formulaGenerationPrompt = `The query was categorized as an unsupported query category, so respond to the user with a message explaining that the query is unsupported.`;
          break;
      }

      // Combine messages with classification result and data
      messages.push({
        id: generateId(),
        role: "assistant",
        content: JSON.stringify(
          {
            ...classificationResult,
            file_details: classificationResult.file_details?.map((file) => {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { url, ...rest } = file;
              return rest;
            }),
            rowAmount: sheetData?.length,
            headers: headers,
            sampleRows: sampleRows,
            // table: sheetData,
          },
          null,
          2,
        ),
      });

      const coreMessages: CoreMessage[] = messages.map((m) => ({
        id: m.id ?? generateId(),
        role: m.role === "data" ? "assistant" : m.role,
        content: m.content,
      }));

      console.log(coreMessages);

      console.log(sheetData);

      const combinedSystemPrompt = `${SYSTEM_PROMPT}\n\n${formulaGenerationPrompt}`;

      // console.log(combinedSystemPrompt);
      const result = streamText({
        maxSteps: 50,
        experimental_continueSteps: true,
        temperature: 0.3,
        toolChoice: "auto",
        model: google("gemini-2.0-flash-exp"),
        system: combinedSystemPrompt,
        maxRetries: 5,
        maxTokens: 1024,
        tools: tools,
        messages: coreMessages,
        onError: (error) => {
          // console.log(error);
          if (error && typeof error === "object" && "data" in error) {
            console.log("Error Data:", error.data);
            if (
              error.data &&
              typeof error.data === "object" &&
              "requestBodyValues" in error.data &&
              typeof error.data.requestBodyValues === "object"
            ) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const requestBodyValues = error.data.requestBodyValues as any; // Type assertion to 'any'

              console.log("Tool Request Values:", requestBodyValues);
              console.log("Tools:", {
                tools: requestBodyValues.tools,
                toolConfig: requestBodyValues.toolConfig,
              });
              if (requestBodyValues.tools && Array.isArray(requestBodyValues.tools)) {
                console.log("tools.function_declarations[2]", requestBodyValues.tools[2]);
              }
            }
          }
        },
      });

      return result.toDataStreamResponse({ getErrorMessage: errorHandler });
    } catch (error) {
      console.error("Error processing chat request:", error);
      return json(
        { error: `Failed to process chat request: ${(error as Error).message}` },
        { status: 500 },
      );
    }
  },
});

interface ToolParameterProperties {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; // Or a more specific type if you know the structure
}

interface ToolParameters {
  required?: string[];
  properties?: ToolParameterProperties;
}

interface Tool {
  parameters?: ToolParameters;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; // Allow other properties
}

interface RequestBodyValues {
  tools?: Tool[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toolConfig?: any; // Or a more specific type if you know the structure
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; // Allow other properties
}

interface CustomError extends Error {
  requestBodyValues?: RequestBodyValues;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any; // Or a more specific type if you know the structure
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; // Allow other properties
}

// Error handler for the stream
const errorHandler = (error: unknown): string => {
  if (error == null) return "Unknown error";
  if (
    error &&
    typeof error === "object" &&
    "data" in error &&
    typeof (error as CustomError).data === "object"
  ) {
    console.log(error.data);
  }
  if (
    error &&
    typeof error === "object" &&
    "requestBodyValues" in error &&
    typeof (error as CustomError).requestBodyValues === "object" // Use the interface
  ) {
    const requestBodyValues = (error as CustomError).requestBodyValues!; // Type assertion to CustomError and non-null assertion

    console.log("Tool Request Values:", requestBodyValues);
    console.log("Tools:", {
      tools: requestBodyValues.tools,
    });
  }

  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;
  return JSON.stringify(error);
};
