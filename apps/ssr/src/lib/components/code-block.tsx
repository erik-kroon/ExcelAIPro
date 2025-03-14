import type React from "react";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Badge } from "~/lib/components/ui/badge";
import { Button } from "~/lib/components/ui/button";
import { Card, CardContent } from "~/lib/components/ui/card";
import { cn } from "~/lib/utils";

interface CodeBlockProps {
  inline?: boolean;
  className?: string;
  children: React.ReactNode;
  [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export function CodeBlock({ inline, className, children, ...props }: CodeBlockProps) {
  const code = String(children).replace(/\n$/, "");
  const [copied, setCopied] = useState(false);

  const isExcelExpression = code.startsWith("=");

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
      <code
        className={cn("rounded bg-muted px-1.5 py-0.5 font-mono text-sm", className)}
        {...props}
      >
        {children}
      </code>
    );
  }

  if (!isExcelExpression) {
    return null;
  }

  return (
    <Card className="py-1 my-2 overflow-hidden border-2 border-green-400/40 bg-card shadow-sm">
      <CardContent className="relative p-0">
        <div className="flex items-center border-b border-b-muted-foreground/20 dark:border-b-muted  justify-between bg-card px-4 py-1 ">
          <Badge
            variant="outline"
            className="bg-green-500/10 text-green-600 dark:text-green-400"
          >
            Excel Formula
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={handleCopy}
            aria-label={copied ? "Copied" : "Copy code"}
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
        <div
          className={cn(
            "overflow-x-auto border-t font-mono text-sm border-t-muted-foreground/20 dark:border-t-muted ",
          )}
          {...props}
        >
          <code className="pl-4 py-2 bg-transparent flex items-center border-0">
            {children}
          </code>
        </div>
      </CardContent>
    </Card>
  );
}
