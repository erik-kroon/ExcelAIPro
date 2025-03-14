import { useChat } from "@ai-sdk/react";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { FileText, Paperclip, Send, User, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { Markdown } from "~/lib/components/markdown";
import { Avatar, AvatarFallback, AvatarImage } from "~/lib/components/ui/avatar";
import { Button } from "~/lib/components/ui/button";
import { Card, CardFooter } from "~/lib/components/ui/card";
import { Input } from "~/lib/components/ui/input";
import { ScrollArea } from "~/lib/components/ui/scroll-area";
import { cn } from "~/lib/utils";
export const Route = createFileRoute("/chat")({
  component: RouteComponent,
  ssr: false,
});

function RouteComponent() {
  return <ChatUI />;
}

interface Attachment {
  name: string;
  contentType: string;
  url: string;
}

const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    console.log(XLSX.version);
  });

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
  } = useChat({ api: "http://localhost:3000/api/chat/$" });
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const isChatLoading = status === "submitted" || status === "streaming";
  const MAX_FILES = 3;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

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

    if (attachedFiles.length > 0) {
      try {
        // Process each file: convert .xlsx to .csv, keep .csv as-is
        const processedFiles = await Promise.all(
          attachedFiles.map(async (file) => {
            if (file.name.toLowerCase().endsWith(".xlsx")) {
              // Read the .xlsx file as an ArrayBuffer
              const arrayBuffer = await file.arrayBuffer();
              const workbook = XLSX.read(arrayBuffer, { type: "array" });
              const firstSheetName = workbook.SheetNames[0];
              const worksheet = workbook.Sheets[firstSheetName];
              const csvString = XLSX.utils.sheet_to_csv(worksheet);

              // Create a new File object with the CSV content
              return new File([csvString], file.name.replace(/\.xlsx$/i, "-xlsx.csv"), {
                type: "text/csv",
              });
            }
            // Return .csv files as-is
            return file;
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

    // Submit to the API with the processed attachments
    originalHandleSubmit(e, { experimental_attachments: attachments });
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
                    <Avatar>
                      <AvatarFallback className="bg-primary/10 text-primary">
                        AI
                      </AvatarFallback>
                      <AvatarImage src="/placeholder.svg?height=40&width=40" />
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
                      <div className="flex flex-col gap-4">
                        <Markdown>{message.content}</Markdown>
                      </div>
                      {message.experimental_attachments?.map((attachment) => (
                        <div key={attachment.name} className="mt-4">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-green-400" />
                            <span className="text-xs">{attachment.name}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {message.role === "user" && (
                    <Avatar>
                      <AvatarFallback className="bg-secondary text-secondary-foreground">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                      <AvatarImage src="/placeholder.svg?height=40&width=40" />
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
