import { z } from "zod";

// Define FileInfo interface with stricter typing
export interface FileInfo {
  type: string; // File extension (e.g., "xlsx", "csv")
  url?: string; // URL to access the file
  name: string; // File name
  contentType: string; // MIME type (e.g., "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
}

// Zod schemas for validation
const fileDetailsSchema = z
  .object({
    name: z.string().min(1, "File name cannot be empty"),
    contentType: z.string().min(1, "Content type cannot be empty"),
    url: z.string(),
  })
  .strict();

const fileInfoSchema = z
  .object({
    type: z.string().min(1),
    url: z.string().optional(),
    name: z.string().min(1),
    contentType: z.string().min(1),
  })
  .strict();

export const classificationSchema = z
  .object({
    message_subject_category: z.enum(
      [
        "formula_generation",
        "date_time_calculation",
        "financial_calculation",
        "power_query",
        "vba",
        "vague_query",
        "file-only input",
        "unrelated",
      ],
      {
        errorMap: () => ({ message: "Invalid classification category" }),
      },
    ),
    user_input: z.string(),
    file_present: z.boolean(),
    file_count: z.number().int().min(0),
    file_details: z.array(fileDetailsSchema).optional(),
  })
  .strict();

export type ClassificationResult = z.infer<typeof classificationSchema>;

// Message Types
type MessageRole = "user" | "assistant" | "system" | "data";

export interface Message {
  role: MessageRole;
  content: string;
  id: string;
  parts?: Array<{ type: string; text: string }>;
  experimental_attachments?: z.infer<typeof fileDetailsSchema>[];
}

// Helper Functions

/**
 * Extracts file details from a message and constructs a FileInfo object.
 * @param message - The message containing potential attachments
 * @returns FileInfo object if attachments exist, undefined otherwise
 * @throws Error if attachment data is malformed
 */
export function extractFileDetails(message: Message): FileInfo[] | undefined {
  try {
    if (!message.experimental_attachments?.length) {
      return undefined;
    }

    const attachments = message.experimental_attachments;
    if (attachments.length > 3) {
      console.warn("Too many attachments. Processing only the first 3.");
      attachments.length = 3;
    }

    return attachments.map((attachment) => {
      // First validate the incoming attachment structure
      const validatedAttachment = fileDetailsSchema.parse(attachment);

      // Extract file extension
      const fileExtension =
        validatedAttachment.name.split(".").pop()?.toLowerCase() || "";

      // Create FileInfo object with additional fields
      const fileInfo: FileInfo = {
        type: fileExtension,
        name: validatedAttachment.name,
        contentType: validatedAttachment.contentType,
      };

      // Validate the final FileInfo object
      return fileInfoSchema.parse(fileInfo);
    });
  } catch (error) {
    console.error("Error extracting file details:", error);
    throw new Error("Failed to process file attachment");
  }
}
/**
 * Builds a classification prompt for the AI model.
 * @param userInputText - The user's input text
 * @param fileInfo - Optional file information
 * @returns Formatted prompt string
 */
export function buildClassificationPrompt(
  userInputText: string,
  fileInfo?: FileInfo[],
): string {
  const categories = [
    "formula_generation",
    "date_time_calculation",
    "financial_calculation",
    "power_query",
    "vba",
    "vague_query",
    "File-Only Input",
    "Unrelated",
  ];

  const promptLines = [
    `Classify the user's intent based on the following question: "${userInputText.trim()}". Choose *one* of the following categories: ${categories.join(", ")}.  Return *only* the category name (e.g., "formula_generation").`,
    "Here are some examples:",
    '- "How do I use the SUM function?" → formula_generation',
    '- "Help with VLOOKUP formula" → formula_generation',
    '- "Formula for average" → formula_generation',
    '- "Calculate date difference" → date_time_calculation',
    '- "Date formatting issues" → date_time_calculation',
    '- "Add days to date" → date_time_calculation',
    '- "Calculate NPV in Excel" → financial_calculation',
    '- "IRR formula" → financial_calculation',
    '- "Financial model creation" → financial_calculation',
    '- "What is Power Query?" → power_query',
    '- "Import data with Power Query" → power_query',
    '- "Power Query tutorials" → power_query',
    '- "Start learning VBA" → vba',
    '- "VBA macro help" → vba',
    '- "VBA programming resources" → vba',
    '- "Need help with Excel" → vague_query',
    '- "Excel not working" → vague_query',
    '- "General Excel tips" → vague_query',
    '- "Open multiple files" → File-Only Input',
    '- "Save in different formats" → File-Only Input',
    '- "File management" → File-Only Input',
    '- "Computer problem help" → Unrelated',
    '- "Question about other software" → Unrelated',
    '- "General IT support" → Unrelated',
  ];

  if (fileInfo && fileInfo.length > 0) {
    promptLines.push(
      "The user also attached files. Consider the file content *only* if it changes the category of the question.",
      `File Count: ${fileInfo.length}`,
      `File Details:`,
    );
    fileInfo.forEach((file) => {
      promptLines.push(
        `- Name: ${file.name}`,
        `- Content Type: ${file.contentType}`,
        `- Type: ${file.type}`,
      );
    });
  } else {
    promptLines.push("No file is attached.");
  }

  return promptLines.join("\n");
}
