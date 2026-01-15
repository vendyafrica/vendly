import { Skeleton } from "@vendly/ui/components/skeleton"
import { Card, CardContent, CardHeader } from "@vendly/ui/components/card"

export default function AnalyticsLoading() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <Skeleton className="h-8 w-[120px]" />
                    <Skeleton className="h-4 w-[250px] mt-2" />
                </div>
                <div className="flex gap-2">
                    <Skeleton className="h-9 w-[100px]" />
                    <Skeleton className="h-9 w-[120px]" />
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <Skeleton className="h-6 w-[150px]" />
                        <Skeleton className="h-4 w-[200px] mt-1" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-[350px] w-full" />
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <Skeleton className="h-6 w-[120px]" />
                        <Skeleton className="h-4 w-[180px] mt-1" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-[350px] w-full" />
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="col-span-1">
                    <CardHeader>
                        <Skeleton className="h-6 w-[150px]" />
                        <Skeleton className="h-4 w-[200px] mt-1" />
                    </CardHeader>
                    <CardContent>
                        <div className="h-[200px] w-full flex items-center justify-center">
                            <Skeleton className="h-[160px] w-[160px] rounded-full" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-2">
                    <CardHeader>
                        <Skeleton className="h-6 w-[150px]" />
                        <Skeleton className="h-4 w-[200px] mt-1" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="flex items-center">
                                    <Skeleton className="h-2 w-2 rounded-full mr-4" />
                                    <div className="space-y-2 flex-1">
                                        <Skeleton className="h-4 w-[150px]" />
                                        <Skeleton className="h-3 w-[200px]" />
                                    </div>
                                    <Skeleton className="h-3 w-[60px]" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
