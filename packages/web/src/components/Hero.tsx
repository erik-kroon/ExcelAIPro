import React, { useEffect, useRef } from "react";
import {
  ArrowRight,
  FileSpreadsheet,
  BarChart,
  Zap,
  Users,
  Cpu,
} from "lucide-react";

const Hero = () => {
  const statsRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  return (
    <section className="relative min-h-screen w-full flex flex-col justify-center items-center pt-20 overflow-hidden">
      {/* Decorative blurs */}
      <div className="absolute top-1/3 -right-20 w-80 h-80 bg-excel-orange/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-excel-purple/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl w-full mx-auto px-6 md:px-10 pt-20 z-10">
        <div className="text-center mb-8" ref={statsRef}>
          <div className="stats-pill">
            <Zap className="w-4 h-4 mr-2 text-excel-orange" />
            <span>30M+ formulas generated, so far.</span>
          </div>
        </div>

        <h1
          ref={titleRef}
          className="hero-title text-4xl md:text-6xl lg:text-7xl font-bold text-center max-w-5xl mx-auto leading-tight mb-8"
        >
          AI-Powered Spreadsheet Automation: Formulas, Charts & Data Insights.
        </h1>

        <p
          className="text-lg md:text-xl text-center mx-auto max-w-3xl mb-12 text-muted-foreground animate-fadeIn opacity-0"
          style={{ animationDelay: "0.6s" }}
        >
          From generating complex formulas to creating charts and uncovering
          deep insights—streamline your spreadsheets with AI.
        </p>

        <div
          className="flex flex-wrap items-center justify-center gap-4 mb-16 animate-fadeIn opacity-0"
          style={{ animationDelay: "0.8s" }}
        >
          <div className="flex -space-x-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center overflow-hidden"
              >
                <Users className="w-5 h-5 text-gray-600" />
              </div>
            ))}
          </div>
          <p className="text-lg font-medium">850k+ Happy users</p>
        </div>

        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20 animate-fadeIn opacity-0"
          style={{ animationDelay: "1s" }}
        >
          <button className="rounded-full bg-black text-white px-8 py-4 font-medium flex items-center justify-center gap-2 min-w-60 hover:bg-black/90 transition-all hover:translate-y-[-2px]">
            <span>Get Started</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Wavy line decoration */}
      <div className="wavy-line w-full absolute bottom-0 left-0 right-0 z-0 overflow-hidden">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,40 C320,100 420,0 740,40 C1060,80 1380,20 1440,40 L1440,120 L0,120 Z"
            fill="#49A3FF"
            fillOpacity="0.2"
          />
        </svg>
      </div>

      {/* Floating icons */}
      <div
        className="absolute top-1/4 right-[15%] animate-float"
        style={{ animationDelay: "0.2s" }}
      >
        <FileSpreadsheet className="w-12 h-12 text-excel-green opacity-60" />
      </div>

      <div
        className="absolute bottom-1/3 left-[15%] animate-float"
        style={{ animationDelay: "0.7s" }}
      >
        <BarChart className="w-10 h-10 text-excel-blue opacity-60" />
      </div>

      <div
        className="absolute top-2/3 right-[22%] animate-float"
        style={{ animationDelay: "1.2s" }}
      >
        <Cpu className="w-8 h-8 text-excel-purple opacity-60" />
      </div>
    </section>
  );
};

export default Hero;
