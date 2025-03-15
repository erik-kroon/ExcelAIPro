import { Label } from "@radix-ui/react-label";
import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import authClient from "~/lib/auth-client";
import { Button } from "~/lib/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/lib/components/ui/card";
import { Input } from "~/lib/components/ui/input";
import { cn } from "~/lib/utils";

export const Route = createFileRoute("/signup")({
  component: SignUpForm,
  beforeLoad: async ({ context }) => {
    if (context.user) {
      throw redirect({
        to: "/chat",
      });
    }
  },
});

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { error } = await authClient.signUp.email({
      email: email,
      password: password,
      name: email,
    });

    if (error) setError(error.message || "An error occurred during sign-up.");

    navigate({
      to: "/login",
    });
  };

  return (
    <div
      className={cn("flex min-h-screen items-center justify-center", className)}
      {...props}
    >
      <div className="mx-auto w-full max-w-sm">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Create an account</CardTitle>
            <CardDescription>Sign up with your email</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 mb-4">
              {/* <Button
                variant="outline"
                className="w-full"
                onClick={handleGoogleSignUp}
                disabled={isLoading}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="mr-2 h-4 w-4"
                >
                  <path
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                    fill="currentColor"
                  />
                </svg>
                Sign Up with Google
              </Button> */}
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-6">
                {/* <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                  <span className="relative z-10 bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div> */}
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex h-4 items-center justify-between ">
                      <Label htmlFor="password">Password</Label>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="new-password"
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Loading..." : "Sign Up"}
                  </Button>
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                </div>
                <div className="text-center text-sm">
                  Already have an account?{" "}
                  <Link to="/login" className="underline underline-offset-4">
                    Login
                  </Link>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
        <div className="fixed bottom-8 text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
          By continuing, you agree to our <a href="#">Terms of Service</a> and{" "}
          <a href="#">Privacy Policy</a>.
        </div>
      </div>
    </div>
  );
}
