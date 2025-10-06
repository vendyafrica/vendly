export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  categories: string[];
  tags: string[];
  images: string[];
  inventoryQuantity: number;
  trackInventory: boolean;
  sku?: string;
  hasVariants?: boolean;
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
  isActive?: boolean;
  isFeatured?: boolean;
}
