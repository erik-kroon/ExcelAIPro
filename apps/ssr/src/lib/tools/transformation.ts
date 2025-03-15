import { tool, type Tool } from "ai";
import { z } from "zod";

// Reused types from your existing code
interface Memory {
  columnMappings?: Record<string, string>;
}

interface DataRow {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

// Define the new tool types
export type TransformationTools =
  | "extractSubstring"
  | "cleanText"
  | "extractDatePart"
  | "dateDifference"
  | "applyCondition"
  | "pivotData"
  | "transposeData"
  | "filterRows"
  | "addCalculatedColumn"
  | "sortRows";
// | "handleMissingValues";

export const transformationTools = (
  config?: {
    excludeTools?: TransformationTools[];
  },
  data?: DataRow[],
  memory?: Memory,
): Partial<Record<TransformationTools, Tool>> => {
  const tools: Partial<Record<TransformationTools, Tool>> = {
    // 1. Text Manipulation
    extractSubstring: tool({
      description: "Extracts a substring from a specified column based on position.",
      parameters: z.object({
        columnType: z.string().describe("Mapped column type containing text"),
        startPosition: z
          .number()
          .int()
          .min(0)
          .describe("Starting index (0-based) for extraction"),
        length: z.number().int().min(1).describe("Number of characters to extract"),
      }),
      execute: async ({ columnType, startPosition, length }) => {
        if (!memory || !data) return { error: "Memory or data not available." };
        const columnMappings = memory.columnMappings || {};
        const userColumnName = columnMappings[columnType];
        if (!userColumnName)
          return { error: `No column mapped for type "${columnType}".` };

        data.forEach((row) => {
          const value = String(row[userColumnName] ?? "");
          row[userColumnName] = value.slice(startPosition, startPosition + length);
        });
        return {
          result: `Extracted substring from "${userColumnName}" (start: ${startPosition}, length: ${length}).`,
        };
      },
    }),

    cleanText: tool({
      description:
        "Cleans text in a column by removing extra spaces or applying transformations.",
      parameters: z.object({
        columnType: z.string().describe("Mapped column type containing text"),
        operation: z
          .enum(["trim", "removePunctuation", "toLowerCase"])
          .describe("Cleaning operation"),
      }),
      execute: async ({ columnType, operation }) => {
        if (!memory || !data) return { error: "Memory or data not available." };
        const columnMappings = memory.columnMappings || {};
        const userColumnName = columnMappings[columnType];
        if (!userColumnName)
          return { error: `No column mapped for type "${columnType}".` };

        data.forEach((row) => {
          let value = String(row[userColumnName] ?? "");
          switch (operation) {
            case "trim":
              value = value.trim();
              break;
            case "removePunctuation":
              value = value.replace(/[^\w\s]/g, "");
              break;
            case "toLowerCase":
              value = value.toLowerCase();
              break;
          }
          row[userColumnName] = value;
        });
        return { result: `Cleaned "${userColumnName}" with operation "${operation}".` };
      },
    }),

    // 2. Date and Time Operations
    extractDatePart: tool({
      description: "Extracts a part (day, month, year) from a date column.",
      parameters: z.object({
        columnType: z.string().describe("Mapped column type containing dates"),
        part: z.enum(["day", "month", "year"]).describe("Part to extract"),
      }),
      execute: async ({ columnType, part }) => {
        if (!memory || !data) return { error: "Memory or data not available." };
        const columnMappings = memory.columnMappings || {};
        const userColumnName = columnMappings[columnType];
        if (!userColumnName)
          return { error: `No column mapped for type "${columnType}".` };

        data.forEach((row) => {
          const dateValue = row[userColumnName];
          if (!dateValue) return; // Skip if the date value is null or undefined
          const date = new Date(dateValue);

          if (isNaN(date.getTime())) {
            row[userColumnName] = null; // Set to null if the date is invalid
            return;
          }

          row[userColumnName] =
            part === "day"
              ? date.getDate()
              : part === "month"
                ? date.getMonth() + 1
                : date.getFullYear();
        });
        return { result: `Extracted ${part} from "${userColumnName}".` };
      },
    }),

    dateDifference: tool({
      description:
        "Calculates the difference between two date columns in specified units.",
      parameters: z.object({
        columnType1: z.string().describe("First date column type"),
        columnType2: z.string().describe("Second date column type"),
        unit: z.enum(["days", "months", "years"]).describe("Unit of difference"),
      }),
      execute: async ({ columnType1, columnType2, unit }) => {
        if (!memory || !data) return { error: "Memory or data not available." };
        const columnMappings = memory.columnMappings || {};
        const col1 = columnMappings[columnType1],
          col2 = columnMappings[columnType2];
        if (!col1 || !col2) return { error: "One or both columns not mapped." };

        const newCol = `${col1}_to_${col2}_diff`;
        data.forEach((row) => {
          const date1Value = row[col1];
          const date2Value = row[col2];

          if (!date1Value || !date2Value) {
            row[newCol] = null;
            return;
          }

          const date1 = new Date(date1Value);
          const date2 = new Date(date2Value);

          if (isNaN(date1.getTime()) || isNaN(date2.getTime())) {
            row[newCol] = null;
            return;
          }

          const diffMs = date2.getTime() - date1.getTime();
          row[newCol] =
            unit === "days"
              ? diffMs / (1000 * 60 * 60 * 24)
              : unit === "months"
                ? diffMs / (1000 * 60 * 60 * 24 * 30)
                : diffMs / (1000 * 60 * 60 * 24 * 365);
        });
        return {
          result: `Calculated ${unit} difference between "${col1}" and "${col2}" in new column "${newCol}".`,
        };
      },
    }),

    // 5. Logical Operations
    applyCondition: tool({
      description:
        "Creates a new column based on a condition applied to an existing column.",
      parameters: z.object({
        condition: z.string().describe('Condition, e.g., "sales > 1000"'),
        newColumnType: z.string().describe("New column type for the result"),
      }),
      execute: async ({ condition, newColumnType }) => {
        if (!memory || !data) return { error: "Memory or data not available." };
        const columnMappings = memory.columnMappings || {};
        const [colType, operator, value] = condition.split(" ").map((s) => s.trim());
        const userColumnName = columnMappings[colType];
        if (!userColumnName) return { error: `No column mapped for type "${colType}".` };

        const newCol = columnMappings[newColumnType] || newColumnType; // Use existing or new name
        data.forEach((row) => {
          const cellValue = Number(row[userColumnName]);
          row[newCol] =
            operator === ">"
              ? cellValue > Number(value)
              : operator === "<"
                ? cellValue < Number(value)
                : operator === ">="
                  ? cellValue >= Number(value)
                  : operator === "<="
                    ? cellValue <= Number(value)
                    : operator === "==="
                      ? cellValue === Number(value)
                      : operator === "!=="
                        ? cellValue !== Number(value)
                        : false;
        });
        memory.columnMappings = { ...columnMappings, [newColumnType]: newCol };
        return { result: `Applied condition "${condition}" to create "${newCol}".` };
      },
    }),

    // 6. Data Transformation
    pivotData: tool({
      description:
        "Groups data by one column and aggregates another, like a pivot table.",
      parameters: z.object({
        groupByColumnType: z.string().describe("Column type to group by"),
        aggregateColumnType: z.string().describe("Column type to aggregate"),
        aggregation: z.enum(["sum", "average", "count"]).describe("Aggregation method"),
      }),
      execute: async ({ groupByColumnType, aggregateColumnType, aggregation }) => {
        if (!memory || !data) return { error: "Memory or data not available." };
        const columnMappings = memory.columnMappings || {};
        const groupCol = columnMappings[groupByColumnType];
        const aggCol = columnMappings[aggregateColumnType];
        if (!groupCol || !aggCol) return { error: "One or both columns not mapped." };

        const pivot: Record<string, number> = {};
        data.forEach((row) => {
          const groupValue = row[groupCol];
          const aggValue = Number(row[aggCol]) || 0;

          if (groupValue === undefined || groupValue === null) return;

          if (!(groupValue in pivot)) {
            pivot[groupValue] = aggregation === "count" ? 0 : 0;
          }

          switch (aggregation) {
            case "sum":
              pivot[groupValue] += aggValue;
              break;
            case "average":
              pivot[groupValue] += aggValue;
              break;
            case "count":
              pivot[groupValue]++;
              break;
          }
        });

        if (aggregation === "average") {
          const counts: Record<string, number> = {};
          data.forEach(
            (row) => (counts[row[groupCol]] = (counts[row[groupCol]] || 0) + 1),
          );
          for (const key in pivot) {
            pivot[key] /= counts[key] || 1; // Avoid division by zero
          }
        }

        const pivotTable = Object.entries(pivot).map(([key, value]) => ({
          [groupCol]: key,
          [aggregation]: value,
        }));

        // Clear existing data and push pivot table data
        if (data) {
          data.length = 0;
          data.push(...pivotTable);
        }
        return {
          result: `Created a pivot table, grouping by "${groupCol}" and aggregating "${aggCol}" using ${aggregation}.`,
        };
      },
    }),

    transposeData: tool({
      description: "Transposes rows into columns and vice versa.",
      parameters: z.object({}),
      execute: async () => {
        if (!data || !data.length) return { error: "No data available." };
        const headers = Object.keys(data[0]);
        const transposed = headers.map((header) => {
          const row: DataRow = { originalColumn: header };
          data.forEach((oldRow, rowIdx) => {
            row[`row${rowIdx + 1}`] = oldRow[header];
          });
          return row;
        });

        // Clear existing data and push transposed data
        if (data) {
          data.length = 0;
          data.push(...transposed);
        }
        return { result: "Data transposed successfully." };
      },
    }),

    filterRows: tool({
      description:
        "Filters rows in the dataset based on a condition applied to a column.",
      parameters: z.object({
        columnType: z.string().describe("Mapped column type to filter on"),
        condition: z
          .string()
          .describe('Condition as a string, e.g., "> 10", "=== \'value\'"'),
      }),
      execute: async ({ columnType, condition }) => {
        if (!memory) {
          return { error: "Memory is not available. Required for column mapping." };
        }
        if (!data || !Array.isArray(data)) {
          return { error: "No data available. Please load a file first." };
        }

        const columnMappings = memory.columnMappings || {};
        const userColumnName = columnMappings[columnType];
        if (!userColumnName) {
          return {
            error: `No column mapped for type "${columnType}". Use "assignColumn" first.`,
          };
        }

        // Simple condition parser (supports basic comparisons)
        const [operator, value] = condition.split(" ").map((s) => s.trim());
        const filteredData = data.filter((row) => {
          const cellValue = row[userColumnName];
          if (typeof cellValue === "number") {
            const numValue = Number(value);
            switch (operator) {
              case ">":
                return cellValue > numValue;
              case "<":
                return cellValue < numValue;
              case ">=":
                return cellValue >= numValue;
              case "<=":
                return cellValue <= numValue;
              case "===":
                return cellValue === numValue;
              case "!==":
                return cellValue !== numValue;
              default:
                return false;
            }
          } else {
            switch (operator) {
              case "===":
                return cellValue === value.replace(/['"]/g, "");
              case "!==":
                return cellValue !== value.replace(/['"]/g, "");
              default:
                return false; // Only string equality supported for non-numbers
            }
          }
        });

        // Update data in place
        if (data) {
          data.length = 0;
          data.push(...filteredData);
        }

        return {
          result: `Filtered to ${filteredData.length} rows where "${userColumnName}" ${condition}.`,
        };
      },
    }),

    addCalculatedColumn: tool({
      description:
        "Adds a new column with values computed from a formula (e.g., 'A + B').",
      parameters: z.object({
        newColumnType: z.string().describe("New column type to be added"),
        formula: z
          .string()
          .describe("Formula to calculate the new column, e.g., 'ColumnA + ColumnB'"),
      }),
      execute: async ({ newColumnType, formula }) => {
        if (!memory || !data) return { error: "Memory or data not available." };
        const columnMappings = memory.columnMappings || {};

        // Basic formula parsing (split by operators) - can be enhanced for complex formulas
        const operands = formula.split(/[\s+-/*]/).map((s) => s.trim());
        const operators = formula
          .split(/[A-Za-z0-9_]+/)
          .filter((s) => /[\s+-/*]/.test(s))
          .map((s) => s.trim());

        const userColumnNames = operands.map((operand) => {
          const colType = operand;
          const userColumnName = columnMappings[colType] || operand; // Use operand as column name if not mapped.
          if (!userColumnName)
            return { error: `No column mapped for type "${colType}".` };
          return userColumnName;
        });

        if (
          userColumnNames.some(
            (item) => typeof item === "object" && item !== null && "error" in item,
          )
        ) {
          return userColumnNames.find(
            (item) => typeof item === "object" && item !== null && "error" in item,
          );
        }
        const newCol = columnMappings[newColumnType] || newColumnType;
        memory.columnMappings = { ...columnMappings, [newColumnType]: newCol };

        data.forEach((row) => {
          let result;
          try {
            // Evaluate the formula based on available columns and operators
            result = operands.reduce((acc, _, index) => {
              const colName = userColumnNames[index] as string; //cast to string since we confirmed no errors exist.
              const value = Number(row[colName]) || 0; // Default to 0 if not a number.

              if (index === 0) {
                return value;
              }

              const operator = operators[index - 1];
              switch (operator) {
                case "+":
                  return acc + value;
                case "-":
                  return acc - value;
                case "*":
                  return acc * value;
                case "/":
                  return acc / value;
                default:
                  return acc; // Ignore invalid operators
              }
            }, 0);
          } catch (error) {
            console.log(error);
            result = null; // Handle errors during calculation
          }
          row[newCol] = result;
        });

        return {
          result: `Added calculated column "${newCol}" with formula "${formula}".`,
        };
      },
    }),

    sortRows: tool({
      description: "Sorts data by a column (e.g., ascending/descending).",
      parameters: z.object({
        columnType: z.string().describe("Mapped column type to sort on"),
        order: z.enum(["asc", "desc"]).describe("Sorting order (ascending/descending)"),
      }),
      execute: async ({ columnType, order }) => {
        if (!memory || !data) return { error: "Memory or data not available." };
        const columnMappings = memory.columnMappings || {};
        const userColumnName = columnMappings[columnType];
        if (!userColumnName)
          return { error: `No column mapped for type "${columnType}".` };

        data.sort((a, b) => {
          const valueA = a[userColumnName];
          const valueB = b[userColumnName];

          if (valueA < valueB) {
            return order === "asc" ? -1 : 1;
          }
          if (valueA > valueB) {
            return order === "asc" ? 1 : -1;
          }
          return 0; // Equal values
        });

        return { result: `Sorted data by "${userColumnName}" in ${order} order.` };
      },
    }),

    // handleMissingValues: tool({
    //   description: "Fills missing values in a column with a specified method.",
    //   parameters: z.object({
    //     columnType: z.string().describe("Mapped column type"),
    //     fillMethod: z
    //       .enum(["mean", "median", "specificValue"])
    //       .describe("Method for filling"),
    //     value: z
    //       .union([z.number(), z.string()])
    //       .optional()
    //       .describe('Specific value for "specificValue" method (number or string)'),
    //   }),
    //   execute: async ({ columnType, fillMethod, value }) => {
    //     if (!memory || !data) return { error: "Memory or data not available." };
    //     const columnMappings = memory.columnMappings || {};
    //     const userColumnName = columnMappings[columnType];
    //     if (!userColumnName)
    //       return { error: `No column mapped for type "${columnType}".` };

    //     let fillValue;
    //     if (fillMethod === "specificValue") {
    //       if (value === undefined) {
    //         return {
    //           error: 'Value must be provided when fillMethod is "specificValue".',
    //         };
    //       }
    //       fillValue = value; // Can be number or string as per schema
    //     } else {
    //       const numbers = data
    //         .map((row) => Number(row[userColumnName]))
    //         .filter((v) => !isNaN(v));
    //       if (!numbers.length) return { error: "No numeric data to compute fill value." };
    //       fillValue =
    //         fillMethod === "mean"
    //           ? numbers.reduce((sum, v) => sum + v, 0) / numbers.length
    //           : numbers.sort((a, b) => a - b)[Math.floor(numbers.length / 2)];
    //     }

    //     data.forEach((row) => {
    //       if (
    //         row[userColumnName] === undefined ||
    //         row[userColumnName] === null ||
    //         row[userColumnName] === ""
    //       ) {
    //         row[userColumnName] = fillValue;
    //       }
    //     });
    //     return {
    //       result: `Filled missing values in "${userColumnName}" with ${fillMethod}: ${fillValue}`,
    //     };
    //   },
    // }),
  };

  // Exclude tools as specified in config
  for (const toolName in tools) {
    if (config?.excludeTools?.includes(toolName as TransformationTools)) {
      delete tools[toolName as TransformationTools];
    }
  }

  return tools;
};
