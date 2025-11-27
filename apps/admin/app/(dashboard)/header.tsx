"use strict";
import React from "react";
import { SidebarTrigger } from "@vendly/ui/components/sidebar";
import { Separator } from "@vendly/ui/components/separator";
import { Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@vendly/ui/components/avatar";
import { Button } from "@vendly/ui/components/button";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-16 w-full items-center gap-4 border-b bg-white px-6 shadow-sm">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-2" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        {/* Added min-w-0 to allow text truncation if screen is tiny */}
        <div className="min-w-0">
          <h1 className="text-sm font-bold text-gray-900 leading-none truncate">Welcome back Jeremiah</h1>
          <p className="text-xs text-gray-500 mt-1 truncate">Here's what's happening today</p>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-500 hover:text-gray-900">
            <Bell className="h-5 w-5" />
        </Button>
        <Separator orientation="vertical" className="h-6 mx-1" />
        <Avatar className="h-9 w-9 cursor-pointer border border-gray-200">
          <AvatarImage src="https://github.com/shadcn.png" alt="@jeremiah" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}