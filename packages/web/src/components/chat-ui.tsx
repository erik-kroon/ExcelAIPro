import type React from "react";
import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { Card, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, User, X, Paperclip, FileText } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import { CodeBlock } from "@/components/code-block";
import { useChat } from "@ai-sdk/react";
import { useDropzone } from "react-dropzone";

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
  });

export function ChatUI() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit: originalHandleSubmit,
    status,
  } = useChat({ api: "http://localhost:3000/api/chat" });
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

  useLayoutEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const isChatLoading = status === "submitted" || status === "streaming";

  const onDrop = (acceptedFiles: File[]) => {
    // Filter valid files
    const validFiles = acceptedFiles.filter(
      (file) =>
        file.name.toLowerCase().endsWith(".xlsx") ||
        file.name.toLowerCase().endsWith(".csv"),
    );

    if (validFiles.length !== acceptedFiles.length) {
      alert("Only .xlsx and .csv files are allowed.");
    }

    // Ensure we do not exceed 3 attachments
    const availableSlots = 3 - attachedFiles.length;
    if (availableSlots <= 0) {
      alert("You can only attach up to 3 files.");
      return;
    }

    if (validFiles.length > availableSlots) {
      alert(`Only ${availableSlots} file(s) can be added.`);
    }
    const filesToAdd = validFiles.slice(0, availableSlots);

    setAttachedFiles((prev) => [...prev, ...filesToAdd]);
  };

  // Wrap the whole UI with useDropzone.
  const { getRootProps, getInputProps, open, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
    multiple: true,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "text/csv": [".csv"],
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let attachments: Attachment[] = [];

    if (attachedFiles.length > 0) {
      try {
        const dataUrls = await Promise.all(
          attachedFiles.map((file) => fileToDataUrl(file)),
        );
        attachments = attachedFiles.map((file, index) => ({
          name: file.name,
          contentType: file.type,
          url: dataUrls[index],
        }));
      } catch (error) {
        console.error("Error converting files to data URLs:", error);
      }
    }

    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
    originalHandleSubmit(e, { experimental_attachments: attachments });
    setAttachedFiles([]);
  };

  // Clicking the paperclip triggers the file dialog via open()
  const handlePaperclipClick = () => {
    if (attachedFiles.length >= 3) {
      alert("You can only attach up to 3 files.");
      return;
    }
    open();
  };

  // Remove a file from the list
  const removeFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    // Wrap the whole UI in the dropzone container.
    <div {...getRootProps()} className="relative">
      {/* Always render the hidden input so open() works */}
      <input {...getInputProps()} style={{ display: "none" }} />

      {/* Render a fullscreen overlay when dragging */}
      {isDragActive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100/50">
          <div className="text-xl font-semibold text-gray-700">
            Drop your file(s) here
          </div>
        </div>
      )}

      <div className="flex items-start justify-center h-screen transition-colors duration-200">
        <Card className="pt-20 w-full min-h-screen max-w-3xl flex flex-col border-0 shadow-none overflow-hidden">
          <ScrollArea
            ref={scrollAreaRef}
            className="flex-1 h-full overflow-y-auto"
          >
            <div className="space-y-6">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex gap-3 items-start",
                    message.role === "user" ? "justify-end" : "justify-start",
                  )}
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
                          : "bg-gray-200/60 rounded-tl-none dark:bg-gray-800",
                      )}
                    >
                      {message.role === "assistant" ? (
                        <ReactMarkdown components={{ code: CodeBlock }}>
                          {message.content}
                        </ReactMarkdown>
                      ) : (
                        <p>{message.content}</p>
                      )}
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
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <CardFooter className="flex-shrink-0 pb-4 flex-col items-start space-y-2 ">
            {attachedFiles.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {attachedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="px-3 py-1 bg-gray-100 flex items-center justify-between rounded-xl"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-green-400" />
                      <span className="text-xs">{file.name}</span>
                    </div>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-2 w-2" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <form
              onSubmit={handleSubmit}
              className="flex w-full gap-4 items-center"
            >
              <Button
                type="button"
                size="icon"
                onClick={handlePaperclipClick}
                className="rounded-full cursor-pointer h-10 w-10 shrink-0"
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              <Input
                ref={inputRef}
                value={input}
                onChange={handleInputChange}
                placeholder="Type your message..."
                className="flex-1 border-1 text-start h-14 shadow-none"
                disabled={isChatLoading}
              />
              <Button
                type="submit"
                size="icon"
                disabled={isChatLoading || !input.trim()}
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
