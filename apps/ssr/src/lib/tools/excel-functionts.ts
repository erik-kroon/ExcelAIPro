import * as formulajs from "@formulajs/formulajs";
import { tool, type Tool } from "ai";
import { z } from "zod";

export type ExcelFunctionTools =
  | "SUM"
  | "AVERAGE"
  | "IF"
  | "COUNT"
  | "COUNTA"
  | "VLOOKUP"
  | "SUMIF"
  | "COUNTIF"
  | "INDEX"
  | "MATCH"
  | "DATE"
  | "YEAR"
  | "MONTH"
  | "DAY"
  | "TEXT"
  | "AND"
  | "OR"
  | "LEFT"
  | "CONCATENATE"
  | "TRIM";

export const excelFunctions = (config?: {
  excludeTools?: ExcelFunctionTools[];
}): Partial<Record<ExcelFunctionTools, Tool>> => {
  const tools: Partial<Record<ExcelFunctionTools, Tool>> = {
    SUM: tool({
      description: "Adds all the numbers in a range of cells.",
      parameters: z.object({
        number: z.array(z.number()).describe("An array of numbers that you want to sum."),
      }),
      execute: async ({ number }) => {
        return formulajs.SUM(...number);
      },
    }),
    AVERAGE: tool({
      description: "Returns the average (arithmetic mean) of its arguments.",
      parameters: z.object({
        number: z
          .array(z.number())
          .describe("An array of numbers for which you want to calculate the average."),
      }),
      execute: async ({ number }) => {
        return formulajs.AVERAGE(...number);
      },
    }),
    IF: tool({
      description: "Specifies a logical test to perform.",
      parameters: z.object({
        logical_test: z
          .boolean()
          .describe("Any value or expression that can be evaluated to TRUE or FALSE."),
        value_if_true: z
          .string()
          .describe("The value that is returned if logical_test is TRUE."),
        value_if_false: z
          .string()
          .describe("The value that is returned if logical_test is FALSE."),
      }),
      execute: async ({ logical_test, value_if_true, value_if_false }) => {
        return formulajs.IF(logical_test, value_if_true, value_if_false);
      },
    }),
    COUNT: tool({
      description: "Counts the number of cells that contain numbers.",
      parameters: z.object({
        value: z.array(z.number()).describe("An array of values that you want to count."),
      }),
      execute: async ({ value }) => {
        return formulajs.COUNT(...value);
      },
    }),
    COUNTA: tool({
      description: "Counts the number of cells that are not empty.",
      parameters: z.object({
        value: z.array(z.string()).describe("An array of values that you want to count."),
      }),
      execute: async ({ value }) => {
        const parsedValues = value.map(parseValue);
        return formulajs.COUNTA(...parsedValues);
      },
    }),
    VLOOKUP: tool({
      description:
        "Looks for a value in the first column of a table, and then returns a corresponding value from another column in the same row. Provide the lookup value, table array, and column index. The table array should be a comma-separated string that can be split using `const table = table_array.map((row) => row.split(','))`",
      parameters: z.object({
        lookup_value: z.string().describe("The value to search for in the first column."),
        table_array: z
          .array(z.string())
          .describe(
            "The table in which to look for the value. Represent the table as an array of comma-separated strings.",
          ),
        col_index_num: z
          .number()
          .describe(
            "The column number (starting from 1) from which to return the matching value.",
          ),
        range_lookup: z
          .boolean()
          .optional()
          .describe(
            "Optional. TRUE for approximate match (table must be sorted ascendingly), FALSE for exact match.",
          ),
      }),
      execute: async ({ lookup_value, table_array, col_index_num, range_lookup }) => {
        try {
          const table = table_array.map((row) => row.split(",")); //Basic split, adjust as needed

          return formulajs.VLOOKUP(lookup_value, table, col_index_num, range_lookup);
        } catch (error) {
          console.error("VLOOKUP error:", error);
          return "Error in VLOOKUP execution. Check parameters.";
        }
      },
    }),
    SUMIF: tool({
      description: "Adds the values in a range that meet criteria that you specify.",
      parameters: z.object({
        range: z
          .array(z.string())
          .describe("The range of cells that you want evaluated by criteria."),
        criteria: z
          .string()
          .describe(
            "The criteria in the form of a number, expression, a cell reference, text, or a function that defines which cells will be added.",
          ),
        sum_range: z
          .array(z.string())
          .optional()
          .describe(
            "The actual cells to sum. If sum_range is omitted, the cells in range are summed.",
          ),
      }),
      execute: async ({ range, criteria, sum_range }) => {
        const parsedRange = range.map(parseValue);
        const parsedSumRange = sum_range ? sum_range.map(parseValue) : parsedRange;
        return formulajs.SUMIF(parsedRange, criteria, parsedSumRange);
      },
    }),
    COUNTIF: tool({
      description:
        "Counts the number of cells within a range that meet the given criteria.",
      parameters: z.object({
        range: z
          .array(z.string())
          .describe("The range of cells that you want evaluated by criteria."),
        criteria: z
          .string()
          .describe(
            "The criteria in the form of a number, expression, a cell reference, text, or a function that defines which cells will be counted.",
          ),
      }),
      execute: async ({ range, criteria }) => {
        const parsedRange = range.map(parseValue);
        return formulajs.COUNTIF(parsedRange, criteria);
      },
    }),
    INDEX: tool({
      description:
        "Returns a value or the reference to a value from within a table or range.",
      parameters: z.object({
        array: z.array(z.string()).describe("A range of cells or an array constant."),
        row_num: z
          .number()
          .optional()
          .describe(
            "Selects the row in array from which to return a value. If row_num is omitted, column_num is required.",
          ),
        column_num: z
          .number()
          .optional()
          .describe(
            "Selects the column in array from which to return a value. If column_num is omitted, row_num is required.",
          ),
      }),
      execute: async ({ array, row_num, column_num }) => {
        try {
          if (!row_num && !column_num) {
            return "Error: Either row_num or column_num must be provided for INDEX function.";
          }

          // Attempt to determine if the array is 2D by checking for commas in the first element
          const is2DArray = array.length > 0 && array[0].includes(",");

          if (is2DArray) {
            // Split each string element into a sub-array
            const table = array.map((row) => row.split(","));
            return formulajs.INDEX(table, row_num || 1, column_num || 1);
          } else {
            return formulajs.INDEX(array, row_num || 1, column_num || 1);
          }
        } catch (error) {
          console.error("INDEX error:", error);
          return "Error in INDEX execution. Check parameters and array dimensions.";
        }
      },
    }),
    MATCH: tool({
      description:
        "Looks for items in a range or an array, and returns the relative position of the item in the range.",
      parameters: z.object({
        lookup_value: z.string().describe("The value to search for in lookup_array."),
        lookup_array: z.array(z.string()).describe("The range of cells being searched."),
        match_type: z
          .number()
          .optional()
          .describe(
            "Optional. The number -1, 0, or 1. -1 finds the smallest value that is greater than or equal to lookup_value. 0 finds the first value that is exactly equal to lookup_value. 1 finds the largest value that is less than or equal to lookup_value. If omitted, it is assumed to be 1.",
          ),
      }),
      execute: async ({ lookup_value, lookup_array, match_type }) => {
        return formulajs.MATCH(lookup_value, lookup_array, match_type);
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
    YEAR: tool({
      description: "Returns the year of a date.",
      parameters: z.object({
        serial_number: z.string().describe("The date"),
      }),
      execute: async ({ serial_number }) => {
        try {
          const date = new Date(serial_number);
          return date.getFullYear();
        } catch (error) {
          console.error("YEAR error:", error);
          return "Error: Invalid date format. Please use a valid date string.";
        }
      },
    }),
    MONTH: tool({
      description: "Returns the month of a date represented by a serial number.",
      parameters: z.object({
        serial_number: z.string().describe("The date"),
      }),
      execute: async ({ serial_number }) => {
        try {
          const date = new Date(serial_number);
          return date.getMonth() + 1; // Month is 0-indexed
        } catch (error) {
          console.error("MONTH error:", error);
          return "Error: Invalid date format. Please use a valid date string.";
        }
      },
    }),
    DAY: tool({
      description: "Returns the day of a date, represented by a serial number.",
      parameters: z.object({
        serial_number: z.string().describe("The date in text format"),
      }),
      execute: async ({ serial_number }) => {
        try {
          const date = new Date(serial_number);
          return date.getDate();
        } catch (error) {
          console.error("DAY error:", error);
          return "Error: Invalid date format. Please use a valid date string.";
        }
      },
    }),
    TEXT: tool({
      description: "Formats a number and converts it to text.",
      parameters: z.object({
        value: z.number().describe("The number to format."),
        format_text: z.string().describe("A number format in text form."),
      }),
      execute: async ({ value, format_text }) => {
        try {
          return formulajs.TEXT(value, format_text);
        } catch (error) {
          console.error("TEXT error:", error);
          return `Error: Could not format number ${value} with format ${format_text}.`;
        }
      },
    }),
    AND: tool({
      description: "Returns TRUE if all arguments are TRUE.",
      parameters: z.object({
        logical: z
          .array(z.boolean())
          .describe(
            "An array of conditions that you want to test that can be either TRUE or FALSE.",
          ),
      }),
      execute: async ({ logical }) => {
        return formulajs.AND(...logical);
      },
    }),
    OR: tool({
      description: "Returns TRUE if any argument is TRUE.",
      parameters: z.object({
        logical: z
          .array(z.boolean())
          .describe(
            "An array of conditions that you want to test that can be either TRUE or FALSE.",
          ),
      }),
      execute: async ({ logical }) => {
        return formulajs.OR(...logical);
      },
    }),
    LEFT: tool({
      description:
        "Returns the first character or characters in a text string, based on the number of characters you specify.",
      parameters: z.object({
        text: z
          .string()
          .describe("The text string that contains the characters you want to extract."),
        num_chars: z
          .number()
          .describe(
            "Specifies how many characters you want LEFT to extract. Must be greater than or equal to zero. If num_chars is greater than the length of text, LEFT returns all of text.",
          ),
      }),
      execute: async ({ text, num_chars }) => {
        return formulajs.LEFT(text, num_chars);
      },
    }),
    CONCATENATE: tool({
      description: "Joins several text strings into one text string.",
      parameters: z.object({
        text: z.array(z.string()).describe("Text items to be joined together."),
      }),
      execute: async ({ text }) => {
        return formulajs.CONCATENATE(...text);
      },
    }),
    TRIM: tool({
      description: "Removes all spaces from text except for single spaces between words.",
      parameters: z.object({
        text: z.string().describe("The text from which you want to remove spaces."),
      }),
      execute: async ({ text }) => {
        return formulajs.TRIM(text);
      },
    }),
  };

  function parseValue(value: string): string | number | boolean {
    if (typeof value !== "string") {
      return value; // Return if already a number or boolean
    }

    const lowerCaseValue = value.toLowerCase();

    if (lowerCaseValue === "true") {
      return true;
    } else if (lowerCaseValue === "false") {
      return false;
    }

    const num = Number(value);
    if (!isNaN(num)) {
      return num;
    }

    return value;
  }

  for (const toolName in tools) {
    if (config?.excludeTools?.includes(toolName as ExcelFunctionTools)) {
      delete tools[toolName as ExcelFunctionTools];
    }
  }

  return tools;
};
