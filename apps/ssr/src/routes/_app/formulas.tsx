import { createFileRoute } from "@tanstack/react-router";
import { FormulaGenerator } from "~/lib/components/generator-page";

export const Route = createFileRoute("/_app/formulas")({
  component: RouteComponent,
});

function RouteComponent() {
  return <FormulaGenerator />;
}
