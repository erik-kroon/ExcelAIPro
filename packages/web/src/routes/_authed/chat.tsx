import { createFileRoute } from "@tanstack/react-router";
import type React from "react";
import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { Card, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Send, User, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import { api } from "@/lib/hono";

export const Route = createFileRoute("/_authed/chat")({
  component: ChatUI,
});

type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
};

function CodeBlock({ node, inline, className, children, ...props }: any) {
  const code = String(children).replace(/\n$/, "");
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code", err);
    }
  };

  if (inline) {
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  }
  return (
    <div className="relative my-2">
      <pre
        className={cn(
          "overflow-x-auto border-1 bg-gray-100 rounded pb-2 text-sm ",
          className,
        )}
        {...props}
      >
        <code>{children}</code>
      </pre>
      <button
        onClick={handleCopy}
        className="absolute cursor-pointer top-2 right-2 bg-gray-300 text-xs px-2 py-1 rounded"
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}

export default function ChatUI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll within the messages area only.
  useLayoutEffect(() => {
    if (scrollAreaRef.current && messagesEndRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
      if (isAtBottom) {
        requestAnimationFrame(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        });
      }
    }
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const formatTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    setError(null);

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: formatTime(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const response = await api.ai.chat.$post({ json: { message: input } });
      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiMessage = "";

      // Insert an empty assistant message that will be updated.
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "", timestamp: formatTime() },
      ]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        aiMessage += chunk;
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].content = aiMessage;
          return newMessages;
        });
      }
    } catch (err: any) {
      setError(err.message || "An error occurred.");
      console.error("Chat submission error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center min-h-screen  transition-colors duration-200",
        theme === "dark" ? "dark bg-gray-900" : "bg-gray-50",
      )}
    >
      <Card className="py-0 w-full max-w-3xl h-k[80vh] flex flex-col  border-0 overflow-hidden">
        {/* Scrollable chat area */}
        <ScrollArea ref={scrollAreaRef} className="flex-1  overflow-y-auto">
          <div className="space-y-6">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4 text-muted-foreground">
                <Sparkles className="h-12 w-12 text-primary/50" />
                <div>
                  <p className="text-lg font-medium">
                    How can I help you today?
                  </p>
                  <p className="text-sm">
                    Ask me anything and I'll do my best to assist you.
                  </p>
                </div>
              </div>
            )}

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
                        : "bg-muted rounded-tl-none dark:bg-gray-800",
                    )}
                  >
                    {message.role === "assistant" ? (
                      <span className="prose dark:prose-invert prose-sm max-w-none">
                        <ReactMarkdown components={{ code: CodeBlock }}>
                          {message.content}
                        </ReactMarkdown>
                      </span>
                    ) : (
                      <p>{message.content}</p>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground mt-1 px-2">
                    {message.timestamp}
                  </span>
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

            {isLoading && (
              <div className="flex gap-3 items-start">
                <Avatar>
                  <AvatarFallback className="bg-primary/10 text-primary">
                    AI
                  </AvatarFallback>
                  <AvatarImage src="/placeholder.svg?height=40&width=40" />
                </Avatar>
                <div className="flex flex-col max-w-[80%]">
                  <div className="rounded-2xl px-4 py-3 bg-muted rounded-tl-none dark:bg-gray-800">
                    <div className="flex space-x-2">
                      <div
                        className="w-2 h-2 rounded-full bg-primary/40 animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 rounded-full bg-primary/40 animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 rounded-full bg-primary/40 animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground mt-1 px-2">
                    Typing...
                  </span>
                </div>
              </div>
            )}

            {error && (
              <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm">
                <p>Error: {error}</p>
                <p className="mt-1">Please try again or refresh the page.</p>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Keep the separator and input row static */}
        {/* <Separator className="flex-shrink-0" /> */}
        <CardFooter className="flex-shrink-0 ">
          <form onSubmit={handleSubmit} className="flex w-full gap-4">
            <Input
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              placeholder="Type your message..."
              className="flex-1 border-0 shadow-sm focus-visible:ring-1 h-14"
              disabled={isLoading}
            />
            <div className="flex items-center">
              <Button
                type="submit"
                size="icon"
                disabled={isLoading || !input.trim()}
                className="rounded-full h-10 w-10 shrink-0 flex justify-center items-center"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
