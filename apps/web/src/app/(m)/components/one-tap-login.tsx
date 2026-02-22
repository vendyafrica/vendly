"use client";

import { useEffect } from "react";
import { signInWithOneTap } from "@vendly/auth/react";
import { useAppSession } from "@/contexts/app-session-context";

export function OneTapLogin() {
  const { session } = useAppSession();

  useEffect(() => {
    if (session?.user?.id) return;
    if (typeof window === "undefined") return;
    if (typeof navigator === "undefined") return;
    if (!window.isSecureContext && window.location.hostname !== "localhost") return;

    const timer = setTimeout(() => {
      signInWithOneTap().catch((err) => {
        if (err?.name === "IdentityCredentialError") return;
        console.error(err);
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [session?.user?.id]);

  return null;
}
