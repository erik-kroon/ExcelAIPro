import { LoginForm } from "@/components/login-form";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_unauthed/login")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <LoginForm />
    </div>
  );
}
