import { analysisTools } from "./analysis";
import { coreTools } from "./core";
import { exportTools } from "./export";
import { calculatorTools } from "./math";
import { transformationTools } from "./transformation";

export const tools = {
  ...calculatorTools(),
  ...coreTools(),
  ...exportTools(),
  ...transformationTools(),
  ...analysisTools(),
};
