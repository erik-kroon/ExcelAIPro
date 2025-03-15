import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "./code-block";
/* eslint-disable @typescript-eslint/no-explicit-any */
export const NonMemoizedMarkdown = ({ children }: { children: string }) => {
  const components = {
    code: ({ inline, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <CodeBlock
          language={match}
          className={`${className} text-sm bg-zinc-100 dark:bg-zinc-800 py-0.5 px-1 rounded`}
          {...props}
        >
          {children}
        </CodeBlock>
      ) : (
        // <pre
        //   {...props}
        //   className={`${className} text-sm w-[80dvw] md:max-w-[500px] overflow-x-scroll bg-zinc-100 p-2 rounded mt-2 dark:bg-zinc-800`}
        // >
        //   <code className={match[1]}>{children}</code>
        // </pre>
        <CodeBlock
          className={`${className} text-sm bg-zinc-100 dark:bg-zinc-800 py-0.5 px-1 rounded`}
          {...props}
        >
          {children}
        </CodeBlock>
      );
    },
    ol: ({ children, ...props }: any) => {
      return (
        <ol className="list-decimal list-inside ml-6 my-2" {...props}>
          {children}
        </ol>
      );
    },
    li: ({ children, ...props }: any) => {
      return (
        <li className="py-1" {...props}>
          {children}
        </li>
      );
    },
    ul: ({ children, ...props }: any) => {
      return (
        <ul className="list-decimal list-inside ml-4" {...props}>
          {children}
        </ul>
      );
    },
  };

  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {children}
    </ReactMarkdown>
  );
};

export const Markdown = React.memo(
  NonMemoizedMarkdown,
  (prevProps, nextProps) => prevProps.children === nextProps.children,
);
