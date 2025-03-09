import React, { useState, useEffect } from "react";
import { FileSpreadsheet, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import { Link, useNavigate } from "@tanstack/react-router";
import { auth } from "@/lib/auth";
import { useRouter } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { qc } from "@/main";

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  const { data, error } = useQuery({
    queryKey: ["user"],
    queryFn: () => auth.getSession(),
  });

  console.log(data);
  useEffect(() => {
    console.log(data);

    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  const handleLogout = async () => {
    await auth.signOut({
      fetchOptions: { onSuccess: () => navigate({ to: "/login" }) },
    });
    qc.invalidateQueries({ queryKey: ["user"] });
    navigate({ to: "/login" });
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out px-6 md:px-12 py-4",
        scrolled ? "glass-effect" : "bg-transparent",
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link
            to={data?.data?.session ? "/chat" : "/"}
            className="flex gap-1 items-center relative text-xl font-semibold"
          >
            <FileSpreadsheet className="w-8 h-8 text-green-400" />
            <span>
              ExcelAI<span className="text-green-400">Pro</span>
            </span>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <ModeToggle />
          {data?.data?.session ? (
            <Button
              className="w-24 cursor-pointer rounded-full    px-4 py-2"
              onClick={async () => handleLogout()}
            >
              Logout
            </Button>
          ) : (
            <Button
              asChild
              className="w-24 cursor-pointer rounded-full px-4 py-2"
            >
              <Link to="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};
