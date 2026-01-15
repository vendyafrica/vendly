"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
    Notification01Icon,
    PackageIcon,
    DeliveryTruck01Icon,
    CheckmarkCircle01Icon,
    CreditCardIcon,
    Search01Icon,
    ShoppingBag01Icon,
    MoreVerticalIcon,
    ArrowRight01Icon
} from "@hugeicons/core-free-icons"
import { Button } from "@vendly/ui/components/button"
import { Input } from "@vendly/ui/components/input"
import { ScrollArea } from "@vendly/ui/components/scroll-area"
import { cn } from "@vendly/ui/lib/utils"

export type NotificationType = 'ORDER_PLACED' | 'DELIVERY_OUT' | 'PAYMENT_RECEIVED' | 'ORDER_DELIVERED' | 'STOCK_LOW'

export interface Notification {
    id: string
    type: NotificationType
    title: string
    message: string
    time: string
    isRead: boolean
    data?: {
        orderId?: string
        amount?: string
        customerName?: string
        riderName?: string
        method?: string
    }
}

interface MessagesClientProps {
    notifications: Notification[]
}

export default function MessagesClient({ notifications }: MessagesClientProps) {
    const [filter, setFilter] = React.useState("all")

    const getIcon = (type: NotificationType) => {
        switch (type) {
            case 'ORDER_PLACED': return <HugeiconsIcon icon={ShoppingBag01Icon} className="h-4 w-4 text-blue-500" />
            case 'DELIVERY_OUT': return <HugeiconsIcon icon={DeliveryTruck01Icon} className="h-4 w-4 text-orange-500" />
            case 'PAYMENT_RECEIVED': return <HugeiconsIcon icon={CreditCardIcon} className="h-4 w-4 text-emerald-500" />
            case 'ORDER_DELIVERED': return <HugeiconsIcon icon={CheckmarkCircle01Icon} className="h-4 w-4 text-green-500" />
            case 'STOCK_LOW': return <HugeiconsIcon icon={PackageIcon} className="h-4 w-4 text-red-500" />
            default: return <HugeiconsIcon icon={Notification01Icon} className="h-4 w-4 text-muted-foreground" />
        }
    }

    const filteredNotifications = notifications.filter(n => {
        if (filter === 'all') return true
        if (filter === 'orders') return n.type === 'ORDER_PLACED' || n.type === 'ORDER_DELIVERED'
        if (filter === 'payments') return n.type === 'PAYMENT_RECEIVED'
        if (filter === 'deliveries') return n.type === 'DELIVERY_OUT'
        return true
    })

    return (
        <div className="flex flex-col h-full bg-background border rounded-lg shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold">Notifications</h1>
                    <p className="text-sm text-muted-foreground">Manage your store alerts</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="text-xs">Mark all read</Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <HugeiconsIcon icon={MoreVerticalIcon} className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="px-6 py-4 border-b bg-muted/5 flex items-center gap-2 overflow-x-auto no-scrollbar">
                {['all', 'orders', 'payments', 'deliveries'].map((t) => (
                    <button
                        key={t}
                        onClick={() => setFilter(t)}
                        className={cn(
                            "px-3 py-1 rounded-full text-xs font-medium border transition-colors",
                            filter === t
                                ? "bg-foreground text-background border-foreground whitespace-nowrap"
                                : "bg-background text-muted-foreground border-border hover:border-muted-foreground whitespace-nowrap"
                        )}
                    >
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                ))}
            </div>

            {/* Search */}
            <div className="px-6 py-3 border-b bg-muted/10">
                <div className="relative">
                    <HugeiconsIcon icon={Search01Icon} className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search activity..."
                        className="pl-9 h-9 text-xs bg-background border-none focus-visible:ring-1 focus-visible:ring-border"
                    />
                </div>
            </div>

            {/* Feed */}
            <ScrollArea className="flex-1">
                <div className="flex flex-col divide-y divide-border/50">
                    {filteredNotifications.map((n) => (
                        <div
                            key={n.id}
                            className={cn(
                                "group relative flex items-start gap-4 p-5 transition-colors hover:bg-muted/10",
                                !n.isRead && "bg-primary/[0.02]"
                            )}
                        >
                            {!n.isRead && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary" />}

                            <div className={cn(
                                "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border",
                                !n.isRead ? "bg-primary/5 border-primary/10" : "bg-background"
                            )}>
                                {getIcon(n.type)}
                            </div>

                            <div className="flex-1 min-w-0 space-y-1 pt-0.5">
                                <div className="flex items-center justify-between gap-4">
                                    <span className={cn(
                                        "text-sm font-semibold",
                                        !n.isRead ? "text-foreground" : "text-muted-foreground"
                                    )}>
                                        {n.title}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground tabular-nums whitespace-nowrap">
                                        {n.time.toUpperCase()}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    {n.message}
                                </p>

                                {n.data && (
                                    <div className="flex items-center gap-3 pt-1">
                                        {n.data.orderId && (
                                            <span className="text-[10px] font-mono font-bold text-primary">{n.data.orderId}</span>
                                        )}
                                        {n.data.amount && (
                                            <span className="text-[10px] font-medium">{n.data.amount}</span>
                                        )}
                                        {n.data.customerName && (
                                            <span className="text-[10px] text-muted-foreground">👤 {n.data.customerName}</span>
                                        )}
                                        {n.data.riderName && (
                                            <span className="text-[10px] text-muted-foreground">🚚 {n.data.riderName}</span>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="opacity-0 group-hover:opacity-100 transition-opacity self-center">
                                <HugeiconsIcon icon={ArrowRight01Icon} className="h-4 w-4 text-muted-foreground" />
                            </div>
                        </div>
                    ))}

                    {filteredNotifications.length === 0 && (
                        <div className="p-12 text-center">
                            <p className="text-sm text-muted-foreground font-medium">No alerts in this category</p>
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    )
}
