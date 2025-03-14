import { cn } from "@/lib/utils";
import { useState } from "react";

export function CodeBlock({
  node,
  inline,
  className,
  children,
  ...props
}: any) {
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
      <code className={className} {...props}>
        {children}
      </code>
    );
  }

  if (!isExcelExpression) {
    return null;
  }

  return (
    <div className="relative my-2">
      <pre
        className={cn(
          "overflow-x-auto border-1 bg-muted rounded-md p-2 text-sm ",
          className,
        )}
        {...props}
      >
        <code className=" text-center flex  items-center">{children}</code>
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
