import { useEffect, useState } from "react";

export const TextFilePreview: React.FC<{ file: File }> = ({ file }) => {
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
