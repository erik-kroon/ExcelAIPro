import { excelFunctions } from "./excel-functionts";
import { calculatorTools } from "./math";
import { formulaValidationTools } from "./validation";

export const tools = {
  ...formulaValidationTools({}),
  ...excelFunctions(),
  ...calculatorTools(),
};
