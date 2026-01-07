"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import { Button } from "@vendly/ui/components/button";
import { Input } from "@vendly/ui/components/input";
import { Label } from "@vendly/ui/components/label";
import { Card, CardContent } from "@vendly/ui/components/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@vendly/ui/components/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@vendly/ui/components/select";
import { Textarea } from "@vendly/ui/components/textarea";
import { Slider } from "@vendly/ui/components/slider";
import { Switch } from "@vendly/ui/components/switch";
import { 
  Monitor, 
  Tablet, 
  Smartphone, 
  Save, 
  RefreshCw,
  Palette,
  Layout,
  Eye,
  Undo,
  ImageIcon,
  Type,
  Link as LinkIcon,
  Settings2,
  Search,
  ShoppingCart,
  User,
} from "lucide-react";

// Types
interface PuckBlockProps {
  id: string;
  [key: string]: unknown;
}

interface PuckBlock {
  type: string;
  props: PuckBlockProps;
}

interface PuckData {
  content: PuckBlock[];
  root: {
    props: {
      title?: string;
      description?: string;
      backgroundColor?: string;
      primaryColor?: string;
      secondaryColor?: string;
      textColor?: string;
      headingFont?: string;
      bodyFont?: string;
      fontSize?: number;
      fontWeight?: string;
    };
  };
  zones?: Record<string, unknown>;
}

type DevicePreview = "desktop" | "tablet" | "mobile";

const deviceWidths: Record<DevicePreview, string> = {
  desktop: "100%",
  tablet: "768px",
  mobile: "375px",
};

const fontOptions = [
  { value: "Inter", label: "Inter" },
  { value: "Playfair Display", label: "Playfair Display" },
  { value: "Roboto", label: "Roboto" },
  { value: "Poppins", label: "Poppins" },
  { value: "Montserrat", label: "Montserrat" },
];

