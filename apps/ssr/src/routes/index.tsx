import { createFileRoute, Link } from "@tanstack/react-router";
import { BarChart3, FileSpreadsheet } from "lucide-react";
import { useEffect, useRef } from "react";
import AvatarRow from "~/lib/components/avatar-row";
import { Pricing } from "~/lib/components/pricing";
export const Route = createFileRoute("/")({
  component: Hero,
  loader: ({ context }) => {
    return { user: context.user };
  },
});

function Hero() {
  const buttonRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);

  const { user } = Route.useLoaderData();

  useEffect(() => {
    if (!buttonRef.current || !gradientRef.current) return;

    // Get button dimensions once
    const width = buttonRef.current.clientWidth;
    const height = buttonRef.current.clientHeight;
    const perimeter = 2 * (width + height);

    // Calculate segment boundaries based on perimeter
    const s1 = width / perimeter; // Top side
    const s2 = (width + height) / perimeter; // Right side
    const s3 = (2 * width + height) / perimeter; // Bottom side

    let start = 0;
    const animateGradient = (timestamp: number) => {
      if (!gradientRef.current) return;
      if (start === 0) start = timestamp;

      // Progress cycles every 3 seconds (0 to 1)
      const progress = ((timestamp - start) % 4500) / 4500;

      let x, y;

      // Move along the border based on progress
      if (progress < s1) {
        // Top side: x from 0% to 100%, y = 0%
        const t = progress / s1;
        x = t * 100;
        y = 0;
      } else if (progress < s2) {
        // Right side: x = 100%, y from 0% to 100%
        const t = (progress - s1) / (s2 - s1);
        x = 100;
        y = t * 100;
      } else if (progress < s3) {
        // Bottom side: x from 100% to 0%, y = 100%
        const t = (progress - s2) / (s3 - s2);
        x = 100 - t * 100;
        y = 100;
      } else {
        // Left side: x = 0%, y from 100% to 0%
        const t = (progress - s3) / (1 - s3);
        x = 0;
        y = 100 - t * 100;
      }

      // Fixed size for the glow (adjust as needed)
      const sizeX = 20; // 10% of width
      const sizeY = 20; // 10% of height

      // Update gradient style
      gradientRef.current.style.background = `radial-gradient(${sizeX}% ${sizeY}% at ${x.toFixed(2)}% ${y.toFixed(2)}%, rgb(255,255,255) 0%, rgba(255,255,255,0) 100%)`;

      requestAnimationFrame(animateGradient);
    };

    requestAnimationFrame(animateGradient);
  }, []);

  return (
    <section className="relative min-h-screen w-full flex flex-col justify-center items-center bg-background text-foreground px-4 pt-20 pb-10">
      {/* Stats pill */}
      <div className="rounded-full border border-border px-4 py-1 ">
        <p className="text-center text-sm">
          {/* <b>1000+</b> formulas generated, so far. */}
          <b>free</b> right now!
        </p>
      </div>
      <div className="flex w-full justify-between items-center mb-8"></div>
      {/* Main heading */}
      <div className="max-w-4xl mx-auto text-center mb-8">
        <h1 className="text-2xl md:text-4xl font-bold mb-4 px-1">
          <span className="block">AI-Powered</span>
          <span className="bg-gradient-to-r from-teal-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
            Spreadsheet Automation
          </span>
          {/* <span className="block">Formulas, Charts & Data Insights.</span> */}
        </h1>
      </div>

      {/* Subheading */}
      {/* <p className="text-sm md:text-xl  text-center max-w-3xl mb-16 text-muted-foreground px-2">
        From generating complex formulas to creating charts and uncovering deep
        insights—streamline your spreadsheets with AI.
      </p> */}
      <p className="text-sm md:text-xl  text-center max-w-3xl mb-16 text-muted-foreground px-2">
        From generating complex formulas to uncovering deep insights—streamline your
        spreadsheets with AI.
      </p>

      {/* Users and CTA */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-16">
        <div className="flex flex-col items-center">
          <AvatarRow />
          <p className="text-lg mt-3">
            <b>5+ </b>happy users
          </p>
        </div>

        <Link to={user ? `/chat` : `/login`}>
          <div
            ref={buttonRef}
            className="relative flex border content-center bg-black/20 hover:bg-black/10 transition duration-500 dark:bg-white/20 items-center flex-col gap-10 h-min justify-center overflow-visible p-px decoration-clone w-fit rounded-full"
          >
            <div className="text-white z-100 bg-black rounded-[inherit] h-14 w-fit px-10 py-0 flex items-center space-x-2 group uppercase text-lg">
              <span className="text-white">Get Started</span>
            </div>

            {/* Animated radial gradient background */}
            <div
              ref={gradientRef}
              className="flex-none inset-0 overflow-hidden absolute z-0 rounded-[inherit]"
              style={{ filter: "blur(2px)", width: "100%", height: "100%" }}
            ></div>
            {/* Solid black overlay to create the border effect */}
            <div className="bg-black absolute z-1 inset-[2px] rounded-full"></div>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 w-full max-w-4xl">
        <div className="bg-green-900/75 rounded-xl p-4 flex flex-col items-center justify-center text-center">
          <FileSpreadsheet className="w-6 h-6 mb-2" />
          <h3 className="text-sm font-semibold">Spreadsheet Assistant</h3>
        </div>

        <div className="bg-secondary rounded-xl p-4 flex flex-col items-center justify-center text-center">
          <BarChart3 className="w-6 h-6 mb-2" />
          <h3 className="text-sm font-semibold">Data Analysis</h3>
          <p className="text-xs text-muted-foreground">Coming soon...</p>
        </div>

        <div className="bg-secondary rounded-xl p-4 flex flex-col items-center justify-center text-center">
          <BarChart3 className="w-6 h-6 mb-2" />
          <h3 className="text-sm font-semibold">Charts & Graphs</h3>
          <p className="text-xs text-muted-foreground">Coming soon...</p>
        </div>

        <div className="bg-secondary rounded-xl p-4 flex flex-col items-center justify-center text-center">
          <FileSpreadsheet className="w-6 h-6 mb-2" />
          <h3 className="text-sm font-semibold">Reports</h3>
          <p className="text-xs text-muted-foreground">Coming soon...</p>
        </div>
      </div>

      <Pricing />
    </section>
  );
}
