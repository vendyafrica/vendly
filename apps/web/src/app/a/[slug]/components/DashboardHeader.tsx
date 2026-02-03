"use client";

import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@vendly/ui/components/avatar";
import { Button } from "@vendly/ui/components/button";
import { useAppSession } from "@/contexts/app-session-context";
import { Bell } from "lucide-react";

export function DashboardHeader({ title = "Dashboard" }: { title?: string }) {
  const { session } = useAppSession();

  const username = session?.user?.name || "Admin";
  const avatarUrl = session?.user?.image || "";

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b bg-background/80 px-4 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex items-center gap-2">
          <h1 className="truncate text-base font-semibold text-foreground">{title}:</h1>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
          <span className="font-semibold text-muted-foreground">Welcome back</span>
          <span className="truncate">{username}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon-sm" className="rounded-full">
          <Bell className="size-4" />
          <span className="sr-only">Notifications</span>
        </Button>

        <Avatar className="h-7 w-7">
          <AvatarImage src={avatarUrl} />
          <AvatarFallback className="text-xs font-semibold">
            {username.charAt(0) || "A"}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
