"use client";

import { useEffect } from "react";
import { signInWithOneTap } from "@vendly/auth/react";

export function OneTapLogin() {
    useEffect(() => {
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
    }, []);

    return null;
}
