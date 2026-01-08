import { Skeleton } from "@vendly/ui/components/skeleton";
import { cn } from "@vendly/ui/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function CategoryTitleSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("inline-flex items-center ml-9 mb-4", className)}>
      <Skeleton className="h-8 w-32" />
      <Skeleton className="ml-2 w-4 h-4" />
    </div>
  );
}

export function StoreImageSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("bg-white rounded-3xl overflow-hidden shadow-sm", className)}>
      <div className="aspect-square relative">
        <Skeleton className="w-full h-full" />
      </div>
    </div>
  );
}

export function StoreInfoSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("flex items-center justify-between mt-3 px-1", className)}>
      {/* Profile Picture and Store Name */}
      <div className="flex items-center gap-2">
        <Skeleton className="w-6 h-6 rounded-full" />
        <Skeleton className="h-4 w-20" />
      </div>
      
      {/* Rating */}
      <div className="flex items-center gap-1">
        <Skeleton className="h-4 w-6" />
        <Skeleton className="w-3.5 h-3.5 rounded-full" />
      </div>
    </div>
  );
}

export function PageHeaderSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("px-4 sm:px-6 lg:px-8 py-6", className)}>
      <Skeleton className="h-12 w-48 mb-6" />
    </div>
  );
}
