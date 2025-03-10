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
import { FileUploader } from "react-drag-drop-files";

const fileTypes = ["XLSX", "CSV"];

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
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    input,
    setInput,
    handleInputChange,
    handleSubmit: originalHandleSubmit,
    status,
  } = useChat({ api: "http://localhost:3000/api/chat" });

  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploadEnabled, setIsUploadEnabled] = useState(false);

  useLayoutEffect(() => {
    if (scrollAreaRef.current && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const isChatLoading = status === "submitted" || status === "streaming";

  const handleFileChange = (file: File) => {
    if (
      file.name.toLowerCase().endsWith(".xlsx") ||
      file.name.toLowerCase().endsWith(".csv")
    ) {
      setAttachedFile(file);
    } else {
      alert("Only .xlsx and .csv files are allowed.");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submitting message:", input);

    let attachments: Attachment[] = [];
    if (attachedFile) {
      try {
        const dataUrl = await fileToDataUrl(attachedFile);
        attachments = [
          {
            name: attachedFile.name,
            contentType: attachedFile.type,
            url: dataUrl,
          },
        ];
      } catch (error) {
        console.error("Error converting file to data URL:", error);
      }
    }

    originalHandleSubmit(e, { experimental_attachments: attachments });
    setAttachedFile(null);
  };

  const handlePaperclipClick = () => {
    setIsUploadEnabled(true);
    dropZoneRef.current?.click();
    setTimeout(() => dropZoneRef.current?.click(), 0);
  };

  return (
    <div className="flex items-center justify-center min-h-screen transition-colors duration-200">
      <Card className="pt-20 w-full min-h-screen max-w-3xl flex flex-col border-0 shadow-none overflow-hidden">
        <FileUploader
          handleChange={handleFileChange}
          name="file"
          types={fileTypes}
          disabled={!isUploadEnabled}
          hoverTitle="Drop here"
          onDraggingStateChange={(dragging: boolean) => {
            setIsDragging(dragging);
            if (dragging) setIsUploadEnabled(true);
            if (!dragging && attachedFile) setIsUploadEnabled(false);
          }}
          classes="flex-1"
        >
          <div
            ref={dropZoneRef}
            className={cn(
              "flex-1 flex flex-col",
              isDragging && "bg-gray-100/50",
            )}
          >
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
          </div>
        </FileUploader>

        <CardFooter className="flex-shrink-0 pb-4 flex-col items-start">
          {attachedFile && (
            <div className="px-3 py-1 bg-gray-100 flex items-center justify-between rounded-xl mb-2">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-400" />
                <span className="text-xs">{attachedFile.name}</span>
              </div>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => setAttachedFile(null)}
              >
                <X className="h-2 w-2" />
              </Button>
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
              className="rounded-full h-10 w-10 shrink-0"
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
  );
}
