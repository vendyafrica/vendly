'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import useSWR from 'swr'
import { API_URL } from '@/lib/constants'
import { AddSquareIcon, Message01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from "@hugeicons/react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@vendly/ui/components/sidebar'
import { buttonVariants } from '@vendly/ui/components/button'
import { cn } from '@vendly/ui/lib/utils'

/* ----------------------------- Types ----------------------------- */

interface V0Chat {
  id: string
  object: 'chat'
  name?: string
  messages?: Array<{
    role: 'user' | 'assistant'
    content: string
  }>
  createdAt: string
  updatedAt: string
}

interface ChatsResponse {
  data: V0Chat[]
}

/* ----------------------------- Utils ----------------------------- */

function getChatTitle(chat: V0Chat) {
  if (chat.name) return chat.name

  const firstUserMessage = chat.messages?.find(
    (m) => m.role === 'user'
  )?.content

  if (!firstUserMessage) return 'New chat'

  return firstUserMessage
    .replace(/\n/g, ' ')
    .replace(/[#_*`]/g, '')
    .slice(0, 40)
}

function sortByRecent(chats: V0Chat[]) {
  return [...chats].sort(
    (a, b) =>
      new Date(b.updatedAt).getTime() -
      new Date(a.updatedAt).getTime()
  )
}

/* ----------------------------- Component ----------------------------- */

export function AiSidebar() {
  const pathname = usePathname()

  const {
    data,
    isLoading,
    error,
  } = useSWR<ChatsResponse>(`${API_URL}/chats`)

  const chats = sortByRecent(data?.data || [])

  return (
    <Sidebar variant="inset" collapsible="icon">
      {/* ---------------- Header ---------------- */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip="New chat"
              render={<Link href="/?reset=true" />}
            >
              <HugeiconsIcon icon={AddSquareIcon} />
              <span className="font-medium">New Chat</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* ---------------- Content ---------------- */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Chats</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {/* Loading */}
              {isLoading && (
                <SidebarMenuItem>
                  <div className="px-2 py-2 text-xs text-muted-foreground">
                    Loading chats…
                  </div>
                </SidebarMenuItem>
              )}

              {/* Error */}
              {error && (
                <SidebarMenuItem>
                  <div className="px-2 py-2 text-xs text-destructive">
                    Failed to load chats
                  </div>
                </SidebarMenuItem>
              )}

              {/* Chats */}
              {chats.map((chat) => {
                const href = `/chats/${chat.id}`
                const isActive = pathname === href
                const title = getChatTitle(chat)

                return (
                  <SidebarMenuItem key={chat.id}>
                    <SidebarMenuButton
                      render={<Link href={href} />}
                      isActive={isActive}
                      tooltip={title}
                    >
                      <HugeiconsIcon icon={Message01Icon}
                        className={cn(
                          'h-4 w-4',
                          !isActive && 'text-muted-foreground'
                        )}
                      />
                      <span className="truncate">{title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}

              {/* Empty */}
              {!isLoading && chats.length === 0 && (
                <SidebarMenuItem>
                  <div className="px-2 py-2 text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
                    Start a conversation ✨
                  </div>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* ---------------- Mobile CTA ---------------- */}
      <div className="p-2 md:hidden">
        <Link
          href="/?reset=true"
          className={cn(
            buttonVariants({ size: 'sm' }),
            'w-full'
          )}
        >
          New Chat
        </Link>
      </div>
    </Sidebar>
  )
}
