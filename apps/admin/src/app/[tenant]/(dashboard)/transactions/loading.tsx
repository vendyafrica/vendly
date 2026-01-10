import { Skeleton } from "@vendly/ui/components/skeleton"
import { Card, CardContent, CardHeader } from "@vendly/ui/components/card"

export default function TransactionsLoading() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <Skeleton className="h-8 w-[150px]" />
                    <Skeleton className="h-4 w-[250px] mt-2" />
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton className="h-9 w-[80px]" />
                    <Skeleton className="h-9 w-[80px]" />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <Skeleton className="h-4 w-[100px]" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-[100px]" />
                            <Skeleton className="h-3 w-[140px] mt-2" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="rounded-md border bg-card p-6">
                <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-4">
                            <Skeleton className="h-12 w-full" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
