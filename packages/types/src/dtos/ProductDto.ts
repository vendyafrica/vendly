export interface CreateProductRequest {
  // Required
  name: string;
  price: number;
  images: string[];
  inventoryQuantity: number;
  trackInventory: boolean;

  // Optional
  description?: string;
  compareAtPrice?: number;
  categories?: string[];
  tags?: string[];
  sku?: string;

  // MVP state
  status?: 'draft' | 'active'; // default 'draft' when missing

  // Social ingestion metadata (optional; set by importers)
  source?: {
    type: 'instagram' | 'whatsapp_catalog' | 'manual';
    externalId?: string;
    externalUrl?: string;
    caption?: string;
  };

  // Variants are disabled for v1; kept for forward compatibility
  hasVariants?: boolean; // should be false in v1
  variants?: CreateProductVariantRequest[];
}

export interface CreateProductVariantRequest {
  option1?: string;
  option1Value?: string;
  option2?: string;
  option2Value?: string;
  option3?: string;
  option3Value?: string;
  price?: number;
  inventoryQuantity: number;
  imageUrl?: string;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  compareAtPrice?: number;
  categories?: string[];
  tags?: string[];
  images?: string[];
  inventoryQuantity?: number;

  // State & presentation
  status?: 'draft' | 'active';
  isActive?: boolean;      // legacy compatibility
  isFeatured?: boolean;

  // Ingestion metadata updates (normally importer-controlled)
  source?: {
    type?: 'instagram' | 'whatsapp_catalog' | 'manual';
    externalId?: string;
    externalUrl?: string;
    caption?: string;
  };
}
