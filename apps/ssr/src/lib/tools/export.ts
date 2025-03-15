import { tool, type Tool } from "ai";
import * as XLSX from "xlsx";
import { z } from "zod";
// Define types for memory and data (reused from your code)
// interface Memory {
//   columnMappings?: Record<string, string>;
// }

interface DataRow {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

// Define the new tool types
export type ExportTools =
  | "exportToCSV"
  | "suggestFormula"
  | "generateExcelFormula"
  | "exportToXLSX"
  | "fillMissingData"
  | "autoCategorize";

export const exportTools = (
  config?: {
    excludeTools?: ExportTools[];
  },
  data?: DataRow[],
  // memory?: Memory,
): Partial<Record<ExportTools, Tool>> => {
  const tools: Partial<Record<ExportTools, Tool>> = {
    exportToCSV: tool({
      description: "Exports the current dataset to a CSV string.",
      parameters: z.object({
        fileName: z
          .string()
          .optional()
          .default("output.csv")
          .describe("Name of the output file"),
        outputName: z
          .string()
          .optional()
          .describe("The name to give the output file (e.g., my_data)"), // Added outputName
        delimiter: z
          .string()
          .optional()
          .default(",")
          .describe("The delimiter to use in the CSV file."),
      }),
      execute: async ({ fileName, outputName, delimiter }) => {
        if (!data || !Array.isArray(data) || data.length === 0) {
          return { error: "No data available to export." };
        }

        const headers = Object.keys(data[0]);
        const csvRows = [
          headers.join(delimiter), // Header row
          ...data.map((row) =>
            headers
              .map((header) => {
                const value = row[header];
                let escapedValue = value ?? "";
                if (typeof value === "string") {
                  escapedValue = value.replace(/"/g, '""'); // Escape double quotes
                  if (escapedValue.includes(delimiter) || escapedValue.includes('"')) {
                    escapedValue = `"${escapedValue}"`; // Quote if delimiter or quotes are present
                  }
                }
                return escapedValue;
              })
              .join(delimiter),
          ),
        ];

        const csvContent = csvRows.join("\n");
        // In a real app, you might write this to a file or trigger a download
        return {
          result: {
            fileName: fileName ?? "output.csv",
            content: csvContent,
            outputName: outputName ?? "output",
          },
        }; // added outputName to result
      },
    }),
    suggestFormula: tool({
      description:
        "Generates an Excel formula from a natural language description. (Basic implementation, may not be accurate.)",
      parameters: z.object({
        description: z
          .string()
          .describe('Natural language description, e.g., "sum all sales"'),
      }),
      execute: async ({ description }) => {
        // This is a placeholder for a more robust formula parser.
        // Consider using a library like math.js or similar for actual formula parsing.
        const parts = description.toLowerCase().split(" ");
        const operation = parts[0],
          target = parts.slice(1).join(" ");
        const excelFunctions: Record<string, string> = {
          sum: "SUM",
          calculate: "",
          average: "AVERAGE",
          total: "SUM",
        };

        if (operation === "calculate" && target.includes("tax")) {
          const rateMatch = target.match(/(\d+)%/);
          if (rateMatch) {
            const rate = Number(rateMatch[1]) / 100;
            const colMatch = target.match(/sales|price/i);
            return {
              result: `=SUM(${colMatch ? colMatch[0].toUpperCase() : "A"}:${
                colMatch ? colMatch[0].toUpperCase() : "A"
              }) * ${rate}`,
            };
          }
        }
        const func = excelFunctions[operation] || "SUM";
        const col = target.match(/sales|price|quantity/i)?.[0].toUpperCase() || "A";
        return { result: `=${func}(${col}:${col})` };
      },
    }),
    generateExcelFormula: tool({
      description:
        "Generates an Excel formula string based on a user request. (Basic implementation, may not be accurate.)",
      parameters: z.object({
        operation: z
          .string()
          .describe('Requested operation, e.g., "sum column A", "average B2:B10"'),
      }),
      execute: async ({ operation }) => {
        // This is a placeholder for a more robust formula generator.
        const parts = operation.toLowerCase().trim().split(" ");
        const func = parts[0];
        const target = parts.slice(1).join(" ");

        // Map to Excel functions
        const excelFunctions: Record<string, string> = {
          sum: "SUM",
          average: "AVERAGE",
          min: "MIN",
          max: "MAX",
          count: "COUNT",
        };

        if (!(func in excelFunctions)) {
          return {
            error: `Unsupported operation "${func}". Supported: sum, average, min, max, count.`,
          };
        }

        // Simple range detection (e.g., "column A" or "A2:A10")
        let range = target;
        if (target.startsWith("column ")) {
          const colLetter = target.replace("column ", "").toUpperCase();
          range = `${colLetter}:${colLetter}`; // Entire column, e.g., "A:A"
        } else if (
          !target.match(/[A-Z]+\d+:[A-Z]+\d+/) &&
          !target.match(/[A-Z]+:[A-Z]+/)
        ) {
          return {
            error: `Invalid range format. Use "column A" or "A2:A10" (e.g., sum A1:A10).`,
          };
        }

        const formula = `=${excelFunctions[func]}(${range})`;
        return { result: formula };
      },
    }),
    exportToXLSX: tool({
      description: "Exports the current dataset to an XLSX file.",
      parameters: z.object({
        fileName: z
          .string()
          .optional()
          .default("output.xlsx")
          .describe("Name of the output file"),
        outputName: z
          .string()
          .optional()
          .describe("The name to give the output file (e.g., my_data)"),
      }),
      execute: async ({ fileName, outputName }) => {
        if (!data || !Array.isArray(data) || data.length === 0) {
          return { error: "No data available to export." };
        }
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        const buffer = XLSX.write(wb, { bookType: "xlsx", type: "buffer" });
        const file = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        return {
          result: {
            fileName: fileName ?? "output.xlsx",
            outputName: outputName ?? "output",
            file: file,
          },
        };
      },
    }),
    fillMissingData: tool({
      description: "Fills missing values in a specified column using a given method.",
      parameters: z.object({
        column: z.string().describe("The column to fill missing data in."),
        method: z
          .enum(["ffill", "mean", "median", "interpolate", "mode"])
          .describe(
            "The method to use for filling missing data (ffill, mean, median, interpolate, mode).",
          ),
      }),
      execute: async ({ column, method }) => {
        if (!data || !Array.isArray(data) || data.length === 0) {
          return { error: "No data available." };
        }

        if (!(column in data[0])) {
          return { error: `Column "${column}" does not exist.` };
        }

        if (data.every((row) => row[column] === null || row[column] === undefined)) {
          return {
            error: `Column "${column}" contains only missing values, cannot fill.`,
          };
        }

        let fillValue: number | string | undefined;

        if (method === "ffill") {
          // Forward Fill
          let lastValidValue: number | string | undefined = undefined;
          for (let i = 0; i < data.length; i++) {
            if (data[i][column] !== null && data[i][column] !== undefined) {
              lastValidValue = data[i][column];
            } else if (lastValidValue !== undefined) {
              data[i][column] = lastValidValue;
            }
          }
        } else if (method === "interpolate") {
          // Linear Interpolation
          const values: { index: number; value: number }[] = [];
          for (let i = 0; i < data.length; i++) {
            const value = Number(data[i][column]);
            if (!isNaN(value)) {
              values.push({ index: i, value });
            }
          }

          for (let i = 0; i < data.length; i++) {
            if (data[i][column] === null || data[i][column] === undefined) {
              let prevIndex = -1;
              let nextIndex = -1;

              for (let j = values.length - 1; j >= 0; j--) {
                if (values[j].index < i) {
                  prevIndex = values[j].index;
                  break;
                }
              }

              for (let j = 0; j < values.length; j++) {
                if (values[j].index > i) {
                  nextIndex = values[j].index;
                  break;
                }
              }

              if (prevIndex !== -1 && nextIndex !== -1) {
                const prevValue = Number(data[prevIndex][column]);
                const nextValue = Number(data[nextIndex][column]);
                if (!isNaN(prevValue) && !isNaN(nextValue)) {
                  data[i][column] =
                    prevValue +
                    ((nextValue - prevValue) * (i - prevIndex)) / (nextIndex - prevIndex);
                }
              }
            }
          }
        } else {
          // Mean, Median, Mode
          const validValues: number[] = [];
          for (let i = 0; i < data.length; i++) {
            const value = Number(data[i][column]);
            if (!isNaN(value)) {
              validValues.push(value);
            }
          }

          if (validValues.length === 0) {
            return {
              error: `Column "${column}" contains no valid numeric values, cannot calculate ${method}.`,
            };
          }

          if (method === "mean") {
            fillValue = validValues.reduce((a, b) => a + b, 0) / validValues.length;
          } else if (method === "median") {
            validValues.sort((a, b) => a - b);
            const mid = Math.floor(validValues.length / 2);
            fillValue =
              validValues.length % 2 === 0
                ? (validValues[mid - 1] + validValues[mid]) / 2
                : validValues[mid];
          } else if (method === "mode") {
            const counts: { [key: number]: number } = {};
            validValues.forEach((v) => (counts[v] = (counts[v] || 0) + 1));
            let mode: number | undefined;
            let maxCount = 0;
            for (const v in counts) {
              if (counts[v] > maxCount) {
                mode = Number(v);
                maxCount = counts[v];
              }
            }
            fillValue = mode;
          }

          if (fillValue !== undefined) {
            for (let i = 0; i < data.length; i++) {
              if (data[i][column] === null || data[i][column] === undefined) {
                data[i][column] = fillValue;
              }
            }
          }
        }

        return { result: "Missing data filled successfully." };
      },
    }),
    autoCategorize: tool({
      description: "Categorizes data in a column based on predefined rules.",
      parameters: z.object({
        column: z.string().describe("The column to categorize."),
        rules: z
          .string()
          .describe(
            'Rules for categorization (e.g., "if expense > 5000, Capital; if expense > 1000, Major"). Separate multiple rules with semicolons.',
          ),
        overwrite: z
          .boolean()
          .optional()
          .default(false)
          .describe("Whether to overwrite the existing column or create a new one."),
      }),
      execute: async ({ column, rules, overwrite }) => {
        if (!data || !Array.isArray(data) || data.length === 0) {
          return { error: "No data available." };
        }

        if (!(column in data[0])) {
          return { error: `Column "${column}" does not exist.` };
        }

        const rulePairs = rules.split(";").map((rule) => rule.trim());
        const parsedRules: { condition: (row: DataRow) => boolean; category: string }[] =
          [];

        for (const rulePair of rulePairs) {
          const [conditionStr, category] = rulePair.split(",").map((s) => s.trim());
          if (!conditionStr || !category) {
            return {
              error: `Invalid rule format: "${rulePair}". Use 'condition, category'. Separate multiple rules with semicolons.`,
            };
          }

          try {
            // Create a function that evaluates the condition for a given row
            const condition = (row: DataRow) => {
              try {
                const value = row[column];
                // Replace column name with value for evaluation
                const safeConditionStr = conditionStr.replace(
                  new RegExp(column, "g"),
                  "value",
                );
                // Use Function constructor for safe evaluation
                return Function("value", `return ${safeConditionStr}`)(value);
              } catch (e) {
                console.error("Error evaluating condition", e);
                return false; // Default to false on error
              }
            };
            parsedRules.push({ condition, category });
          } catch (error) {
            return {
              error: `Error parsing condition "${conditionStr}": ${error}`,
            };
          }
        }

        const targetColumn = overwrite ? column : `${column}Category`;
        for (let i = 0; i < data.length; i++) {
          for (const rule of parsedRules) {
            if (rule.condition(data[i])) {
              data[i][targetColumn] = rule.category;
              break; // Stop after the first matching rule
            }
          }
        }

        return { result: "Data auto-categorized successfully." };
      },
    }),
  };

  // Exclude tools as specified in config
  for (const toolName in tools) {
    if (config?.excludeTools?.includes(toolName as ExportTools)) {
      delete tools[toolName as ExportTools];
    }
  }

  return tools;
};
