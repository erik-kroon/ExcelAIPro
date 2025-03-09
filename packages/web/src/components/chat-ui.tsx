import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Send, Bot, User, Sparkles, Sun, Moon } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import { api } from "@/lib/hono";

type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
};

export default function ChatUI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

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

    // Add user message
    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: formatTime(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      // Using the user's API call pattern
      const response = await api.ai.chat.$post({ json: { message: input } });
      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiMessage = "";

      // Add an empty assistant message that will be updated
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "",
          timestamp: formatTime(),
        },
      ]);

      // Stream the response
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        aiMessage += chunk;

        // Update the last message with the new content
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
        "flex items-center justify-center min-h-screen p-4 transition-colors duration-200",
        theme === "dark" ? "dark bg-gray-900" : "bg-gray-50",
      )}
    >
      <Card className="w-full max-w-3xl h-[80vh] flex flex-col shadow-lg border-0 overflow-hidden">
        <ScrollArea className="flex-1 p-4">
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
                        <ReactMarkdown>{message.content}</ReactMarkdown>
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

        <Separator />

        <CardFooter className="p-4">
          <form onSubmit={handleSubmit} className="flex w-full gap-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              placeholder="Type your message..."
              className="flex-1 border-0 shadow-sm focus-visible:ring-1"
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="icon"
              disabled={isLoading || !input.trim()}
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
