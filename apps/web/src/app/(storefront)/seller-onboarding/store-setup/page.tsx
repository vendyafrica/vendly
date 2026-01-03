"use client";

import { useState } from "react";
import { Button } from "@vendly/ui/components/button";
import { Label } from "@vendly/ui/components/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@vendly/ui/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@vendly/ui/components/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeftIcon, StoreIcon } from "@hugeicons/core-free-icons";

const locations = [
  { value: "US", label: "United States" },
  { value: "CA", label: "Canada" },
  { value: "UK", label: "United Kingdom" },
  { value: "AU", label: "Australia" },
  { value: "DE", label: "Germany" },
  { value: "FR", label: "France" },
  { value: "ES", label: "Spain" },
  { value: "IT", label: "Italy" },
  { value: "NL", label: "Netherlands" },
  { value: "JP", label: "Japan" },
  { value: "SG", label: "Singapore" },
  { value: "OTHER", label: "Other" },
];

const templates = [
  { 
    value: "modern", 
    label: "Modern", 
    description: "Clean and minimalist design",
    preview: "🎨"
  },
  { 
    value: "bold", 
    label: "Bold", 
    description: "Eye-catching and vibrant",
    preview: "🌟"
  },
  { 
    value: "elegant", 
    label: "Elegant", 
    description: "Sophisticated and refined",
    preview: "✨"
  },
  { 
    value: "playful", 
    label: "Playful", 
    description: "Fun and creative",
    preview: "🎭"
  },
];

const colorPalettes = [
  { 
    value: "ocean", 
    label: "Ocean", 
    colors: ["#0077BE", "#00A8E8", "#00C9FF", "#7DD3FC"],
    description: "Calming blues"
  },
  { 
    value: "sunset", 
    label: "Sunset", 
    colors: ["#FF6B6B", "#FF8E53", "#FF6B9D", "#C44569"],
    description: "Warm oranges and pinks"
  },
  { 
    value: "forest", 
    label: "Forest", 
    colors: ["#2D6A4F", "#52B788", "#95D5B2", "#D8F3DC"],
    description: "Natural greens"
  },
  { 
    value: "royal", 
    label: "Royal", 
    colors: ["#4C1D95", "#7C3AED", "#A78BFA", "#DDD6FE"],
    description: "Rich purples"
  },
  { 
    value: "monochrome", 
    label: "Monochrome", 
    colors: ["#000000", "#404040", "#808080", "#C0C0C0"],
    description: "Classic blacks and grays"
  },
];

export default function StoreSetupPage() {
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [selectedPalette, setSelectedPalette] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Save store data and redirect to success
    window.location.href = "/seller-onboarding/success";
  };

  const handleBack = () => {
    window.location.href = "/seller-onboarding/payment-setup";
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Customize your store</h1>
        <p className="text-muted-foreground">
          Choose your location, template, and brand colors
        </p>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-center space-x-2">
        <div className="w-8 h-8 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-sm font-medium">
          ✓
        </div>
        <div className="w-16 h-1 bg-muted"></div>
        <div className="w-8 h-8 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-sm font-medium">
          ✓
        </div>
        <div className="w-16 h-1 bg-muted"></div>
        <div className="w-8 h-8 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-sm font-medium">
          ✓
        </div>
        <div className="w-16 h-1 bg-primary"></div>
        <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
          4
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Store Configuration</CardTitle>
          <CardDescription>
            Set up your store location and appearance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Location */}
            <div className="space-y-3">
              <Label>Store Location</Label>
              <Select value={selectedLocation} onValueChange={setSelectedLocation} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select your country/region" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location.value} value={location.value}>
                      {location.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                This helps us set up the right shipping zones and tax settings
              </p>
            </div>

            {/* Template Selection */}
            <div className="space-y-4">
              <Label>Store Template</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map((template) => (
                  <div
                    key={template.value}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedTemplate === template.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setSelectedTemplate(template.value)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="text-2xl">{template.preview}</div>
                      <div className="flex-1">
                        <h4 className="font-medium">{template.label}</h4>
                        <p className="text-sm text-muted-foreground">
                          {template.description}
                        </p>
                      </div>
                      {selectedTemplate === template.value && (
                        <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-primary-foreground rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Color Palette */}
            <div className="space-y-4">
              <Label>Color Palette</Label>
              <div className="grid grid-cols-1 gap-4">
                {colorPalettes.map((palette) => (
                  <div
                    key={palette.value}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedPalette === palette.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setSelectedPalette(palette.value)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex space-x-1">
                          {palette.colors.map((color, index) => (
                            <div
                              key={index}
                              className="w-8 h-8 rounded"
                              style={{ backgroundColor: color }}
                            ></div>
                          ))}
                        </div>
                        <div>
                          <h4 className="font-medium">{palette.label}</h4>
                          <p className="text-sm text-muted-foreground">
                            {palette.description}
                          </p>
                        </div>
                      </div>
                      {selectedPalette === palette.value && (
                        <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-primary-foreground rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex gap-4 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleBack}
                className="flex-1"
              >
                <HugeiconsIcon icon={ArrowLeftIcon} size={16} className="mr-2" />
                Back
              </Button>
              <Button 
                type="submit" 
                className="flex-1" 
                size="lg"
                disabled={!selectedLocation || !selectedTemplate || !selectedPalette}
              >
                Complete Setup
                <HugeiconsIcon icon={StoreIcon} size={16} className="ml-2" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
