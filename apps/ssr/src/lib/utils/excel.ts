import { HyperFormula } from "hyperformula";
import * as XLSX from "xlsx";

export function processFormulaWithHyperFormula(
  data: (string | number)[][],
  formula: string,
): number | null {
  try {
    const hfInstance = HyperFormula.buildEmpty({
      licenseKey: "internal-use-in-example",
    });
    const sheetName = hfInstance.addSheet("Sheet1");
    const sheetId = hfInstance.getSheetId(sheetName);

    if (sheetId === null || sheetId === undefined) {
      console.error("Sheet was not found");
      return null;
    }

    hfInstance.setSheetContent(sheetId, data);
    const cellValue = hfInstance.calculateFormula(formula, sheetId);

    if (cellValue === null) {
      console.log("Formula returned null");
      return null;
    }

    if (typeof cellValue === "number") {
      return cellValue;
    } else if (typeof cellValue === "string") {
      const num = Number(cellValue);
      if (!isNaN(num)) return num;
      console.log("Formula returned non-numeric string:", cellValue);
      return null;
    } else if (typeof cellValue === "object" && "error" in cellValue) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      console.log("Formula error:", (cellValue as any).error);
      return null;
    } else {
      console.log("Unsupported formula output:", cellValue);
      return null;
    }
  } catch (e) {
    console.error("Error evaluating formula with HyperFormula:", e);
    return null;
  }
}

/**
 * Convert XLSX workbook to JavaScript arrays
 */
export function convertXlsxWorkbookToJavascriptArrays(workbook: XLSX.WorkBook) {
  const workbookData: { [sheetName: string]: (string | number | boolean | null)[][] } =
    {};

  workbook.SheetNames.forEach((sheetName) => {
    const worksheet = workbook.Sheets[sheetName];
    const sheetData: (string | number | boolean | null)[][] = [];
    const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1:A1");

    for (let rowNum = range.s.r; rowNum <= range.e.r; rowNum++) {
      const rowData: (string | number | boolean | null)[] = [];
      for (let colNum = range.s.c; colNum <= range.e.c; colNum++) {
        const cellAddress = XLSX.utils.encode_cell({ r: rowNum, c: colNum });
        const cell = worksheet[cellAddress];
        let cellData: string | number | boolean | null = null;

        if (cell) {
          if (cell.f) {
            cellData = `=${cell.f}`;
          } else if (typeof cell.v === "number") {
            cellData = cell.v;
          } else if (typeof cell.v === "boolean") {
            cellData = cell.v;
          } else {
            cellData = cell.v === null || cell.v === undefined ? null : String(cell.v);
          }
        }
        rowData.push(cellData);
      }
      sheetData.push(rowData);
    }
    workbookData[sheetName] = sheetData;
  });
  return workbookData;
}
