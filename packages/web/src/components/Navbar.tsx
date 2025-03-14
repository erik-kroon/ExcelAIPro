import React, { useState, useEffect } from "react";
import { FileSpreadsheet, Zap } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import { Link, useLoaderData, useNavigate } from "@tanstack/react-router";
import { auth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { qc } from "@/main";

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  // const data = useLoaderData({ from: "__root__" });
  // console.log(data);

  const { data, error } = useQuery({
    queryKey: ["user"],
    queryFn: () => auth.getSession(),
  });

  const handleLogout = async () => {
    await auth.signOut({
      fetchOptions: { onSuccess: () => navigate({ to: "/login" }) },
    });
    // qc.invalidateQueries({ queryKey: ["user"] });
    navigate({ to: "/login" });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-20 h-16 transition-all backdrop-blur-md ">
      <div className="flex items-center justify-between h-full mx-10 md:mx-20">
        <div className="text-xl flex h-14 items-center px-4 lg:h-[60px] lg:px-6">
          <Link
            to={"/"}
            // to={data?.data?.session ? "/chat" : "/"}
            className="flex gap-1 items-center relative font-semibold"
          >
            <FileSpreadsheet className="w-8 h-8 text-green-400" />
            <span>
              ExcelAI<span className=" text-green-400">Pro</span>
            </span>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <ModeToggle />
          {data?.data?.session ? (
            <Button
              className="relative cursor-pointer rounded-lg px-4  py-2  overflow-hidden group"
              onClick={async () => handleLogout()}
            >
              Logout
              {/* <span className="relative z-10">Logout</span> */}
              {/* <div className="absolute inset-0  from-green-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div> */}
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
