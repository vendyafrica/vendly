"use client"

import { useEffect } from "react"
import { LoginForm } from "@/app/(auth)/components/login-form"

export function LoginOverlay({ onClose }: { onClose: () => void }) {
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose()
        }
        window.addEventListener("keydown", handler)
        return () => window.removeEventListener("keydown", handler)
    }, [onClose])

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="relative z-10 w-full max-w-md rounded-xl bg-white p-8 shadow-xl">
                <LoginForm />
            </div>
        </div>
    )
}
