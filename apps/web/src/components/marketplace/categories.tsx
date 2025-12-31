import { CategoryCard } from "@vendly/ui/components/category-card"
import { cn } from "@vendly/ui/lib/utils"

const categories = [
  {
    name: "Women",
    backgroundColor: "#6B7280", // Gray
    imageUrl: "/api/placeholder/150/150?text=Dress",
  },
  {
    name: "Men", 
    backgroundColor: "#3B82F6", // Blue
    imageUrl: "/api/placeholder/150/150?text=Shirt",
  },
  {
    name: "Beauty",
    backgroundColor: "#EC4899", // Pink
    imageUrl: "/api/placeholder/150/150?text=Lipstick",
  },
  {
    name: "Food & drinks",
    backgroundColor: "#8B5CF6", // Purple
    imageUrl: "/api/placeholder/150/150?text=Coffee",
  },
  {
    name: "Baby & toddler",
    backgroundColor: "#F97316", // Orange
    imageUrl: "/api/placeholder/150/150?text=Toy",
  },
  {
    name: "Home",
    backgroundColor: "#84CC16", // Light green
    imageUrl: "/api/placeholder/150/150?text=Chair",
  },
  {
    name: "Fitness & nutrition",
    backgroundColor: "#06B6D4", // Cyan
    imageUrl: "/api/placeholder/150/150?text=Dumbbell",
  },
  {
    name: "Accessories",
    backgroundColor: "#1E40AF", // Dark blue
    imageUrl: "/api/placeholder/150/150?text=Watch",
  },
]

interface CategoriesProps {
  className?: string
}

export default function Categories({ className }: CategoriesProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {categories.map((category, index) => (
          <CategoryCard
            key={index}
            name={category.name}
            backgroundColor={category.backgroundColor}
            imageUrl={category.imageUrl}
            className="w-full"
          />
        ))}
      </div>
    </div>
  )
}

export { Categories }