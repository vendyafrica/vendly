"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes"

function getTimeBasedTheme() {
  const now = new Date()
  const hour = now.getHours()

  // Dark mode between 6 PM (18:00) and 6 AM (06:00)
  return hour >= 18 || hour < 6 ? "dark" : "light"
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)

    // Set initial theme based on time if system preference is not available
    if (typeof window !== "undefined" && !window.matchMedia) {
      const timeTheme = getTimeBasedTheme()
      document.documentElement.classList.toggle("dark", timeTheme === "dark")
    }
  }, [])

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <NextThemesProvider
      {...props}
      defaultTheme={getTimeBasedTheme()}
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  )
}