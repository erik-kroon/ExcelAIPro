import { useChat } from "@ai-sdk/react";
import { createFileRoute } from "@tanstack/react-router";
import { isValid, parse } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { FileSpreadsheet, FileText, Paperclip, Send, User, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Markdown } from "~/lib/components/markdown";
import { Avatar, AvatarFallback } from "~/lib/components/ui/avatar";
import { Button } from "~/lib/components/ui/button";
import { Card, CardFooter } from "~/lib/components/ui/card";
import { Input } from "~/lib/components/ui/input";
import { ScrollArea } from "~/lib/components/ui/scroll-area";
import { cn, fileToDataUrl } from "~/lib/utils";

export const Route = createFileRoute("/chat")({
  component: RouteComponent,
  ssr: false,
});

function RouteComponent() {
  return <ChatUI />;
}

export function ChatUI() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit: originalHandleSubmit,
    status,
  } = useChat({ api: `${import.meta.env.VITE_BASE_URL}/api/chat/$` });
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const isChatLoading = status === "submitted" || status === "streaming";
  const MAX_FILES = 3;

  const validateFiles = (files: File[]): File[] => {
    const validFiles = files.filter(
      (file) =>
        file.name.toLowerCase().endsWith(".xlsx") ||
        file.name.toLowerCase().endsWith(".csv"),
    );

    if (validFiles.length !== files.length) {
      toast.error("Only .xlsx and .csv files are allowed");
    }

    const availableSlots = MAX_FILES - attachedFiles.length;
    if (validFiles.length > availableSlots) {
      toast.warning(`Maximum ${MAX_FILES} files allowed. Taking first ${availableSlots}`);
      return validFiles.slice(0, availableSlots);
    }

    return validFiles;
  };

  const handlePaste = (event: React.ClipboardEvent) => {
    const items = event.clipboardData?.items;
    if (items) {
      const files = Array.from(items)
        .map((item) => item.getAsFile())
        .filter((file): file is File => file !== null);

      if (files.length > 0) {
        const validFiles = validateFiles(files);
        if (validFiles.length > 0) {
          setAttachedFiles((prev) => [...prev, ...validFiles]);
        }
      }
    }
  };

  const onDrop = (acceptedFiles: File[]) => {
    const validFiles = validateFiles(acceptedFiles);
    if (validFiles.length > 0) {
      setAttachedFiles((prev) => [...prev, ...validFiles]);
    }
    setIsDragging(false);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
    multiple: true,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "text/csv": [".csv"],
    },
    onDragOver: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let attachments: Attachment[] = [];
    const attachmentSchemas: { [key: string]: ColumnSchema[] } = {};

    if (attachedFiles.length > 0) {
      try {
        // Process each file: convert .xlsx to .csv, keep .csv as-is
        const processedFiles = await Promise.all(
          attachedFiles.map(async (file) => {
            let csvFile: File;

            if (file.name.toLowerCase().endsWith(".xlsx")) {
              // Read the .xlsx file as an ArrayBuffer
              const arrayBuffer = await file.arrayBuffer();
              const workbook = XLSX.read(arrayBuffer, { type: "array" });
              const firstSheetName = workbook.SheetNames[0];
              const worksheet = workbook.Sheets[firstSheetName];
              const csvString = XLSX.utils.sheet_to_csv(worksheet);

              // Create a new File object with the CSV content
              csvFile = new File(
                [csvString],
                file.name.replace(/\.xlsx$/i, "-xlsx.csv"),
                {
                  type: "text/csv",
                },
              );

              try {
                const schema = await generateSchema(file); // Generate schema for XLS
                attachmentSchemas[csvFile.name] = schema; // Store the schema with csvFile.name
              } catch (schemaError) {
                console.error("Error generating schema for XLSX:", schemaError);
                toast.error("Failed to generate schema for XLSX");
                return csvFile; // Keep csvFile instead of file
              }
            } else {
              // Return .csv files as-is
              csvFile = file;
              try {
                // const schema = await generateSchema(file); // Generate schema for csv
                // attachmentSchemas[csvFile.name] = schema; // Store the schema with csvFile.name
              } catch (schemaError) {
                console.error("Error generating schema for csv:", schemaError);
                toast.error("Failed to generate schema for csv");
                return csvFile; // keep csvFile instead of file
              }
            }
            return csvFile;
          }),
        );

        // Generate data URLs for the processed files
        const dataUrls = await Promise.all(
          processedFiles.map((file) => fileToDataUrl(file)),
        );

        // Create attachments with the processed files
        attachments = processedFiles.map((file, index) => ({
          name: file.name,
          contentType: file.type,
          url: dataUrls[index],
        }));
      } catch (error) {
        console.error("Error processing files:", error);
        toast.error("Failed to process attachments");
        return;
      }
    }

    // Submit to the API with the processed attachments and schemas
    // console.log(attachmentSchemas);
    originalHandleSubmit(e, {
      allowEmptySubmit: true,
      experimental_attachments: attachments,
      body: { schema: attachmentSchemas },
    });
    setAttachedFiles([]);
    inputRef.current?.focus();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const validFiles = validateFiles(Array.from(files));
      if (validFiles.length > 0) {
        setAttachedFiles((prev) => [...prev, ...validFiles]);
      }
    }
    e.target.value = ""; // Reset input value
  };

  const removeFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div {...getRootProps()} className="relative h-screen">
      <input {...getInputProps()} style={{ display: "none" }} />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept=".xlsx,.csv"
        multiple
        className="hidden"
      />

      <AnimatePresence>
        {isDragging && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100/90 dark:bg-gray-900/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-xl font-semibold text-gray-700 dark:text-gray-300">
              Drop your .xlsx or .csv files here
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-start justify-center h-full transition-colors duration-200">
        <Card className="pt-20 w-full min-h-screen max-w-3xl flex flex-col border-0 shadow-none">
          <ScrollArea className="flex-1 h-full overflow-y-auto">
            <div className="space-y-6 p-4">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  className={cn(
                    "flex gap-3 items-start",
                    message.role === "user" ? "justify-end" : "justify-start",
                  )}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {message.role === "assistant" && (
                    <Avatar className="bg-muted rounded-full flex justify-center items-center p-1.5">
                      <FileSpreadsheet className="text-green-400" />
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "flex flex-col max-w-[80%]",
                      message.role === "user" ? "items-end" : "items-start",
                    )}
                  >
                    <div
                      className={cn(
                        "rounded-2xl px-4 py-3",
                        message.role === "user"
                          ? "bg-primary text-primary-foreground rounded-tr-none"
                          : "bg-gray-200 rounded-tl-none dark:bg-gray-800 dark:text-gray-100 text-gray-900",
                      )}
                    >
                      <div className="flex flex-col gap-2">
                        <Markdown>{message.content}</Markdown>
                      </div>
                      {message.experimental_attachments?.map((attachment) => {
                        const isXlsxCsv = attachment?.name
                          ?.toLowerCase()
                          .endsWith("-xlsx.csv");
                        const fileName = isXlsxCsv
                          ? attachment?.name?.replace(/-xlsx\.csv$/i, ".xlsx")
                          : attachment.name;
                        const fileIconColor = isXlsxCsv
                          ? "text-green-400"
                          : "text-blue-400";
                        return (
                          <div
                            key={attachment.name}
                            className={cn(
                              "mt-4",
                              message.content.trim() === "" ? "mt-0" : "",
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <FileText className={`h-4 w-4 ${fileIconColor}`} />
                              <span className="text-xs">{fileName}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  {message.role === "user" && (
                    <Avatar>
                      <AvatarFallback className="bg-secondary text-secondary-foreground">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </motion.div>
              ))}
              {isChatLoading && messages[messages.length - 1]?.role === "user" && (
                <motion.div
                  className="flex gap-3 items-start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Avatar>
                    <AvatarFallback className="bg-primary/10 text-primary">
                      AI
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-gray-200/60 dark:bg-gray-800 rounded-2xl px-4 py-3">
                    <p className="text-gray-500">Thinking...</p>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <CardFooter className="flex-shrink-0 p-4 flex-col items-start space-y-2">
            <AnimatePresence>
              {attachedFiles.length > 0 && (
                <motion.div
                  className="flex flex-wrap gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {attachedFiles.map((file, index) => (
                    <motion.div
                      key={file.name}
                      className="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-xl"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                    >
                      <FileText className="h-5 w-5 text-green-400" />
                      <div className="flex-1">
                        <span className="text">{file.name}</span>
                        {file.name.toLowerCase().endsWith(".csv") && (
                          <TextFilePreview file={file} />
                        )}
                      </div>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => removeFile(index)}
                        className="h-6 w-6"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
            <form onSubmit={handleSubmit} className="flex w-full gap-4 items-center">
              <Button
                type="button"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-full h-10 w-10 shrink-0"
                disabled={attachedFiles.length >= MAX_FILES}
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              <Input
                ref={inputRef}
                value={input}
                onChange={handleInputChange}
                onPaste={handlePaste}
                placeholder="Type your message..."
                className="flex-1 border-1 text-start h-14 shadow-none"
                disabled={isChatLoading}
              />
              <Button
                type="submit"
                size="icon"
                disabled={isChatLoading || (!input.trim() && attachedFiles.length === 0)}
                className="rounded-full h-10 w-10 shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

interface ColumnSchema {
  column: string;
  dataType: string;
  columnLetter: string; // Added columnLetter
}

interface Attachment {
  name: string;
  contentType: string;
  url: string;
}
const generateSchema = async (file: File): Promise<ColumnSchema[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1");
        const headerRow = 0; // First row as header
        const sampleRows = 10; // Sample up to 10 rows

        const schema: ColumnSchema[] = [];
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const address = XLSX.utils.encode_cell({ r: headerRow, c: C });
          const cell = worksheet[address];
          const columnName = cell ? cell.v : `Column${C + 1}`;
          const columnLetter = XLSX.utils.encode_col(C);

          let dataType = "string"; // Default type

          // Helper to detect if a cell is a date based on Excel format

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const isDateCell = (cell: any) => {
            return cell.t === "n" && cell.z && XLSX.SSF.is_date(cell.z);
          };

          // Collect sample cells for this column
          const sampleCells = [];
          for (
            let r = headerRow + 1;
            r <= Math.min(headerRow + sampleRows, range.e.r);
            ++r
          ) {
            const cellAddress = XLSX.utils.encode_cell({ r: r, c: C });
            const sampleCell = worksheet[cellAddress];
            if (sampleCell) sampleCells.push(sampleCell);
          }

          // Step 1: Check if most cells are formatted as dates
          const dateCellCount = sampleCells.filter(isDateCell).length;
          if (sampleCells.length > 0 && dateCellCount / sampleCells.length > 0.5) {
            dataType = "date"; // Majority are date-formatted
          } else {
            // Step 2: Check formatted strings with isValidDate
            const formattedValues = sampleCells.map((cell) => cell.w || String(cell.v));
            if (
              formattedValues.every(
                (value) => typeof value === "string" && isValidDate(value),
              )
            ) {
              dataType = "date"; // All formatted values are valid dates
            } else {
              // Step 3: Check raw values for numbers or other types
              const rawValues = sampleCells.map((cell) => cell.v);
              if (rawValues.every((value) => !isNaN(Number(value)))) {
                dataType = "number"; // All raw values are numeric
              } else if (
                rawValues.every(
                  (value) =>
                    typeof value === "boolean" ||
                    (typeof value === "string" &&
                      (value.toLowerCase() === "true" ||
                        value.toLowerCase() === "false")),
                )
              ) {
                dataType = "boolean";
              }
            }
          }

          schema.push({ column: columnName, dataType, columnLetter });
        }
        resolve(schema);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};
// Your provided isValidDate function
function isValidDate(str: string | null | undefined): boolean {
  if (!str) return false;

  const formats = [
    "yyyy-MM-dd",
    "yyyy-MM-dd HH:mm:ss",
    "yyyy-MM-dd HH:mm",
    "yyyy/MM/dd",
    "yyyy/MM/dd HH:mm:ss",
    "yyyy/MM/dd HH:mm",
    "MM-dd-yyyy",
    "MM-dd-yyyy HH:mm:ss",
    "MM-dd-yyyy HH:mm",
    "MM/dd/yyyy",
    "MM/dd/yyyy HH:mm:ss",
    "MM/dd/yyyy HH:mm",
    "dd-MM-yyyy",
    "dd-MM-yyyy HH:mm:ss",
    "dd-MM-yyyy HH:mm",
    "dd/MM/yyyy",
    "dd/MM/yyyy HH:mm:ss",
    "dd/MM/yyyy HH:mm",
    "yyyyMMdd",
  ];

  return formats.some((format) => {
    const parsedDate = parse(str, format, new Date());
    return isValid(parsedDate);
  });
}

const TextFilePreview: React.FC<{ file: File }> = ({ file }) => {
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      setContent(typeof text === "string" ? text.slice(0, 100) : "");
    };
    reader.readAsText(file);
  }, [file]);

  return (
    <div className="text-xs text-gray-500">
      {content}
      {content.length >= 100 && "..."}
    </div>
  );
};
