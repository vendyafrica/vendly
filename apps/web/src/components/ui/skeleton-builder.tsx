import { cn } from "@vendly/ui/lib/utils";
import { 
  CategoryTitleSkeleton, 
  StoreImageSkeleton, 
  StoreInfoSkeleton, 
  PageHeaderSkeleton 
} from "@/components/ui/skeleton-parts";

interface SkeletonBuilderProps {
  type: "category-title" | "store-card" | "store-grid" | "page-header" | "custom";
  count?: number;
  className?: string;
  mobileCount?: number;
  desktopCount?: number;
  children?: React.ReactNode;
}

export function SkeletonBuilder({ 
  type, 
  count = 1, 
  className,
  mobileCount = 6,
  desktopCount = 10,
  children 
}: SkeletonBuilderProps) {
  
  const renderSkeleton = () => {
    switch (type) {
      case "category-title":
        return <CategoryTitleSkeleton className={className} />;
        
      case "store-card":
        return (
          <div className="group">
            <StoreImageSkeleton />
            <StoreInfoSkeleton />
          </div>
        );
        
      case "store-grid":
        return (
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            {/* Mobile: 2 columns */}
            <div className="grid grid-cols-2 gap-4 md:hidden">
              {Array.from({ length: mobileCount }).map((_, index) => (
                <div key={index} className="group">
                  <StoreImageSkeleton />
                  <StoreInfoSkeleton />
                </div>
              ))}
            </div>

            {/* Desktop/Tablet: 5 columns */}
            <div className="hidden md:block">
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-5 gap-4">
                  {Array.from({ length: desktopCount }).map((_, index) => (
                    <div key={index} className="group">
                      <StoreImageSkeleton />
                      <StoreInfoSkeleton />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
        
      case "page-header":
        return <PageHeaderSkeleton className={className} />;
        
      case "custom":
        return children;
        
      default:
        return null;
    }
  };

  if (count === 1) {
    return renderSkeleton();
  }

  return (
    <div className={cn("space-y-4", className)}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>{renderSkeleton()}</div>
      ))}
    </div>
  );
}

// Preset combinations for common use cases
export function MarketplaceSectionSkeleton() {
  return (
    <section className="mb-12">
      <CategoryTitleSkeleton />
      <SkeletonBuilder type="store-grid" />
    </section>
  );
}

export function FullMarketplaceSkeleton() {
  return (
    <main className="min-h-screen bg-white">
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <MarketplaceSectionSkeleton key={index} />
        ))}
      </div>
    </main>
  );
}
