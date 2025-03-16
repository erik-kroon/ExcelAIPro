import { useNavigate } from "@tanstack/react-router";
import { FileSpreadsheet, Link } from "lucide-react";
import { Route } from "~/routes/__root";
import authClient from "../auth-client";
import ThemeToggle from "./theme-toggle";
import { Button } from "./ui/button";
export const Navbar = () => {
  const { user, queryClient } = Route.useRouteContext();

  const navigate = useNavigate();

  const handleLogout = async () => {
    await authClient.signOut();
    queryClient.invalidateQueries({ queryKey: ["user"] });
    navigate({ to: "/login" });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-20 h-16 transition-all backdrop-blur-md shadow-border">
      <div className="flex items-center justify-between h-full mx-10 md:mx-20">
        <div className="text-xl flex h-14 items-center px-4 lg:h-[60px] lg:px-6">
          <Link to={"/"} className="flex gap-1 items-center relative font-semibold">
            <FileSpreadsheet className="w-8 h-8 text-green-400" />
            <span>
              ExcelAI<span className=" text-green-400">Pro</span>
            </span>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          {user ? (
            <Button
              className="relative cursor-pointer rounded-lg px-4  py-2  overflow-hidden group"
              onClick={async () => handleLogout()}
            >
              Logout
            </Button>
          ) : (
            <Button
              asChild
              className="relative cursor-pointer rounded-lg px-4  py-2  overflow-hidden group"
            >
              <Link to="/login">
                <span className="relative z-10">Login</span>
                <div className="absolute inset-0  from-green-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};
