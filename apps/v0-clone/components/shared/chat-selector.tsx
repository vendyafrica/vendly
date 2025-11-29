"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  MessageSquare,
  MoreHorizontal,
  Edit2,
  Trash2,
  Copy,
  ExternalLink,
  Eye,
  EyeOff,
  Users,
  Lock,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@vendly/ui/components/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@vendly/ui/components/dialog";
import { Button } from "@vendly/ui/components/button";
import { Input } from "@vendly/ui/components/input";

interface Chat {
  id: string;
  name?: string;
  privacy?: "public" | "private" | "team" | "team-edit" | "unlisted";
  createdAt: string;
  url?: string;
}

// Helper function to get display name for a chat
const getChatDisplayName = (chat: Chat): string => {
  return chat.name || `Chat ${chat.id.slice(0, 8)}...`;
};

// Helper function to get privacy icon
const getPrivacyIcon = (privacy: string) => {
  switch (privacy) {
    case "public":
      return <Eye className="h-4 w-4" />;
    case "private":
      return <EyeOff className="h-4 w-4" />;
    case "team":
    case "team-edit":
      return <Users className="h-4 w-4" />;
    case "unlisted":
      return <Lock className="h-4 w-4" />;
    default:
      return <EyeOff className="h-4 w-4" />;
  }
};

// Helper function to get privacy display name
const getPrivacyDisplayName = (privacy: string) => {
  switch (privacy) {
    case "public":
      return "Public";
    case "private":
      return "Private";
    case "team":
      return "Team";
    case "team-edit":
      return "Team Edit";
    case "unlisted":
      return "Unlisted";
    default:
      return "Private";
  }
};

export function ChatSelector() {
  // Authentication removed - component disabled
  return null;
}
