import { Skeleton } from "@vendly/ui/components/skeleton"

export default function MessagesLoading() {
    return (
        <div className="flex flex-col h-full bg-background border rounded-lg shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b flex items-center justify-between">
                <div>
                    <Skeleton className="h-7 w-[150px]" />
                    <Skeleton className="h-4 w-[200px] mt-2" />
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-[80px]" />
                    <Skeleton className="h-8 w-8" />
                </div>
            </div>

            {/* Filters */}
            <div className="px-6 py-4 border-b bg-muted/5 flex items-center gap-2 overflow-x-auto no-scrollbar">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-7 w-[80px] rounded-full" />
                ))}
            </div>

            {/* Search */}
            <div className="px-6 py-3 border-b bg-muted/10">
                <Skeleton className="h-9 w-full" />
            </div>

            {/* Feed */}
            <div className="flex-1 overflow-hidden">
                <div className="flex flex-col">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div
                            key={i}
                            className="flex items-start gap-4 p-5 border-b border-border/50"
                        >
                            <Skeleton className="h-9 w-9 rounded-lg" />

                            <div className="flex-1 min-w-0 space-y-2 pt-0.5">
                                <div className="flex items-center justify-between gap-4">
                                    <Skeleton className="h-4 w-[150px]" />
                                    <Skeleton className="h-3 w-[50px]" />
                                </div>
                                <Skeleton className="h-3 w-[80%]" />
                                <div className="flex items-center gap-3 pt-1">
                                    <Skeleton className="h-3 w-[60px]" />
                                    <Skeleton className="h-3 w-[40px]" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
