import { tool, type Tool } from "ai";
import HyperFormula from "hyperformula";
import { z } from "zod";

export type FormulaValidationTools = "evaluateFormula" | "checkFormulaSyntax";

export const formulaValidationTools = (config?: {
  excludeTools?: FormulaValidationTools[];
}): Partial<Record<FormulaValidationTools, Tool>> => {
  const tools: Partial<Record<FormulaValidationTools, Tool>> = {
    evaluateFormula: tool({
      description:
        "Evaluates an Excel formula with provided data using HyperFormula and returns the result or an error.",
      parameters: z.object({
        headers: z
          .array(z.string())
          .describe(
            "Array of strings representing the column headers of the Excel sheet.",
          ),
        dataRows: z
          .array(z.array(z.number()))
          .describe(
            "2D array representing the data rows of the Excel sheet. Each inner array is a row of numbers.",
          ),
        formula: z.string().describe("Excel formula to evaluate (e.g., '=SUM(A1:A2)')"),
      }),
      execute: async ({ headers, dataRows, formula }) => {
        try {
          const hfInstance = HyperFormula.buildEmpty({
            licenseKey: "internal-use-in-example",
          });
          const sheetName = hfInstance.addSheet("Sheet1");
          const sheetId = hfInstance.getSheetId(sheetName);

          if (sheetId === null || sheetId === undefined) {
            return { error: "Sheet was not found" };
          }

          // Combine headers and data rows into a single 2D array
          const data = [headers, ...dataRows];

          // Set sheet content with provided data
          hfInstance.setSheetContent(sheetId, data);
          const cellValue = hfInstance.calculateFormula(formula, sheetId);

          if (cellValue === null) {
            return { error: "Formula returned null" };
          }

          // Handle different types of return values
          if (
            typeof cellValue === "number" ||
            typeof cellValue === "string" ||
            typeof cellValue === "boolean"
          ) {
            return { result: cellValue };
          } else if (typeof cellValue === "object" && "error" in cellValue) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return { error: (cellValue as any).error };
          } else {
            return { error: `Unsupported formula output: ${JSON.stringify(cellValue)}` };
          }
        } catch (e) {
          return { error: `Error evaluating formula: ${(e as Error).message}` };
        }
      },
    }),

    checkFormulaSyntax: tool({
      description:
        "Checks the syntax of an Excel formula using HyperFormula and returns whether it is valid.",
      parameters: z.object({
        formula: z.string().describe("Excel formula to check (e.g., '=SUM(A1:A2)')"),
      }),
      execute: async ({ formula }) => {
        try {
          const hfInstance = HyperFormula.buildEmpty({
            licenseKey: "internal-use-in-example",
          });
          const sheetName = hfInstance.addSheet("Sheet1");
          const sheetId = hfInstance.getSheetId(sheetName);

          if (sheetId === null || sheetId === undefined) {
            return { isValid: false, error: "Sheet was not found" };
          }

          // Use default data to handle cell references
          const defaultData = [
            ["A", "B", "C"],
            [1, 2, 3],
            [4, 5, 6],
          ];
          hfInstance.setSheetContent(sheetId, defaultData);

          const cellValue = hfInstance.calculateFormula(formula, sheetId);
          if (cellValue === null) {
            return { isValid: false, error: "Formula returned null" };
          }

          if (typeof cellValue === "object" && "error" in cellValue) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return { isValid: false, error: (cellValue as any).error };
          }

          return { isValid: true };
        } catch (e) {
          return { isValid: false, error: `Syntax error: ${(e as Error).message}` };
        }
      },
    }),
  };

  // Exclude tools if specified in config
  if (config?.excludeTools) {
    for (const toolName of config.excludeTools) {
      delete tools[toolName];
    }
  }

  return tools;
};
