import { Label } from "@vendly/ui/components/label"
import { Input } from "@vendly/ui/components/input"
import { Button } from "@vendly/ui/components/button"
import { InstagramIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

const categories = ["Fashion", "Beauty", "Health", "Food", "Travel", "Tech", "Sports", "Music", "Art", "Gaming"]

interface BusinessInfoStepProps {
  formData: Record<string, string>
  updateFormData: (updates: Record<string, string>) => void
}

export function BusinessInfoStep({ formData, updateFormData }: BusinessInfoStepProps) {
  return (
    <div className="space-y-6">
      {/* Business Name */}
      <div className="space-y-2">
        <Label htmlFor="business-name">Business Name</Label>
        <Input
          id="business-name"
          placeholder="Enter your business name"
          value={formData.businessName || ""}
          onChange={(e) => updateFormData({ businessName: e.target.value })}
        />
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label>Category</Label>
        <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto rounded-lg border p-3">
          {categories.map((cat) => (
            <label
              key={cat}
              className="flex items-center gap-2 rounded-md p-2 hover:bg-muted cursor-pointer"
            >
              <input
                type="radio"
                name="category"
                value={cat}
                checked={formData.category === cat}
                onChange={(e) => updateFormData({ category: e.target.value })}
              />
              <span className="text-sm">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Business Type */}
      <div className="space-y-3">
        <Label>Business Type</Label>
        {[{ value: "individual", label: "Individual Creator" }, { value: "brand", label: "Registered Brand" }].map((type) => (
          <label key={type.value} className="flex items-center gap-2">
            <input
              type="radio"
              name="business-type"
              value={type.value}
              checked={formData.businessType === type.value}
              onChange={(e) => updateFormData({ businessType: e.target.value })}
            />
            <span>{type.label}</span>
          </label>
        ))}
      </div>

      {/* Instagram */}
      <div className="space-y-2">
        <Label>Connect Instagram (Optional)</Label>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => updateFormData({ instagramConnected: "true" })}
        >
          <HugeiconsIcon icon={InstagramIcon} size={16} className="mr-2" />
          {formData.instagramConnected ? "Connected" : "Connect Instagram"}
        </Button>
      </div>
    </div>
  )
}