'use client'

import { signOut } from 'next-auth/react'
import { Avatar, AvatarFallback } from '@vendly/ui/components/avatar'
import dynamic from 'next/dynamic'
import { LogOut, User } from 'lucide-react'
import { Session } from 'next-auth'

// Dynamically import DropdownMenu to avoid SSR hydration issues
const DropdownMenu = dynamic(
  () => import('@vendly/ui/components/dropdown-menu').then(mod => ({ default: mod.DropdownMenu })),
  { ssr: false }
)

const DropdownMenuTrigger = dynamic(
  () => import('@vendly/ui/components/dropdown-menu').then(mod => ({ default: mod.DropdownMenuTrigger })),
  { ssr: false }
)

const DropdownMenuContent = dynamic(
  () => import('@vendly/ui/components/dropdown-menu').then(mod => ({ default: mod.DropdownMenuContent })),
  { ssr: false }
)

const DropdownMenuItem = dynamic(
  () => import('@vendly/ui/components/dropdown-menu').then(mod => ({ default: mod.DropdownMenuItem })),
  { ssr: false }
)

const DropdownMenuLabel = dynamic(
  () => import('@vendly/ui/components/dropdown-menu').then(mod => ({ default: mod.DropdownMenuLabel })),
  { ssr: false }
)

const DropdownMenuSeparator = dynamic(
  () => import('@vendly/ui/components/dropdown-menu').then(mod => ({ default: mod.DropdownMenuSeparator })),
  { ssr: false }
)

interface UserNavProps {
  session: Session | null
}

export function UserNav({ session }: UserNavProps) {
  const initials =
    session?.user?.email?.split('@')[0]?.slice(0, 2)?.toUpperCase() || 'U'

  const isGuest = session?.user?.type === 'guest'
  const isSignedOut = !session

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative h-8 w-8 rounded-full border border-input bg-background hover:bg-accent hover:text-accent-foreground">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary text-primary-foreground">
            {isSignedOut ? <User className="h-4 w-4" /> : initials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {isSignedOut ? 'Not signed in' : isGuest ? 'Guest User' : 'User'}
            </p>
            {session?.user?.email && (
              <p className="text-xs leading-none text-muted-foreground">
                {session.user.email}
              </p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {(isGuest || isSignedOut) && (
          <>
            <DropdownMenuItem className="cursor-pointer" onClick={() => window.location.href = '/register'}>
              <span>Create Account</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => window.location.href = '/login'}>
              <span>Sign In</span>
            </DropdownMenuItem>
            {!isSignedOut && <DropdownMenuSeparator />}
          </>
        )}
        {!isSignedOut && (
          <DropdownMenuItem
            onClick={async () => {
              // Clear any local session data first
              await signOut({ callbackUrl: '/', redirect: true })
            }}
            className="cursor-pointer"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign out</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
