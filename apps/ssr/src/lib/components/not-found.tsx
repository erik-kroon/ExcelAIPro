import { Link } from "@tanstack/react-router";
import { Button } from "./ui/button";

export function NotFound() {
  return (
    <div className="gap-4 h-screen flex flex-col items-center justify-center space-y-2">
      <h1 className=" text-8xl md:text-8xl font-bold tracking-tighter bg-gradient-to-br from-primary to-muted-foreground bg-clip-text text-transparent drop-shadow-sm">
        404
      </h1>
      <p>The page you are looking for does not exist.</p>
      <p className="flex flex-wrap items-center ">
        <Button type="button" onClick={() => window.history.back()}>
          Go back
        </Button>
        <Button asChild variant="secondary">
          <Link to="/">Home</Link>
        </Button>
      </p>
    </div>
  );
}