export default function StoreEditorPage() {
  const params = useParams<{ tenant: string }>();
  const tenant = params.tenant || "";
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
  
  // State
  const [pageData, setPageData] = useState<PuckData | null>(null);
  const [originalData, setOriginalData] = useState<PuckData | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [devicePreview, setDevicePreview] = useState<DevicePreview>("desktop");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const storefrontUrl = `http://${tenant}.localhost:3000`;

  // Fetch page data
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`${apiBaseUrl}/api/storefront/${tenant}/page-data`);
        if (res.ok) {
          const result = await res.json();
          if (result.data?.pageData) {
            setPageData(result.data.pageData);
            setOriginalData(JSON.parse(JSON.stringify(result.data.pageData)));
          }
        }
      } catch (error) {
        console.error("Error fetching page data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [apiBaseUrl, tenant]);

  // Track changes
  useEffect(() => {
    if (pageData && originalData) {
      setHasChanges(JSON.stringify(pageData) !== JSON.stringify(originalData));
    }
  }, [pageData, originalData]);

  // Update block props
  const updateBlockProps = useCallback((blockId: string, props: Partial<PuckBlockProps>) => {
    if (!pageData) return;
    setPageData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        content: prev.content.map(block => 
          block.props.id === blockId 
            ? { ...block, props: { ...block.props, ...props } }
            : block
        ),
      };
    });
  }, [pageData]);

  // Update root props
  const updateRootProps = useCallback((props: Partial<PuckData["root"]["props"]>) => {
    setPageData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        root: { ...prev.root, props: { ...prev.root.props, ...props } },
      };
    });
  }, []);

  // Save changes
  const handleSave = async () => {
    if (!pageData) return;
    setIsSaving(true);
    try {
      const res = await fetch(`${apiBaseUrl}/api/storefront/${tenant}/page-data`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageData }),
      });
      if (res.ok) {
        setOriginalData(JSON.parse(JSON.stringify(pageData)));
        setHasChanges(false);
        setIframeKey(prev => prev + 1);
      }
    } catch (error) {
      console.error("Error saving:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Reset changes
  const handleReset = () => {
    if (originalData) {
      setPageData(JSON.parse(JSON.stringify(originalData)));
      setSelectedBlock(null);
    }
  };

  // Get selected block
  const getSelectedBlock = (): PuckBlock | null => {
    if (!pageData || !selectedBlock) return null;
    return pageData.content.find(b => b.props.id === selectedBlock) || null;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No storefront data found</p>
          <Button onClick={() => window.location.reload()}>Refresh</Button>
        </div>
      </div>
    );
  }

  const selectedBlockData = getSelectedBlock();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar - Sections & Editing */}
      <div className="w-80 bg-white border-r flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <h1 className="font-semibold text-lg">Store Editor</h1>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={handleReset} disabled={!hasChanges}>
              <Undo className="w-4 h-4" />
            </Button>
            <Button size="sm" onClick={handleSave} disabled={!hasChanges || isSaving}>
              {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span className="ml-2">Save</span>
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="sections" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="mx-4 mt-4 grid grid-cols-2">
            <TabsTrigger value="sections">
              <Layout className="w-4 h-4 mr-2" />
              Sections
            </TabsTrigger>
            <TabsTrigger value="theme">
              <Palette className="w-4 h-4 mr-2" />
              Theme
            </TabsTrigger>
          </TabsList>

          {/* Sections Tab */}
          <TabsContent value="sections" className="flex-1 overflow-auto p-4">
            {/* Section List */}
            <div className="space-y-2 mb-4">
              {pageData.content.map((block) => (
                <button
                  key={block.props.id}
                  onClick={() => setSelectedBlock(block.props.id)}
                  className={`w-full p-3 rounded-lg border text-left transition-all ${
                    selectedBlock === block.props.id 
                      ? "border-primary bg-primary/5 ring-1 ring-primary" 
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
                      {block.type === "HeaderBlock" && <Layout className="w-4 h-4 text-gray-600" />}
                      {block.type === "HeroBlock" && <ImageIcon className="w-4 h-4 text-gray-600" />}
                      {block.type === "ProductGridBlock" && <Settings2 className="w-4 h-4 text-gray-600" />}
                      {block.type === "FooterBlock" && <LinkIcon className="w-4 h-4 text-gray-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{block.type.replace("Block", "")}</p>
                      <p className="text-xs text-gray-500 truncate">
                        {block.type === "HeaderBlock" && (block.props.storeName as string)}
                        {block.type === "HeroBlock" && (block.props.title as string)}
                        {block.type === "ProductGridBlock" && (block.props.title as string)}
                        {block.type === "FooterBlock" && "Social links & info"}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Section Editor */}
            {selectedBlockData && (
              <div className="border-t pt-4 space-y-4">
                <h3 className="font-medium text-sm text-gray-700">
                  Edit {selectedBlockData.type.replace("Block", "")}
                </h3>

                {/* Header Block Editor */}
                {selectedBlockData.type === "HeaderBlock" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-gray-500">Store Name</Label>
                      <Input
                        value={selectedBlockData.props.storeName as string}
                        onChange={(e) => updateBlockProps(selectedBlock!, { storeName: e.target.value })}
                        className="h-9"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-xs text-gray-500">Header Elements</Label>
                      <div className="space-y-2">
                        <label className="flex items-center justify-between p-2 rounded border">
                          <span className="flex items-center gap-2 text-sm">
                            <Search className="w-4 h-4" /> Search
                          </span>
                          <Switch defaultChecked />
                        </label>
                        <label className="flex items-center justify-between p-2 rounded border">
                          <span className="flex items-center gap-2 text-sm">
                            <User className="w-4 h-4" /> Sign In
                          </span>
                          <Switch 
                            checked={selectedBlockData.props.showSignIn as boolean}
                            onCheckedChange={(v) => updateBlockProps(selectedBlock!, { showSignIn: v })}
                          />
                        </label>
                        <label className="flex items-center justify-between p-2 rounded border">
                          <span className="flex items-center gap-2 text-sm">
                            <ShoppingCart className="w-4 h-4" /> Cart
                          </span>
                          <Switch 
                            checked={selectedBlockData.props.showCart as boolean}
                            onCheckedChange={(v) => updateBlockProps(selectedBlock!, { showCart: v })}
                          />
                        </label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs text-gray-500">Background</Label>
                      <div className="flex gap-2">
                        <Input
                          value={selectedBlockData.props.backgroundColor as string}
                          onChange={(e) => updateBlockProps(selectedBlock!, { backgroundColor: e.target.value })}
                          className="h-9 flex-1"
                        />
                        <input
                          type="color"
                          value={selectedBlockData.props.backgroundColor as string}
                          onChange={(e) => updateBlockProps(selectedBlock!, { backgroundColor: e.target.value })}
                          className="w-9 h-9 rounded border cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Hero Block Editor */}
                {selectedBlockData.type === "HeroBlock" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-gray-500">Label</Label>
                      <Input
                        value={selectedBlockData.props.label as string}
                        onChange={(e) => updateBlockProps(selectedBlock!, { label: e.target.value })}
                        className="h-9"
                        placeholder="e.g., NEW ARRIVAL"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs text-gray-500">Title</Label>
                      <Textarea
                        value={selectedBlockData.props.title as string}
                        onChange={(e) => updateBlockProps(selectedBlock!, { title: e.target.value })}
                        rows={2}
                        placeholder="Main headline..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs text-gray-500">Subtitle</Label>
                      <Textarea
                        value={selectedBlockData.props.subtitle as string}
                        onChange={(e) => updateBlockProps(selectedBlock!, { subtitle: e.target.value })}
                        rows={2}
                        placeholder="Supporting text..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs text-gray-500">Button Text</Label>
                      <Input
                        value={selectedBlockData.props.ctaText as string}
                        onChange={(e) => updateBlockProps(selectedBlock!, { ctaText: e.target.value })}
                        className="h-9"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs text-gray-500">Background Image</Label>
                      <Input
                        value={(selectedBlockData.props.imageUrl as string) || ""}
                        onChange={(e) => updateBlockProps(selectedBlock!, { imageUrl: e.target.value })}
                        className="h-9"
                        placeholder="https://..."
                      />
                      <Button variant="outline" size="sm" className="w-full">
                        <ImageIcon className="w-4 h-4 mr-2" />
                        Upload Image
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs text-gray-500">Background Color</Label>
                      <div className="flex gap-2">
                        <Input
                          value={selectedBlockData.props.backgroundColor as string}
                          onChange={(e) => updateBlockProps(selectedBlock!, { backgroundColor: e.target.value })}
                          className="h-9 flex-1"
                        />
                        <input
                          type="color"
                          value={selectedBlockData.props.backgroundColor as string}
                          onChange={(e) => updateBlockProps(selectedBlock!, { backgroundColor: e.target.value })}
                          className="w-9 h-9 rounded border cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Product Grid Block Editor */}
                {selectedBlockData.type === "ProductGridBlock" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-gray-500">Section Title</Label>
                      <Input
                        value={selectedBlockData.props.title as string}
                        onChange={(e) => updateBlockProps(selectedBlock!, { title: e.target.value })}
                        className="h-9"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs text-gray-500">Columns</Label>
                      <Select
                        value={String(selectedBlockData.props.columns || 4)}
                        onValueChange={(v) => updateBlockProps(selectedBlock!, { columns: parseInt(v) })}
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2">2 Columns</SelectItem>
                          <SelectItem value="3">3 Columns</SelectItem>
                          <SelectItem value="4">4 Columns</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs text-gray-500">Card Border Radius</Label>
                      <div className="flex items-center gap-3">
                        <Slider
                          defaultValue={[8]}
                          max={24}
                          step={2}
                          onValueChange={([v]) => updateBlockProps(selectedBlock!, { cardBorderRadius: v })}
                          className="flex-1"
                        />
                        <span className="text-xs text-gray-500 w-8">
                          {(selectedBlockData.props.cardBorderRadius as number) || 8}px
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs text-gray-500">Card Padding</Label>
                      <div className="flex items-center gap-3">
                        <Slider
                          defaultValue={[16]}
                          max={32}
                          step={4}
                          onValueChange={([v]) => updateBlockProps(selectedBlock!, { cardPadding: v })}
                          className="flex-1"
                        />
                        <span className="text-xs text-gray-500 w-8">
                          {(selectedBlockData.props.cardPadding as number) || 16}px
                        </span>
                      </div>
                    </div>

                    <label className="flex items-center justify-between p-2 rounded border">
                      <span className="text-sm">Show Title</span>
                      <Switch 
                        checked={selectedBlockData.props.showTitle as boolean}
                        onCheckedChange={(v) => updateBlockProps(selectedBlock!, { showTitle: v })}
                      />
                    </label>
                  </div>
                )}

                {/* Footer Block Editor */}
                {selectedBlockData.type === "FooterBlock" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-gray-500">Social Links</Label>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="w-20 text-sm">Instagram</span>
                          <Input
                            value={(selectedBlockData.props.socialLinks as any)?.instagram || ""}
                            onChange={(e) => updateBlockProps(selectedBlock!, { 
                              socialLinks: { 
                                ...(selectedBlockData.props.socialLinks as any), 
                                instagram: e.target.value 
                              } 
                            })}
                            className="h-9 flex-1"
                            placeholder="https://instagram.com/..."
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-20 text-sm">Twitter</span>
                          <Input
                            value={(selectedBlockData.props.socialLinks as any)?.twitter || ""}
                            onChange={(e) => updateBlockProps(selectedBlock!, { 
                              socialLinks: { 
                                ...(selectedBlockData.props.socialLinks as any), 
                                twitter: e.target.value 
                              } 
                            })}
                            className="h-9 flex-1"
                            placeholder="https://twitter.com/..."
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-20 text-sm">Facebook</span>
                          <Input
                            value={(selectedBlockData.props.socialLinks as any)?.facebook || ""}
                            onChange={(e) => updateBlockProps(selectedBlock!, { 
                              socialLinks: { 
                                ...(selectedBlockData.props.socialLinks as any), 
                                facebook: e.target.value 
                              } 
                            })}
                            className="h-9 flex-1"
                            placeholder="https://facebook.com/..."
                          />
                        </div>
                      </div>
                    </div>

                    <label className="flex items-center justify-between p-2 rounded border">
                      <span className="text-sm">Show Newsletter</span>
                      <Switch 
                        checked={selectedBlockData.props.showNewsletter as boolean}
                        onCheckedChange={(v) => updateBlockProps(selectedBlock!, { showNewsletter: v })}
                      />
                    </label>

                    <div className="space-y-2">
                      <Label className="text-xs text-gray-500">Background</Label>
                      <div className="flex gap-2">
                        <Input
                          value={selectedBlockData.props.backgroundColor as string}
                          onChange={(e) => updateBlockProps(selectedBlock!, { backgroundColor: e.target.value })}
                          className="h-9 flex-1"
                        />
                        <input
                          type="color"
                          value={selectedBlockData.props.backgroundColor as string}
                          onChange={(e) => updateBlockProps(selectedBlock!, { backgroundColor: e.target.value })}
                          className="w-9 h-9 rounded border cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {/* Theme Tab */}
          <TabsContent value="theme" className="flex-1 overflow-auto p-4 space-y-4">
            {/* Colors */}
            <div className="space-y-3">
              <h3 className="font-medium text-sm text-gray-700">Colors</h3>
              
              <div className="space-y-2">
                <Label className="text-xs text-gray-500">Primary Color</Label>
                <div className="flex gap-2">
                  <Input
                    value={pageData.root.props.primaryColor || "#1a1a2e"}
                    onChange={(e) => updateRootProps({ primaryColor: e.target.value })}
                    className="h-9 flex-1"
                  />
                  <input
                    type="color"
                    value={pageData.root.props.primaryColor || "#1a1a2e"}
                    onChange={(e) => updateRootProps({ primaryColor: e.target.value })}
                    className="w-9 h-9 rounded border cursor-pointer"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-gray-500">Secondary Color</Label>
                <div className="flex gap-2">
                  <Input
                    value={pageData.root.props.secondaryColor || "#4a6fa5"}
                    onChange={(e) => updateRootProps({ secondaryColor: e.target.value })}
                    className="h-9 flex-1"
                  />
                  <input
                    type="color"
                    value={pageData.root.props.secondaryColor || "#4a6fa5"}
                    onChange={(e) => updateRootProps({ secondaryColor: e.target.value })}
                    className="w-9 h-9 rounded border cursor-pointer"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-gray-500">Text Color</Label>
                <div className="flex gap-2">
                  <Input
                    value={pageData.root.props.textColor || "#1a1a2e"}
                    onChange={(e) => updateRootProps({ textColor: e.target.value })}
                    className="h-9 flex-1"
                  />
                  <input
                    type="color"
                    value={pageData.root.props.textColor || "#1a1a2e"}
                    onChange={(e) => updateRootProps({ textColor: e.target.value })}
                    className="w-9 h-9 rounded border cursor-pointer"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-gray-500">Background</Label>
                <div className="flex gap-2">
                  <Input
                    value={pageData.root.props.backgroundColor || "#ffffff"}
                    onChange={(e) => updateRootProps({ backgroundColor: e.target.value })}
                    className="h-9 flex-1"
                  />
                  <input
                    type="color"
                    value={pageData.root.props.backgroundColor || "#ffffff"}
                    onChange={(e) => updateRootProps({ backgroundColor: e.target.value })}
                    className="w-9 h-9 rounded border cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Typography */}
            <div className="space-y-3 pt-4 border-t">
              <h3 className="font-medium text-sm text-gray-700 flex items-center gap-2">
                <Type className="w-4 h-4" /> Typography
              </h3>

              <div className="space-y-2">
                <Label className="text-xs text-gray-500">Heading Font</Label>
                <Select
                  value={pageData.root.props.headingFont || "Playfair Display"}
                  onValueChange={(v) => updateRootProps({ headingFont: v })}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fontOptions.map(f => (
                      <SelectItem key={f.value} value={f.value}>
                        <span style={{ fontFamily: f.value }}>{f.label}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-gray-500">Body Font</Label>
                <Select
                  value={pageData.root.props.bodyFont || "Inter"}
                  onValueChange={(v) => updateRootProps({ bodyFont: v })}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fontOptions.map(f => (
                      <SelectItem key={f.value} value={f.value}>
                        <span style={{ fontFamily: f.value }}>{f.label}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-gray-500">Font Weight</Label>
                <Select
                  value={pageData.root.props.fontWeight || "400"}
                  onValueChange={(v) => updateRootProps({ fontWeight: v })}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="300">Light</SelectItem>
                    <SelectItem value="400">Regular</SelectItem>
                    <SelectItem value="500">Medium</SelectItem>
                    <SelectItem value="600">Semi Bold</SelectItem>
                    <SelectItem value="700">Bold</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-gray-500">Base Font Size</Label>
                <div className="flex items-center gap-3">
                  <Slider
                    value={[pageData.root.props.fontSize || 16]}
                    min={12}
                    max={20}
                    step={1}
                    onValueChange={([v]) => updateRootProps({ fontSize: v })}
                    className="flex-1"
                  />
                  <span className="text-xs text-gray-500 w-10">
                    {pageData.root.props.fontSize || 16}px
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Preview Area */}
      <div className="flex-1 flex flex-col bg-gray-100">
        {/* Toolbar */}
        <div className="bg-white border-b px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Preview</span>
            <div className="flex bg-gray-100 rounded-lg p-0.5">
              {(["desktop", "tablet", "mobile"] as DevicePreview[]).map((device) => (
                <button
                  key={device}
                  onClick={() => setDevicePreview(device)}
                  className={`p-2 rounded-md transition-colors ${
                    devicePreview === device ? "bg-white shadow-sm" : "hover:bg-gray-200"
                  }`}
                >
                  {device === "desktop" && <Monitor className="w-4 h-4" />}
                  {device === "tablet" && <Tablet className="w-4 h-4" />}
                  {device === "mobile" && <Smartphone className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setIframeKey(prev => prev + 1)}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="ghost" size="sm" onClick={() => window.open(storefrontUrl, "_blank")}>
              <Eye className="w-4 h-4 mr-2" />
              View Live
            </Button>
          </div>
        </div>

        {/* Iframe */}
        <div className="flex-1 p-4 overflow-auto flex justify-center">
          <div 
            className="bg-white shadow-xl rounded-lg overflow-hidden transition-all"
            style={{ 
              width: deviceWidths[devicePreview],
              maxWidth: "100%",
              height: "calc(100vh - 120px)",
            }}
          >
            <iframe
              key={iframeKey}
              ref={iframeRef}
              src={storefrontUrl}
              className="w-full h-full"
              title="Storefront Preview"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
