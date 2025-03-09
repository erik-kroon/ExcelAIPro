import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FileSpreadsheet } from "lucide-react";
import { Navbar } from "@/components/Navbar";

export const Route = createFileRoute("/_unauthed/")({
  component: HomeComponent,
});

function HomeComponent() {
  return <></>;
}
