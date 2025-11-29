"use client";
import React, { useEffect, useState } from "react";
import { SidebarTrigger } from "@vendly/ui/components/sidebar";
import { Separator } from "@vendly/ui/components/separator";
import { Bell, Moon, Sun } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@vendly/ui/components/avatar";
import { Button } from "@vendly/ui/components/button";

export default function Header() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark" || (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    if (newIsDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 w-full items-center gap-4 border-b bg-background px-6 shadow-sm">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-2" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        {/* Added min-w-0 to allow text truncation if screen is tiny */}
        <div className="min-w-0">
          <h1 className="text-sm font-bold text-foreground leading-none truncate">Welcome back Jeremiah</h1>
          <p className="text-xs text-muted-foreground mt-1 truncate">Here's what's happening today</p>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground" onClick={toggleDarkMode}>
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
            <Bell className="h-5 w-5" />
        </Button>
        <Separator orientation="vertical" className="h-6 mx-1" />
        <Avatar className="h-9 w-9 cursor-pointer border border-border">
          <AvatarImage src="https://github.com/shadcn.png" alt="@jeremiah" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}