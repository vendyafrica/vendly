"use client";

import { useEffect } from "react";
import { signInWithOneTap } from "@vendly/auth/react";

export function OneTapLogin() {
    useEffect(() => {
        const timer = setTimeout(() => {
            signInWithOneTap().catch(console.error);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    return null;
}
