import * as React from "react"
import { cn } from "@vendly/ui/lib/utils"

interface CategoryCardProps extends React.ComponentProps<"div"> {
  name: string
  backgroundColor: string
  imageUrl?: string
  imageAlt?: string
}

function CategoryCard({
  className,
  name,
  backgroundColor,
  imageUrl,
  imageAlt = name,
  ...props
}: CategoryCardProps) {
  return (
    <div
      data-slot="category-card"
      className={cn(
        "relative overflow-hidden rounded-2xl cursor-pointer transition-transform hover:scale-105 active:scale-95",
        "h-32 md:h-40 lg:h-48",
        className
      )}
      style={{ backgroundColor }}
      {...props}
    >
      {/* Category Name */}
      <div className="absolute inset-0 flex items-start justify-start p-4 z-10">
        <h3 className="text-white font-semibold text-lg md:text-xl">
          {name}
        </h3>
      </div>
      
      {/* Product Image */}
      {imageUrl && (
        <div className="absolute bottom-0 right-0 w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40">
          <img
            src={imageUrl}
            alt={imageAlt}
            className="w-full h-full object-contain object-bottom drop-shadow-lg"
            style={{
              filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))'
            }}
          />
        </div>
      )}
      
      {/* Optional gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent pointer-events-none" />
    </div>
  )
}

export { CategoryCard }
