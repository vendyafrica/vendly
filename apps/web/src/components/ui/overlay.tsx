"use client"

import { useEffect } from "react"
import { LoginForm } from "@/components/ui/login-form"

export function LoginOverlay({ onClose }: { onClose: () => void }) {
  // Close on ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md rounded-xl bg-white p-8 shadow-xl">
        <LoginForm />
      </div>
    </div>
  )
}
