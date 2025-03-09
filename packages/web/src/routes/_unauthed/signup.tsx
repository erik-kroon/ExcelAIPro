import { Navbar } from "@/components/Navbar";
import { SignUpForm } from "@/components/sign-up-form";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_unauthed/signup")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <SignUpForm />
    </div>
  );
}
