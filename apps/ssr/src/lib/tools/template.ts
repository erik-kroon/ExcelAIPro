import * as formulajs from "@formulajs/formulajs";
import { tool, type Tool } from "ai";
import { z } from "zod";

export type TemplateTools =
  | "exampleTool"
  | "DATE"
  | "HYPERFORMULA"
  | "ARRAY_TOOL"
  | "DATEVALUE"
  | "DAY"
  | "DAYS"
  | "DAYS360"
  | "EDATE";

export const templateTools = (config?: {
  excludeTools?: TemplateTools[];
}): Partial<Record<TemplateTools, Tool>> => {
  const tools: Partial<Record<TemplateTools, Tool>> = {
    exampleTool: tool({
      description: "An example tool that returns a fixed string.",
      parameters: z.object({}),
      execute: async () => {
        return { result: "This is a template tool response." };
      },
    }),
    DATE: tool({
      description: "Returns the number that represents the date in Excel date-time code.",
      parameters: z.object({
        year: z.number().describe("The year of the date. Can be 1900-9999"),
        month: z.number().describe("The month of the year. Can be 1-12"),
        day: z.number().describe("The day of the month. Can be 1-31"),
      }),
      execute: async ({ year, month, day }) => {
        return formulajs.DATE(year, month, day);
      },
    }),

    DATEVALUE: tool({
      description: "Returns the number that represents the date in Excel date-time code.",
      parameters: z.object({
        date_text: z.string().describe("Date in text format"),
      }),
      execute: async ({ date_text }) => {
        return formulajs.DATEVALUE(date_text);
      },
    }),
    DAY: tool({
      description: "Returns the day of a date, represented by a serial number.",
      parameters: z.object({
        serial_number: z.string().describe("Date in text format"),
      }),
      execute: async ({ serial_number }) => {
        return formulajs.DAY(serial_number);
      },
    }),
    DAYS: tool({
      description: "Returns the number of days between two dates.",
      parameters: z.object({
        end_date: z.string().describe("The later date"),
        start_date: z.string().describe("The earlier date"),
      }),
      execute: async ({ end_date, start_date }) => {
        return formulajs.DAYS(end_date, start_date);
      },
    }),
    DAYS360: tool({
      description:
        "Calculates the number of days between two dates based on a 360-day year (twelve 30-day months), which is used in some accounting calculations.",
      parameters: z.object({
        start_date: z.string().describe("The start date"),
        end_date: z.string().describe("The end date"),
      }),
      execute: async ({ start_date, end_date }) => {
        return formulajs.DAYS360(start_date, end_date, false);
      },
    }),
    EDATE: tool({
      description:
        "Returns the serial number that represents the date that is the indicated number of months before or after a specified date (start_date). Use EDATE to calculate maturity dates or due dates that fall on the same day of the month as the date of issue.",
      parameters: z.object({
        start_date: z.string().describe("A date that represents the start date"),
        months: z
          .number()
          .describe(
            "The number of months before or after start_date. A positive value for months yields a future date; a negative value yields a past date.",
          ),
      }),
      execute: async ({ start_date, months }) => {
        return formulajs.EDATE(start_date, months);
      },
    }),
  };

  for (const toolName in tools) {
    if (config?.excludeTools?.includes(toolName as TemplateTools)) {
      delete tools[toolName as TemplateTools];
    }
  }

  return tools;
};
