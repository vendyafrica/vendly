import { Skeleton } from "@vendly/ui/components/skeleton"
import { Card, CardContent, CardHeader } from "@vendly/ui/components/card"

export default function Loading() {
    return (
        <div className="space-y-6 pt-2">
            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="pb-2">
                            <Skeleton className="h-4 w-[100px]" />
                            <Skeleton className="h-8 w-[60px] mt-2" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-3 w-[80px]" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Revenue Chart Skeleton */}
                <Card className="lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div>
                            <Skeleton className="h-4 w-[120px]" />
                            <Skeleton className="h-8 w-[180px] mt-2" />
                        </div>
                        <Skeleton className="h-8 w-[80px]" />
                    </CardHeader>
                    <CardContent className="pl-0">
                        <div className="h-[300px] w-full p-4">
                            <Skeleton className="h-full w-full" />
                        </div>
                    </CardContent>
                </Card>

                {/* Country Stats Skeleton */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-4">
                        <div>
                            <Skeleton className="h-4 w-[80px]" />
                            <Skeleton className="h-8 w-[100px] mt-2" />
                            <Skeleton className="h-3 w-[120px] mt-1" />
                        </div>
                        <Skeleton className="h-8 w-[80px]" />
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="h-6 w-6 rounded-full" />
                                        <Skeleton className="h-4 w-[100px]" />
                                    </div>
                                    <Skeleton className="h-4 w-[60px]" />
                                </div>
                                <Skeleton className="h-2 w-full rounded-full" />
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* Transactions Table Skeleton */}
            <Card>
                <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <Skeleton className="h-6 w-[180px]" />
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-10 w-[200px]" />
                        <Skeleton className="h-10 w-10" />
                        <Skeleton className="h-10 w-[80px]" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <Skeleton className="h-10 w-full" />
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex items-center space-x-4">
                                <Skeleton className="h-12 w-full" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
