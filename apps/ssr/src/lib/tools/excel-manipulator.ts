// import { tool } from "ai";
// import { exec } from "child_process";
// import * as fs from "fs/promises";
// import { promisify } from "util";
// import { z } from "zod";

// const execPromise = promisify(exec);

// export const excelAnalyzerManipulatorTool = tool({
//   description:
//     "Analyze and manipulate Excel data provided as CSV content, then generate a new .xlsx file with the result.",
//   parameters: z.object({
//     analysis: z
//       .string()
//       .describe(
//         "The analysis or manipulation to perform (e.g., 'summarize sales by region', 'sort by column A', 'filter rows where B > 10')",
//       ),
//     csvContent: z
//       .string()
//       .describe(
//         "The CSV content of the Excel file as a JSON string (provided in the conversation)",
//       ),
//     outputFile: z
//       .string()
//       .optional()
//       .default("result.xlsx")
//       .describe("The path to save the new .xlsx file"),
//   }),
//   execute: async ({ analysis, csvContent, outputFile }) => {
//     const tempCsvFile = `/tmp/temp-${Date.now()}.csv`;
//     const finalOutputFile = outputFile || `/tmp/result-${Date.now()}.xlsx`;

//     try {
//       // Parse the JSON CSV content back to CSV format
//       const data = JSON.parse(csvContent);
//       const csvLines = [Object.keys(data[0]).join(",")];
//       // ignore eslint any
//       data.forEach((row: any) => csvLines.push(Object.values(row).join(",")));
//       await fs.writeFile(tempCsvFile, csvLines.join("\n"));

//       // Generate Python code with pandas
//       let pandasCode = `import pandas as pd\n\n# Read CSV\ndf = pd.read_csv('${tempCsvFile}')\n\n`;

//       if (analysis.toLowerCase().includes("summarize")) {
//         const match = analysis.match(/summarize (\w+) by (\w+)/i);
//         if (match) {
//           const [_, valueCol, groupCol] = match;
//           pandasCode += `# Summarize ${valueCol} by ${groupCol}\ndf = df.groupby('${groupCol}')['${valueCol}'].sum().reset_index()\n`;
//         }
//       } else if (analysis.toLowerCase().includes("sort by")) {
//         const match = analysis.match(/sort by column (\w+)/i);
//         if (match) {
//           const column = match[1];
//           pandasCode += `# Sort by column ${column}\ndf = df.sort_values('${column}')\n`;
//         }
//       } else if (analysis.toLowerCase().includes("filter")) {
//         const match = analysis.match(/filter rows where (\w+) ([><=]) (\d+)/i);
//         if (match) {
//           const [_, column, operator, value] = match;
//           pandasCode += `# Filter rows where ${column} ${operator} ${value}\ndf = df[df['${column}'] ${operator} ${value}]\n`;
//         }
//       } else {
//         return { error: `Unsupported analysis: "${analysis}".` };
//       }

//       pandasCode += `\n# Save to .xlsx\ndf.to_excel('${finalOutputFile}', index=False)\n`;

//       // Write and execute the Python script
//       const scriptFile = `/tmp/script-${Date.now()}.py`;
//       await fs.writeFile(scriptFile, pandasCode);
//       await execPromise(`python3 ${scriptFile}`);

//       return {
//         message: `Processed '${analysis}' and saved result to '${finalOutputFile}'.`,
//         outputFile: finalOutputFile,
//       };
//     } catch (error) {
//       return {
//         error: `Failed to process: ${error instanceof Error ? error.message : String(error)}`,
//       };
//     } finally {
//       await fs.unlink(tempCsvFile).catch(() => {});
//     }
//   },
// });
