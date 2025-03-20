import { useChat } from "@ai-sdk/react";

import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { FileSpreadsheet, FileText, Paperclip, Send, User, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Markdown } from "~/lib/components/markdown";
import { TextFilePreview } from "~/lib/components/text-file-preview";
import { Avatar, AvatarFallback } from "~/lib/components/ui/avatar";
import { Button } from "~/lib/components/ui/button";
import { Card, CardFooter } from "~/lib/components/ui/card";
import { Input } from "~/lib/components/ui/input";
import { ScrollArea } from "~/lib/components/ui/scroll-area";
import { cn, fileToDataUrl } from "~/lib/utils";

export const Route = createFileRoute("/_app/chat")({
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

    if (attachedFiles.length > 0) {
      try {
        // Generate data URLs for the processed files
        const dataUrls = await Promise.all(
          attachedFiles.map((file) => fileToDataUrl(file)),
        );

        // Create attachments with the processed files
        attachments = attachedFiles.map((file, index) => ({
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

    {
      const submitOptions: Parameters<typeof originalHandleSubmit>[1] = {
        allowEmptySubmit: true,
        experimental_attachments: attachments,
      };

      originalHandleSubmit(e, submitOptions);
    }
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
    <div {...getRootProps()} className="h-full w-full flex flex-col">
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

      <div className="px-6  h-full pt-2 flex  justify-center w-full  transition-colors duration-200">
        <Card className="w-full max-w-3xl flex flex-col border-0 py-0 shadow-none flex-1">
          <ScrollArea className="flex-1  overflow-y-auto">
            <div className="h-full space-y-2">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  className={cn(
                    "flex gap-3 items-start  ",
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
                      "flex flex-col max-w-[55%] ",
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
                        const fileName = attachment.name;

                        const fileIconColor = "text-green-400";
                        return (
                          <div
                            key={attachment.name}
                            className={cn(
                              "mt-4",
                              "bg-muted/70 p-1.5 text-secondary-foreground px-2 rounded-md cursor-pointer hover:bg-muted/90",
                              message.content.trim() === "" ? "mt-0" : "",
                            )}
                          >
                            <div className="flex items-center gap-2 pr-0.5">
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
                    <Avatar className="bg-muted rounded-full flex justify-center items-center p-1.5">
                      <FileSpreadsheet className="text-green-400" />
                    </Avatar>
                  </Avatar>
                  <div className="bg-gray-200/60 dark:bg-gray-800 rounded-2xl px-4 py-3">
                    <p className="text-gray-500">Thinking...</p>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          <CardFooter className="mt-0">
            <div className="flex-col w-full items-start ">
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
              <form
                onSubmit={handleSubmit}
                className="flex w-full gap-6 pb-6  items-center"
              >
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
                  className="border-1 text-start h-14 shadow-none"
                  disabled={isChatLoading}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={
                    isChatLoading || (!input.trim() && attachedFiles.length === 0)
                  }
                  className="rounded-full h-10 w-10 shrink-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
