export default function ProductsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Products</h1>
      <div className="bg-muted/50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Product Inventory</h3>
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md">
            Add Product
          </button>
        </div>
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          No products found
        </div>
      </div>
    </div>
  )
}
