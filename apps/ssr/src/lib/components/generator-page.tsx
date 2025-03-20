"use client";

import type React from "react";

// import { generateFormula } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Check, Copy, FileSpreadsheet, Sparkles } from "lucide-react";
import { useState } from "react";
import { cn } from "../utils";

export function FormulaGenerator() {
  const [prompt, setPrompt] = useState("");
  const [formula, setFormula] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedApp, setSelectedApp] = useState("excel");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    try {
      // const result = await generateFormula(prompt);
      //
      setFormula("result");
    } catch (error) {
      console.error("Failed to generate formula:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formula);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className=" flex justify-center">
      <div className="max-w-5xl flex flex-col items-center justify-center">
        {/* Left Column - Input */}
        <h1 className="text-3xl py-4  font-semibold">Formula generator</h1>

        <Card className=" p-3 md:px-6 md:max-w-lg lg:max-w-xl pt-0 border-0">
          <div className="space-y-6">
            <div className="border-1 bg-sidebar p-4 rounded-xl border-muted flex justify-evenly">
              {" "}
              <div className="w-full px-4  text-center">
                <label className="text-sm font-medium  mb-1.5 block">I am using...</label>
                <Select
                  defaultValue="excel"
                  value={selectedApp}
                  onValueChange={setSelectedApp}
                >
                  <SelectTrigger className="w-full bg-white">
                    <div className="flex items-center">
                      <FileSpreadsheet className="h-5 w-5 text-emerald-600 mr-2" />
                      <SelectValue placeholder="Select application"></SelectValue>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excel">
                      <div className="flex items-center">
                        <span>Excel</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="sheets">
                      <div className="flex items-center">
                        <span>Google Sheets</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="px-4 flex flex-col items-center text-center">
                <label className="text-sm font-medium mb-1.5 block">
                  I want the formula to be...
                </label>

                <Tabs defaultValue="generated" className="w-full">
                  <TabsList className="w-full justify-center gap-2">
                    <TabsTrigger value="generated">Generated</TabsTrigger>

                    <TabsTrigger value="explained">Explained</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
            <div className="border-1 bg-sidebar p-4 rounded-xl border-muted flex flex-col items-center justify-center ">
              <label htmlFor="prompt" className="text-sm    flex flex-col  text-left ">
                <span>Describe the formula you want to generate.</span>
                <span>Try to be as detailed as possible.</span>
                <div className="flex items-center pb-4 pt-2 gap-1.5 text-amber-600/85 text-xs flex-nowrap">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-4 w-4" />
                  </div>
                  <span className="text-xs">
                    Tip: Include column references and be specific about what you need.
                  </span>
                </div>
              </label>
              <div className="w-lg  flex items-center justify-center flex-row gap-4">
                <Textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="md:text-xs resize-none min-h-[72px] w-xs text-xs  overflow-x-hidden"
                />

                <Button
                  onClick={handleSubmit}
                  size="icon"
                  className="  border-4 p-8 justify-center cursor-pointer bg-sidebar text-muted-foreground/80 hover:text-muted-foreground  hover:bg-accent transition-200"
                  // disabled={isGenerating || !prompt.trim()}
                >
                  <Sparkles className="size-4 " />
                </Button>
              </div>
            </div>
          </div>

          <div className="border-1 bg-sidebar p-4 rounded-xl border-muted f gap-4 flex flex-row">
            <div className="bg-sidebar flex-grow rounded-md p-4 min-h-[140px] sm:px-6 font-mono text-sm overflow-auto">
              {formula || (
                <span className="text-muted-foreground italic">
                  Your generated formula will appear here
                </span>
              )}
            </div>
            <div className="">
              <Button
                onClick={copyToClipboard}
                disabled={!formula}
                className={cn(
                  "flex transition-all duration-200",
                  copied
                    ? "bg-accent text-white/60 hover:bg-accent/70"
                    : "bg-accent text-white/60 hover:bg-accent/70",
                )}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
