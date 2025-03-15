import { tool, type Tool } from "ai";
import * as XLSX from "xlsx";
import { z } from "zod";

// Define types for memory and data (reused from your code)
interface Memory {
  columnMappings?: Record<string, string>;
}

interface DataRow {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

// Define the new tool types
export type AnalysisTools =
  | "calculateSumOfColumn"
  | "calculateAverageOfColumn"
  | "calculateStandardDeviation"
  | "percentile"
  | "lookupValue"
  | "getCellReference"
  | "validateColumn"
  | "calculateMedianOfColumn"
  | "describeColumn"
  | "loadXLSXFile"
  | "detectGrowthPatterns"
  | "findOutliers"
  | "generateInsights";

// Define the possible validation criteria
export type ValidationRule = "isNumber" | "isDate" | "notNull" | "isPositive";

export const analysisTools = (
  config?: {
    excludeTools?: AnalysisTools[];
  },
  data?: DataRow[],
  memory?: Memory,
): Partial<Record<AnalysisTools, Tool>> => {
  const tools: Partial<Record<AnalysisTools, Tool>> = {
    calculateSumOfColumn: tool({
      description:
        'Calculates the sum of values in a specified column. The column must contain numeric data, and should be prepared before using this tool. The column must have already been assigned using the "assignColumn" tool.',
      parameters: z.object({
        columnType: z
          .string()
          .describe(
            'The standardized column type that represents the column you want to sum. This must be a column type that has been previously assigned using the "assignColumn" tool.',
          ),
      }),
      execute: async ({ columnType }) => {
        try {
          if (!memory) {
            console.error("calculateSumOfColumn: Memory is not available.");
            return {
              error:
                "Memory is not available.  This is required for calculateSumOfColumn to work correctly.",
            };
          }
          const columnMappings = (memory.columnMappings as Record<string, string>) || {}; // Ensure type safety
          const userColumnName = columnMappings[columnType];

          if (!userColumnName) {
            console.warn(
              `calculateSumOfColumn: No user-provided column name found for column type "${columnType}".`,
            );
            return {
              error: `No user-provided column name found for column type "${columnType}". Please use the "assignColumn" tool first.`,
            };
          }

          if (!data || !Array.isArray(data)) {
            console.error("calculateSumOfColumn: No data available.");
            return {
              error:
                "No data available. Please make sure the file has been uploaded and processed correctly.",
            };
          }

          let sum = 0;
          for (const row of data) {
            const value = row[userColumnName];
            if (typeof value === "number") {
              sum += value;
            } else if (typeof value === "string") {
              const parsedValue = parseFloat(value);
              if (!isNaN(parsedValue)) {
                sum += parsedValue;
              } else {
                console.warn(
                  `calculateSumOfColumn: Invalid value encountered in column "${userColumnName}": ${value}`,
                );
                return {
                  error: `Invalid numeric value found in column "${userColumnName}". Check that the column contains only numbers or numeric strings. You may use analyzeColumnDataType to verify.`,
                };
              }
            } else {
              console.warn(
                `calculateSumOfColumn: Unexpected data type in column "${userColumnName}": ${typeof value}`,
              );
              return {
                error: `Unexpected data type in column "${userColumnName}". Check that the column contains only numbers or numeric strings. You may use analyzeColumnDataType to verify.`,
              };
            }
          }

          return { result: `The sum of column "${userColumnName}" is: ${sum}` };
        } catch (error) {
          console.error("calculateSumOfColumn: An unexpected error occurred:", error);
          return { error: "An unexpected error occurred during sum calculation." };
        }
      },
    }),
    calculateAverageOfColumn: tool({
      description:
        'Calculates the average of values in a specified column. Ensure the column contains numeric data before using this tool and the column has already been assigned using the "assignColumn" tool.',
      parameters: z.object({
        columnType: z
          .string()
          .describe(
            'The standardized column type that represents the column you want to average. This must be a column type that has been previously assigned using the "assignColumn" tool.',
          ),
      }),
      execute: async ({ columnType }) => {
        try {
          if (!memory) {
            console.error("calculateAverageOfColumn: Memory is not available.");
            return {
              error:
                "Memory is not available. This is required for calculateAverageOfColumn to work correctly.",
            };
          }
          const columnMappings = (memory.columnMappings as Record<string, string>) || {}; // Ensure type safety
          const userColumnName = columnMappings[columnType];

          if (!userColumnName) {
            console.warn(
              `calculateAverageOfColumn: No user-provided column name found for column type "${columnType}".`,
            );
            return {
              error: `No user-provided column name found for column type "${columnType}". Please use the "assignColumn" tool first.`,
            };
          }

          if (!data || !Array.isArray(data)) {
            console.error("calculateAverageOfColumn: No data available.");
            return {
              error:
                "No data available. Please make sure the file has been uploaded and processed correctly.",
            };
          }

          let sum = 0;
          let count = 0;
          for (const row of data) {
            const value = row[userColumnName];
            if (typeof value === "number") {
              sum += value;
              count++;
            } else if (typeof value === "string") {
              const parsedValue = parseFloat(value);
              if (!isNaN(parsedValue)) {
                sum += parsedValue;
                count++;
              } else {
                console.warn(
                  `calculateAverageOfColumn: Invalid value encountered in column "${userColumnName}": ${value}`,
                );
                return {
                  error: `Invalid numeric value found in column "${userColumnName}". Check that the column contains only numbers or numeric strings. You may use analyzeColumnDataType to verify.`,
                };
              }
            } else {
              console.warn(
                `calculateAverageOfColumn: Unexpected data type in column "${userColumnName}": ${typeof value}`,
              );
              return {
                error: `Unexpected data type in column "${userColumnName}". Check that the column contains only numbers or numeric strings. You may use analyzeColumnDataType to verify.`,
              };
            }
          }

          if (count === 0) {
            console.warn(
              `calculateAverageOfColumn: No valid numeric data found in column "${userColumnName}"`,
            );
            return { error: `No valid numeric data found in column "${userColumnName}"` };
          }

          const average = sum / count;
          return { result: `The average of column "${userColumnName}" is: ${average}` };
        } catch (error) {
          console.error("calculateAverageOfColumn: An unexpected error occurred:", error);
          return { error: "An unexpected error occurred during average calculation." };
        }
      },
    }),
    calculateStandardDeviation: tool({
      description: "Computes the standard deviation of a numeric column.",
      parameters: z.object({
        columnType: z.string().describe("Mapped column type containing numbers"),
      }),
      execute: async ({ columnType }) => {
        try {
          if (!memory || !data) {
            console.error("calculateStandardDeviation: Memory or data not available.");
            return { error: "Memory or data not available." };
          }
          const columnMappings = memory.columnMappings || {};
          const userColumnName = columnMappings[columnType];
          if (!userColumnName) {
            console.warn(
              `calculateStandardDeviation: No column mapped for type "${columnType}".`,
            );
            return { error: `No column mapped for type "${columnType}".` };
          }

          const values = data
            .map((row) => Number(row[userColumnName]))
            .filter((v) => !isNaN(v));
          if (values.length === 0) {
            console.warn(
              `calculateStandardDeviation: No valid numeric data in "${userColumnName}".`,
            );
            return { error: `No valid numeric data in "${userColumnName}".` };
          }
          const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
          const variance =
            values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length;
          const stdDev = Math.sqrt(variance);
          return { result: `Standard deviation of "${userColumnName}" is: ${stdDev}` };
        } catch (error) {
          console.error(
            "calculateStandardDeviation: An unexpected error occurred:",
            error,
          );
          return {
            error: "An unexpected error occurred during standard deviation calculation.",
          };
        }
      },
    }),

    percentile: tool({
      description: "Calculates a specified percentile for a numeric column.",
      parameters: z.object({
        columnType: z.string().describe("Mapped column type containing numbers"),
        percentile: z.number().min(0).max(100).describe("Percentile value (0-100)"),
      }),
      execute: async ({ columnType, percentile }) => {
        try {
          if (!memory || !data) {
            console.error("percentile: Memory or data not available.");
            return { error: "Memory or data not available." };
          }
          const columnMappings = memory.columnMappings || {};
          const userColumnName = columnMappings[columnType];
          if (!userColumnName) {
            console.warn(`percentile: No column mapped for type "${columnType}".`);
            return { error: `No column mapped for type "${columnType}".` };
          }

          const values = data
            .map((row) => Number(row[userColumnName]))
            .filter((v) => !isNaN(v))
            .sort((a, b) => a - b);
          if (values.length === 0) {
            console.warn(`percentile: No valid numeric data in "${userColumnName}".`);
            return { error: `No valid numeric data in "${userColumnName}".` };
          }
          const index = (percentile / 100) * (values.length - 1);
          const lowerIndex = Math.floor(index),
            upperIndex = Math.ceil(index);
          const value =
            lowerIndex === upperIndex
              ? values[lowerIndex]
              : values[lowerIndex] +
                (index - lowerIndex) * (values[upperIndex] - values[lowerIndex]);
          return {
            result: `${percentile}th percentile of "${userColumnName}" is: ${value}`,
          };
        } catch (error) {
          console.error("percentile: An unexpected error occurred:", error);
          return { error: "An unexpected error occurred during percentile calculation." };
        }
      },
    }),

    lookupValue: tool({
      description:
        "Finds a value in a table based on a key, similar to VLOOKUP. The table must be provided as a JSON string representing an array of objects.",
      parameters: z.object({
        lookupColumnType: z.string().describe("Column type containing lookup keys"),
        table: z
          .string()
          .describe("JSON string representing the lookup table (an array of objects)"),
        returnColumn: z.string().describe("Column name to return from the table"),
      }),
      execute: async ({ lookupColumnType, table, returnColumn }) => {
        try {
          if (!memory || !data) {
            console.error("lookupValue: Memory or data not available.");
            return { error: "Memory or data not available." };
          }
          const columnMappings = memory.columnMappings || {};
          const lookupCol = columnMappings[lookupColumnType];
          if (!lookupCol) {
            console.warn(`lookupValue: No column mapped for type "${lookupColumnType}".`);
            return { error: `No column mapped for type "${lookupColumnType}".` };
          }

          // Parse the JSON string into an array of objects
          let tableData;
          try {
            tableData = JSON.parse(table);
            if (!Array.isArray(tableData)) {
              console.error("lookupValue: Table parameter must be an array.");
              return {
                error: "Table parameter must be a JSON string representing an array.",
              };
            }
          } catch (parseError) {
            console.error("lookupValue: Invalid JSON for table parameter:", parseError);
            return {
              error:
                "Invalid JSON for table parameter. Please provide a valid JSON string.",
            };
          }

          const newCol = `${lookupCol}_lookup_${returnColumn}`;
          data.forEach((row) => {
            const key = row[lookupCol];
            const match = tableData.find((t) => t[lookupCol] === key);
            row[newCol] = match ? match[returnColumn] : null;
          });
          return {
            result: `Looked up "${returnColumn}" values in new column "${newCol}".`,
          };
        } catch (error) {
          console.error("lookupValue: An unexpected error occurred:", error);
          return { error: "An unexpected error occurred during lookup." };
        }
      },
    }),

    getCellReference: tool({
      description: "Retrieves the value at a specific row and column.",
      parameters: z.object({
        rowIndex: z.number().int().min(1).describe("Row number (1-based)"),
        columnType: z.string().describe("Mapped column type"),
      }),
      execute: async ({ rowIndex, columnType }) => {
        try {
          if (!memory || !data) {
            console.error("getCellReference: Memory or data not available.");
            return { error: "Memory or data not available." };
          }
          const columnMappings = memory.columnMappings || {};
          const userColumnName = columnMappings[columnType];
          if (!userColumnName) {
            console.warn(`getCellReference: No column mapped for type "${columnType}".`);
            return { error: `No column mapped for type "${columnType}".` };
          }
          if (rowIndex > data.length) {
            console.warn(`getCellReference: Row ${rowIndex} exceeds data length.`);
            return { error: `Row ${rowIndex} exceeds data length.` };
          }

          const value = data[rowIndex - 1][userColumnName];
          return {
            result: `Value at row ${rowIndex}, column "${userColumnName}" is: ${value}`,
          };
        } catch (error) {
          console.error("getCellReference: An unexpected error occurred:", error);
          return {
            error: "An unexpected error occurred while retrieving the cell value.",
          };
        }
      },
    }),

    validateColumn: tool({
      description: "Validates that all values in a column meet a specified criterion.",
      parameters: z.object({
        columnType: z.string().describe("Mapped column type"),
        criteria: z
          .enum(["isNumber", "isDate", "notNull", "isPositive"])
          .describe("Validation rule"),
      }),
      execute: async ({ columnType, criteria }) => {
        try {
          if (!memory || !data) {
            console.error("validateColumn: Memory or data not available.");
            return { error: "Memory or data not available." };
          }
          const columnMappings = memory.columnMappings || {};
          const userColumnName = columnMappings[columnType];
          if (!userColumnName) {
            console.warn(`validateColumn: No column mapped for type "${columnType}".`);
            return { error: `No column mapped for type "${columnType}".` };
          }

          let invalidRows: number[] = [];

          if (criteria === "notNull") {
            invalidRows = data
              .map((row, idx) => (row[userColumnName] == null ? idx + 1 : null))
              .filter((v): v is number => v !== null); // Type predicate to filter out nulls
          } else if (criteria === "isNumber") {
            invalidRows = data
              .map((row, idx) => (isNaN(Number(row[userColumnName])) ? idx + 1 : null))
              .filter((v): v is number => v !== null);
          } else if (criteria === "isDate") {
            invalidRows = data
              .map((row, idx) =>
                isNaN(new Date(row[userColumnName]).getTime()) ? idx + 1 : null,
              )
              .filter((v): v is number => v !== null);
          } else if (criteria === "isPositive") {
            invalidRows = data
              .map((row, idx) => {
                const value = Number(row[userColumnName]);
                return typeof value === "number" && value <= 0 ? idx + 1 : null;
              })
              .filter((v): v is number => v !== null);
          }

          if (invalidRows.length) {
            return {
              error: `${invalidRows.length} rows have invalid values in "${userColumnName}" for criteria "${criteria}" at rows: ${invalidRows.join(", ")}`,
            };
          } else {
            return { result: `"${userColumnName}" validated as all ${criteria}.` };
          }
        } catch (error) {
          console.error("validateColumn: An unexpected error occurred:", error);
          return { error: "An unexpected error occurred during column validation." };
        }
      },
    }),
    calculateMedianOfColumn: tool({
      description: "Calculates the median value of a numeric column.",
      parameters: z.object({
        columnType: z.string().describe("Mapped column type"),
      }),
      execute: async ({ columnType }) => {
        try {
          if (!memory) {
            console.error(
              "calculateMedianOfColumn: Memory is not available. Required for column mapping.",
            );
            return { error: "Memory is not available. Required for column mapping." };
          }
          if (!data || !Array.isArray(data)) {
            console.error(
              "calculateMedianOfColumn: No data available. Please load a file first.",
            );
            return { error: "No data available. Please load a file first." };
          }

          const columnMappings = memory.columnMappings || {};
          const userColumnName = columnMappings[columnType];
          if (!userColumnName) {
            console.warn(
              `calculateMedianOfColumn: No column mapped for type "${columnType}". Use "assignColumn" first.`,
            );
            return {
              error: `No column mapped for type "${columnType}". Use "assignColumn" first.`,
            };
          }

          const values = data
            .map((row) => row[userColumnName])
            .filter((v) => typeof v === "number" && !isNaN(v));
          if (values.length === 0) {
            console.warn(
              `calculateMedianOfColumn: No valid numeric data in column "${userColumnName}".`,
            );
            return { error: `No valid numeric data in column "${userColumnName}".` };
          }

          values.sort((a, b) => a - b);
          const mid = Math.floor(values.length / 2);
          const median =
            values.length % 2 === 0 ? (values[mid - 1] + values[mid]) / 2 : values[mid];

          return { result: `The median of column "${userColumnName}" is: ${median}` };
        } catch (error) {
          console.error("calculateMedianOfColumn: An unexpected error occurred:", error);
          return { error: "An unexpected error occurred during median calculation." };
        }
      },
    }),
    describeColumn: tool({
      description:
        "Returns a summary of the provided column, including the min, max, mean and standard deviation",
      parameters: z.object({
        columnType: z.string().describe("Mapped column type"),
      }),
      execute: async ({ columnType }) => {
        try {
          if (!memory || !data) {
            console.error("describeColumn: Memory or data not available.");
            return { error: "Memory or data not available." };
          }

          const columnMappings = memory.columnMappings || {};
          const userColumnName = columnMappings[columnType];

          if (!userColumnName) {
            console.warn(`describeColumn: No column mapped for type "${columnType}".`);
            return { error: `No column mapped for type "${columnType}".` };
          }

          const values = data
            .map((row) => Number(row[userColumnName]))
            .filter((v) => !isNaN(v));

          if (values.length === 0) {
            console.warn(`describeColumn: No valid numeric data in "${userColumnName}".`);
            return { error: `No valid numeric data in "${userColumnName}".` };
          }

          const min = Math.min(...values);
          const max = Math.max(...values);
          const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
          const variance =
            values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length;
          const stdDev = Math.sqrt(variance);

          return {
            result: `Summary for "${userColumnName}": Min=${min}, Max=${max}, Mean=${mean}, StdDev=${stdDev}`,
          };
        } catch (error) {
          console.error("describeColumn: An unexpected error occurred:", error);
          return { error: "An unexpected error occurred during column description." };
        }
      },
    }),
    loadXLSXFile: tool({
      description: "Loads data from an XLSX file.",
      parameters: z.object({
        file: z.string().describe("The XLSX file to load (base64 encoded string)."),
        sheetName: z
          .string()
          .optional()
          .describe(
            "Optional: The name of the sheet to load. Defaults to the first sheet.",
          ),
      }),
      execute: async ({ file, sheetName }) => {
        try {
          const workbook = XLSX.read(file, { type: "base64" });
          const targetSheetName = sheetName || workbook.SheetNames[0];
          if (!targetSheetName) {
            return { error: "No sheet found in the XLSX file." };
          }

          const sheet = workbook.Sheets[targetSheetName];
          if (!sheet) {
            return { error: `Sheet "${targetSheetName}" not found in the XLSX file.` };
          }

          const newData = XLSX.utils.sheet_to_json(sheet);

          if (!Array.isArray(newData)) {
            console.error("loadXLSXFile: Could not convert XLSX to JSON.");
            return { error: "Could not convert XLSX to JSON." };
          }
          return { result: "XLSX file loaded successfully.", data: newData }; // Return the parsed data
        } catch (error) {
          console.error(
            "loadXLSXFile: An error occurred while loading the XLSX file:",
            error,
          );
          let errorMessage = "An error occurred while loading the XLSX file.";
          if (error instanceof Error) {
            errorMessage += ` Details: ${error.message}`;
          }
          return { error: errorMessage };
        }
      },
    }),
    detectGrowthPatterns: tool({
      description: "Analyzes a column for growth patterns (e.g., increasing trends).",
      parameters: z.object({
        columnType: z.string().describe("Mapped column type"),
      }),
      execute: async ({ columnType }) => {
        if (!memory || !data) {
          console.error("detectGrowthPatterns: Memory or data not available.");
          return { error: "Memory or data not available." };
        }
        const columnMappings = memory.columnMappings || {};
        const userColumnName = columnMappings[columnType];
        if (!userColumnName) {
          console.warn(
            `detectGrowthPatterns: No column mapped for type "${columnType}".`,
          );
          return { error: `No column mapped for type "${columnType}".` };
        }
        try {
          const values = data
            .map((row) => Number(row[userColumnName]))
            .filter((v) => !isNaN(v));

          if (values.length < 2) {
            return { result: "Not enough data to detect growth patterns." };
          }

          let increasing = true;
          for (let i = 1; i < values.length; i++) {
            if (values[i] <= values[i - 1]) {
              increasing = false;
              break;
            }
          }

          if (increasing) {
            return {
              result: `Detected an increasing trend in column "${userColumnName}".`,
            };
          } else {
            return {
              result: `No clear increasing trend detected in column "${userColumnName}".`,
            };
          }
        } catch (error) {
          console.error("detectGrowthPatterns: An error occurred:", error);
          return { error: "An error occurred during growth pattern detection." };
        }
      },
    }),
    findOutliers: tool({
      description: "Identifies outliers in a numeric column using the IQR method.",
      parameters: z.object({
        columnType: z.string().describe("Mapped column type"),
      }),
      execute: async ({ columnType }) => {
        if (!memory || !data) {
          console.error("findOutliers: Memory or data not available.");
          return { error: "Memory or data not available." };
        }

        const columnMappings = memory.columnMappings || {};
        const userColumnName = columnMappings[columnType];

        if (!userColumnName) {
          console.warn(`findOutliers: No column mapped for type "${columnType}".`);
          return { error: `No column mapped for type "${columnType}".` };
        }

        try {
          const values = data
            .map((row) => Number(row[userColumnName]))
            .filter((v) => !isNaN(v))
            .sort((a, b) => a - b);

          if (values.length < 4) {
            return { result: "Not enough data to identify outliers." };
          }

          const q1 = values[Math.floor(values.length / 4)];
          const q3 = values[Math.floor((3 * values.length) / 4)];
          const iqr = q3 - q1;
          const lowerBound = q1 - 1.5 * iqr;
          const upperBound = q3 + 1.5 * iqr;

          const outliers = values.filter((v) => v < lowerBound || v > upperBound);

          if (outliers.length > 0) {
            return {
              result: `Identified outliers in column "${userColumnName}": ${outliers.join(", ")}`,
            };
          } else {
            return { result: `No outliers detected in column "${userColumnName}".` };
          }
        } catch (error) {
          console.error("findOutliers: An unexpected error occurred:", error);
          return { error: "An unexpected error occurred during outlier detection." };
        }
      },
    }),
    generateInsights: tool({
      description: "Generates human-readable insights from data analysis.",
      parameters: z.object({
        analysis: z
          .string()
          .describe(
            "JSON string of the analysis results.  Must contain a 'summary' field with a textual summary of the analysis.",
          ),
      }),
      execute: async ({ analysis }) => {
        try {
          const analysisResults = JSON.parse(analysis);

          if (typeof analysisResults !== "object" || analysisResults === null) {
            return { error: "Invalid analysis format.  Must be a JSON object." };
          }

          if (typeof analysisResults.summary !== "string") {
            return {
              error:
                "Invalid analysis format. The JSON must contain a 'summary' field with a textual summary.",
            };
          }

          return { result: analysisResults.summary };
        } catch (error) {
          console.error("generateInsights: An unexpected error occurred:", error);
          return { error: "An unexpected error occurred during insight generation." };
        }
      },
    }),
  };

  for (const toolName in tools) {
    if (config?.excludeTools?.includes(toolName as AnalysisTools)) {
      delete tools[toolName as AnalysisTools];
    }
  }

  return tools;
};
