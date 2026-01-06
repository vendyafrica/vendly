"use client"

import * as React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@vendly/ui/components/avatar"
import { Button } from "@vendly/ui/components/button"
import { Input } from "@vendly/ui/components/input"
import { ScrollArea } from "@vendly/ui/components/scroll-area"
import { Separator } from "@vendly/ui/components/separator"
import { cn } from "@vendly/ui/lib/utils"

// Icons
const Icons = {
  Send: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="22" x2="11" y1="2" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  ),
  Search: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  ),
  MoreVertical: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" />
    </svg>
  ),
  Phone: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  Video: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m22 8-6 4 6 4V8Z" />
      <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
    </svg>
  ),
}

// Dummy Data
const conversations = [
  {
    id: 1,
    user: "Alice Smith",
    avatar: "https://i.pravatar.cc/150?u=alice",
    status: "online",
    lastMessage: "Hey, do you have the black jacket in size M?",
    time: "10:23 AM",
    unread: 2,
    messages: [
      { id: 1, text: "Hi there! I was looking at your leather jackets.", sender: "user", time: "10:20 AM" },
      { id: 2, text: "Hello Alice! Yes, we have a great collection. Which one caught your eye?", sender: "me", time: "10:21 AM" },
      { id: 3, text: "The classic biker one. Do you have the black jacket in size M?", sender: "user", time: "10:23 AM" },
    ]
  },
  {
    id: 2,
    user: "Bob Jones",
    avatar: "https://i.pravatar.cc/150?u=bob",
    status: "offline",
    lastMessage: "Thanks for the quick refund!",
    time: "Yesterday",
    unread: 0,
    messages: [
      { id: 1, text: "I need to return the shoes I bought.", sender: "user", time: "Yesterday" },
      { id: 2, text: "Sure thing, sorry they didn't fit. I've processed the refund.", sender: "me", time: "Yesterday" },
      { id: 3, text: "Thanks for the quick refund!", sender: "user", time: "Yesterday" },
    ]
  },
  {
    id: 3,
    user: "Charlie Day",
    avatar: "https://i.pravatar.cc/150?u=charlie",
    status: "online",
    lastMessage: "Is shipping to Canada free?",
    time: "Mon",
    unread: 0,
    messages: [
        { id: 1, text: "Is shipping to Canada free?", sender: "user", time: "Mon" },
    ]
  },
  {
    id: 4,
    user: "Dana Lee",
    avatar: "https://i.pravatar.cc/150?u=dana",
    status: "offline",
    lastMessage: "When will the sale end?",
    time: "Sun",
    unread: 1,
    messages: [
         { id: 1, text: "When will the sale end?", sender: "user", time: "Sun" },
    ]
  },
]

export default function MessagesPage() {
  const [selectedChatId, setSelectedChatId] = React.useState(conversations[0].id)
  const [inputText, setInputText] = React.useState("")
  
  const selectedChat = conversations.find(c => c.id === selectedChatId) || conversations[0]

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim()) return
    // In a real app, you'd add the message to the state here
    alert(`Sent: ${inputText}`)
    setInputText("")
  }

  return (
    <div className="flex h-[calc(100vh-2rem)] w-full overflow-hidden rounded-xl border bg-background shadow-sm">
      {/* Left Sidebar: Chat List */}
      <div className="flex w-80 flex-col border-r bg-muted/10">
        <div className="p-4 border-b space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold tracking-tight">Messages</h1>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Icons.MoreVertical className="h-4 w-4" />
            </Button>
          </div>
          <div className="relative">
            <Icons.Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
                placeholder="Search chats..." 
                className="pl-9 bg-background/50 border-input/50 focus:bg-background transition-colors"
            />
          </div>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="flex flex-col gap-0.5 p-2">
            {conversations.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setSelectedChatId(chat.id)}
                className={cn(
                  "flex items-start gap-4 rounded-lg p-3 text-left transition-all hover:bg-accent",
                  selectedChatId === chat.id ? "bg-accent" : "transparent"
                )}
              >
                <Avatar className="h-10 w-10 border">
                  <AvatarImage src={chat.avatar} alt={chat.user} />
                  <AvatarFallback>{chat.user.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-1 flex-col gap-1 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">{chat.user}</span>
                    <span className="text-xs text-muted-foreground tabular-nums">{chat.time}</span>
                  </div>
                  <p className="line-clamp-1 text-xs text-muted-foreground">
                    {chat.lastMessage}
                  </p>
                </div>
                {chat.unread > 0 && (
                   <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                     {chat.unread}
                   </span>
                )}
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Right Content: Chat Interface */}
      <div className="flex flex-1 flex-col bg-background">
        {/* Chat Header */}
        <div className="flex items-center justify-between border-b p-4">
            <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border shadow-sm">
                    <AvatarImage src={selectedChat.avatar} alt={selectedChat.user} />
                    <AvatarFallback>{selectedChat.user.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                    <h2 className="text-sm font-semibold">{selectedChat.user}</h2>
                    <div className="flex items-center gap-1.5">
                        <span className={cn(
                            "h-2 w-2 rounded-full", 
                            selectedChat.status === "online" ? "bg-green-500" : "bg-gray-300"
                        )} />
                        <span className="text-xs text-muted-foreground capitalize">{selectedChat.status}</span>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
                    <Icons.Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
                    <Icons.Video className="h-4 w-4" />
                </Button>
                <Separator orientation="vertical" className="mx-2 h-6" />
                <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
                    <Icons.MoreVertical className="h-4 w-4" />
                </Button>
            </div>
        </div>

        {/* Message Area */}
        <ScrollArea className="flex-1 p-4 bg-muted/5">
            <div className="flex flex-col gap-4 max-w-3xl mx-auto">
                {selectedChat.messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={cn(
                            "flex w-max max-w-[75%] flex-col gap-1 rounded-2xl px-4 py-2.5 text-sm shadow-sm",
                            msg.sender === "me"
                                ? "ml-auto bg-primary text-primary-foreground rounded-br-none"
                                : "bg-white dark:bg-muted border rounded-bl-none"
                        )}
                    >
                        <p>{msg.text}</p>
                        <span className={cn(
                            "text-[10px] self-end mt-0.5 opacity-70",
                            msg.sender === "me" ? "text-primary-foreground" : "text-muted-foreground"
                        )}>
                            {msg.time}
                        </span>
                    </div>
                ))}
            </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 border-t bg-background">
            <form onSubmit={handleSendMessage} className="flex gap-2 max-w-3xl mx-auto items-end">
                <Input
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)} 
                    placeholder="Type a message..."
                    className="flex-1 min-h-[44px] py-3 rounded-full bg-muted/30 border-muted-foreground/20 focus-visible:ring-offset-0 focus-visible:ring-1"
                />
                <Button type="submit" size="icon" className="h-[44px] w-[44px] rounded-full shadow-sm shrink-0">
                    <Icons.Send className="h-4 w-4" />
                    <span className="sr-only">Send</span>
                </Button>
            </form>
        </div>
      </div>
    </div>
  )
}
