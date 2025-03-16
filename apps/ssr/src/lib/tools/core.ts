import { tool, type Tool } from "ai";
import { z } from "zod";

export type CoreTools =
  | "assignColumn"
  | "useMappedColumn"
  | "analyzeColumnDataType"
  | "summarizeData"
  | "parseSchema";

// Define a type for the memory object
interface Memory {
  columnMappings?: Record<string, string>;
  fileId?: string; // Store the file identifier
}

// Define a type for the data object
interface DataRow {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

// In-memory data store (replace with a more persistent solution for production)
const dataStore: { [fileId: string]: DataRow[] } = {};

export const coreTools = (
  config?: {
    excludeTools?: CoreTools[];
  },
  data?: DataRow[], // Use the DataRow type for data
  memory?: Memory, // Use the Memory type for memory
): Partial<Record<CoreTools, Tool>> => {
  const tools: Partial<Record<CoreTools, Tool>> = {
    assignColumn: tool({
      description:
        "Assign a user-provided column name to a known column type. This associates a column name from a user-provided dataset with a standardized column type. Use this tool BEFORE performing calculations or analysis on data from the user's file to ensure accurate data mapping and analysis. The LLM should know the user's column names from previous interactions. Always map the column first for any subsequent calls to work",
      parameters: z.object({
        userColumnName: z
          .string()
          .describe(
            "The name of the column provided by the user, exactly as it appears in their file. Case-sensitive. This is the column name provided by the user in their file.",
          ),
        columnType: z
          .string()
          .describe(
            'The standardized type for this column. Choose a descriptive name that represents the type of information contained in the column (e.g., "customerName", "orderDate", "productPrice", "emailAddress"). This should be a generic description, not tied to a specific dataset or file. Use camelCase and avoid spaces or special characters.',
          ),
      }),
      execute: async ({ userColumnName, columnType }) => {
        if (!memory) {
          return {
            error:
              "Memory is not available.  This is required for assignColumn to work correctly.",
          };
        }
        // No longer declare here.
        const columnMappings = (memory.columnMappings as Record<string, string>) || {}; // Ensure type safety, avoid reassigning.  Use const here.
        columnMappings[columnType] = userColumnName;
        memory.columnMappings = columnMappings;
        return { result: `Column "${userColumnName}" assigned as type "${columnType}".` };
      },
    }),

    useMappedColumn: tool({
      description:
        "Retrieves the user-provided column name associated with a standardized column type. This is useful when you need to access data using the user-provided column name after it has been mapped. Use this to dynamically get the exact column name from a dataset that a specific value belongs to.",
      parameters: z.object({
        columnType: z
          .string()
          .describe(
            'The standardized column type for which you want to retrieve the user-provided column name. This must be a column type that has been previously assigned using the "assignColumn" tool.',
          ),
      }),
      execute: async ({ columnType }) => {
        if (!memory) {
          return {
            error:
              "Memory is not available.  This is required for useMappedColumn to work correctly.",
          };
        }
        const columnMappings = (memory.columnMappings as Record<string, string>) || {}; // Ensure type safety
        const userColumnName = columnMappings[columnType];

        if (!userColumnName) {
          return {
            error: `No user-provided column name found for column type "${columnType}". Please use the "assignColumn" tool first.`,
          };
        }

        return { result: userColumnName };
      },
    }),

    analyzeColumnDataType: tool({
      description:
        "Analyzes the data type of a column from the user's file and returns the inferred data type.  This helps determine the kind of data in the column and whether it can be used for specific calculations. Use this if you are unsure about the data type and before attempting calculations.",
      parameters: z.object({
        columnName: z
          .string()
          .describe(
            "The name of the column to analyze. This should be the user's column name, exactly as it appears in their file. It can be a column that has been previously assigned or a new column. Only analyze columns the user has mentioned.",
          ),
      }),
      execute: async ({ columnName }) => {
        if (!memory?.fileId) {
          return { error: "No file loaded. Please load a file first." };
        }

        const fileId = memory.fileId;
        const fileData = dataStore[fileId];

        if (!fileData || !Array.isArray(fileData) || fileData.length === 0) {
          return { error: "No data available or data is empty." };
        }

        // Sample multiple rows for data type inference
        const sampleSize = Math.min(5, fileData.length); // Sample up to 5 rows
        const sample = fileData.slice(0, sampleSize);

        let value: string | number | boolean | null | undefined = null;
        let allNull = true;

        for (let i = 0; i < sampleSize; i++) {
          if (columnName in sample[i]) {
            const cellValue = sample[i][columnName];
            if (cellValue !== null && cellValue !== undefined) {
              value = cellValue;
              allNull = false;
              break;
            }
          }
        }

        if (allNull) {
          return {
            result: `Column "${columnName}" exists, but all sampled values are null or undefined.`,
          };
        }

        if (!(columnName in sample[0])) {
          return { error: `Column "${columnName}" not found in the data.` };
        }

        let dataType: string; // Declare dataType with a type
        if (typeof value === "string") {
          if (!isNaN(Number(value))) {
            dataType = "number (string representation)";
          } else if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
            dataType = "date (string representation, YYYY-MM-DD)";
          } else if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
            dataType = "date (string representation, DD/MM/YYYY)";
          } else {
            dataType = "string"; // Explicitly set dataType to "string" for non-numeric and non-date strings
          }
        } else if (typeof value === "number") {
          if (Number.isInteger(value)) {
            dataType = "integer";
          } else {
            dataType = "float";
          }
        } else if (typeof value === "boolean") {
          dataType = "boolean";
        } else {
          dataType = typeof value; // Use the basic typeof for other types
        }

        return {
          result: `The inferred data type for column "${columnName}" is: ${dataType}`,
        };
      },
    }),
    parseSchema: tool({
      description:
        "Parses a schema from a JSON string and updates column mappings in memory.",
      parameters: z.object({
        schemaString: z
          .string()
          .describe(
            "A JSON string representing the schema.  The schema should be an object where keys are filenames and values are arrays of column definitions.",
          ),
      }),
      execute: async ({ schemaString }) => {
        if (!memory) {
          return { error: "Memory is not available." };
        }

        try {
          const schema = JSON.parse(schemaString) as Record<
            string,
            { column: string; dataType: string; columnLetter: string }[]
          >;

          const allowedDataTypes = [
            "string",
            "number",
            "date",
            "boolean",
            "integer",
            "float",
          ];

          if (!schema || typeof schema !== "object") {
            return {
              error: "Invalid schema format:  Schema must be a non-empty JSON object.",
            };
          }

          const newColumnMappings: Record<string, string> = {};

          for (const filename in schema) {
            if (Object.hasOwn(schema, filename)) {
              const columnDefinitions = schema[filename];

              if (!Array.isArray(columnDefinitions)) {
                return {
                  error: `Invalid schema format: Column definitions for "${filename}" must be an array.`,
                };
              }

              for (const columnDef of columnDefinitions) {
                if (
                  typeof columnDef !== "object" ||
                  !columnDef ||
                  typeof columnDef.column !== "string"
                ) {
                  return {
                    error: `Invalid schema format: Each column definition must be an object with a 'column' property (string).`,
                  };
                }

                if (
                  columnDef.dataType &&
                  !allowedDataTypes.includes(columnDef.dataType)
                ) {
                  return {
                    error: `Invalid schema format:  dataType "${columnDef.dataType}" is not allowed.  Allowed types are: ${allowedDataTypes.join(", ")}`,
                  };
                }

                newColumnMappings[columnDef.column] = columnDef.column; // Map column name to itself initially
              }
            }
          }

          // Update memory with the new column mappings
          memory.columnMappings = { ...memory.columnMappings, ...newColumnMappings };

          return {
            result: `Successfully parsed schema and updated column mappings. Found columns: ${Object.keys(
              newColumnMappings,
            ).join(", ")}`,
          };
        } catch (error) {
          console.error("Schema parsing error:", error);
          return { error: `Failed to parse schema: ${error}` };
        }
      },
    }),
    summarizeData: tool({
      description: "Returns basic statistics about the data.",
      parameters: z.object({}),
      execute: async () => {
        if (!data || !Array.isArray(data)) {
          return { error: "No data available. Please load a file first." };
        }

        const rowCount = data.length;
        let columnCount = 0;
        if (data[0]) {
          columnCount = Object.keys(data[0]).length;
        }

        const nullCounts: Record<string, number> = {};
        if (data[0]) {
          for (const column of Object.keys(data[0])) {
            nullCounts[column] = data.reduce(
              (count, row) =>
                row[column] === null || row[column] === undefined ? count + 1 : count,
              0,
            );
          }
        }

        const nullValueSummary = Object.entries(nullCounts)
          .map(([column, count]) => `${count} missing values in column ${column}`)
          .join(", ");

        return {
          result: `This file has ${rowCount} rows, ${columnCount} columns, with ${nullValueSummary || "no missing values"}`,
        };
      },
    }),
  };

  for (const toolName in tools) {
    if (config?.excludeTools?.includes(toolName as CoreTools)) {
      delete tools[toolName as CoreTools];
    }
  }

  return tools;
};
