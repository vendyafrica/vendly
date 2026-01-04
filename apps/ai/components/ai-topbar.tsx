'use client'

import { SidebarTrigger } from '@vendly/ui/components/sidebar'
import { useSession } from 'next-auth/react'
import { UserNav } from './user-nav'

export function AiTopbar() {
  const { data: session } = useSession()

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-3">
      <SidebarTrigger className="-ml-1" />
      <div className="flex-1" />
      <UserNav session={session} />
    </header>
  )
}
