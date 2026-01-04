'use client'

import dynamic from 'next/dynamic'

interface NoSSRProps {
  children: React.ReactNode
}

export function NoSSR({ children }: NoSSRProps) {
  return <>{children}</>
}

// Create a dynamic version of DropdownMenu that skips SSR
export const DynamicDropdownMenu = dynamic(
  () => import('@vendly/ui/components/dropdown-menu').then(mod => ({ default: mod.DropdownMenu })),
  { ssr: false }
)
