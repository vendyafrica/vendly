import { Router } from "express";
import { Response, Request } from "express";
import { 
  getStoreBySlug,
  getProductsByStoreSlug,
  getCategoriesByStoreSlug,
  getProductById,
  getProductsByCategorySlug
} from "@vendly/db/storefront-queries";

const router = Router();

// Store info endpoint
router.get("/:slug/store-info", async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    
    const store = await getStoreBySlug(slug);
    
    if (!store) {
      return res.status(404).json({
        error: true,
        message: "Store not found"
      });
    }
    
    res.json({
      error: false,
      data: store
    });
  } catch (error) {
    console.error("Error fetching store info:", error);
    res.status(500).json({
      error: true,
      message: "Internal server error"
    });
  }
});

// Products endpoint
router.get("/:slug/products", async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const { limit, offset, status } = req.query;
    
    const products = await getProductsByStoreSlug(slug, {
      limit: limit ? parseInt(limit as string) : undefined,
      offset: offset ? parseInt(offset as string) : undefined,
      status: status as "active" | "archived" | "draft" || "active"
    });
    
    // Get images for each product
    const productsWithImages = await Promise.all(
      products.map(async (product) => {
        const fullProduct = await getProductById(product.id);
        return fullProduct;
      })
    );
    
    res.json({
      error: false,
      data: productsWithImages
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      error: true,
      message: "Internal server error"
    });
  }
});

// Single product endpoint
router.get("/:slug/products/:productId", async (req: Request, res: Response) => {
  try {
    const { slug, productId } = req.params;
    
    // First verify the store exists
    const store = await getStoreBySlug(slug);
    if (!store) {
      return res.status(404).json({
        error: true,
        message: "Store not found"
      });
    }
    
    const product = await getProductById(productId);
    
    if (!product) {
      return res.status(404).json({
        error: true,
        message: "Product not found"
      });
    }
    
    // Verify product belongs to the store
    if (product.storeId !== store.id) {
      return res.status(404).json({
        error: true,
        message: "Product not found in this store"
      });
    }
    
    res.json({
      error: false,
      data: product
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({
      error: true,
      message: "Internal server error"
    });
  }
});

// Categories endpoint
router.get("/:slug/categories", async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    
    const categories = await getCategoriesByStoreSlug(slug);
    
    res.json({
      error: false,
      data: categories
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({
      error: true,
      message: "Internal server error"
    });
  }
});

// Products by category endpoint
router.get("/:slug/categories/:categorySlug/products", async (req: Request, res: Response) => {
  try {
    const { slug, categorySlug } = req.params;
    
    const products = await getProductsByCategorySlug(slug, categorySlug);
    
    // Get images for each product
    const productsWithImages = await Promise.all(
      products.map(async (product) => {
        const fullProduct = await getProductById(product.id);
        return fullProduct;
      })
    );
    
    res.json({
      error: false,
      data: productsWithImages
    });
  } catch (error) {
    console.error("Error fetching category products:", error);
    res.status(500).json({
      error: true,
      message: "Internal server error"
    });
  }
});

export default router;
