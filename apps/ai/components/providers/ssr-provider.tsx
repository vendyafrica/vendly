'use client'

import { useEffect, useState } from 'react'

interface SSRProviderProps {
  children: React.ReactNode
}

export function SSRProvider({ children }: SSRProviderProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Prevent hydration mismatch by not rendering until mounted
  if (!isMounted) {
    return null
  }

  return <>{children}</>
}
