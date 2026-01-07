import { Router } from "express";
import { Response, Request } from "express";
import {
  getStoreBySlug,
  getProductsByStoreSlug,
  getCategoriesByStoreSlug,
  getProductById,
  getProductsByCategorySlug,
  getStoreCustomizationBySlug,
  upsertStoreTheme,
  upsertStoreContent,
  getStorePageDataBySlug,
  upsertStorePageData
} from "@vendly/db/storefront-queries";
import { generateStorefrontForStore } from "../services/v0-storefront-service";
import { type ColorTemplateName } from "../lib/color-templates";

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

// Get store customization (theme + content)
router.get("/:slug/customization", async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const customization = await getStoreCustomizationBySlug(slug);

    if (!customization) {
      return res.status(404).json({
        error: true,
        message: "Store not found"
      });
    }

    res.json({
      error: false,
      data: customization
    });
  } catch (error) {
    console.error("Error fetching store customization:", error);
    res.status(500).json({
      error: true,
      message: "Internal server error"
    });
  }
});

// Update store theme
router.put("/:slug/theme", async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const { primaryColor, secondaryColor, accentColor, backgroundColor, textColor, headingFont, bodyFont } = req.body;

    const store = await getStoreBySlug(slug);
    if (!store) {
      return res.status(404).json({
        error: true,
        message: "Store not found"
      });
    }

    const theme = await upsertStoreTheme({
      storeId: store.id,
      primaryColor,
      secondaryColor,
      accentColor,
      backgroundColor,
      textColor,
      headingFont,
      bodyFont
    });

    res.json({
      error: false,
      data: theme
    });
  } catch (error) {
    console.error("Error updating store theme:", error);
    res.status(500).json({
      error: true,
      message: "Internal server error"
    });
  }
});

// Update store content
router.put("/:slug/content", async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const {
      heroLabel, heroTitle, heroSubtitle, heroCta, heroImageUrl,
      featuredSections, footerDescription, newsletterTitle, newsletterSubtitle
    } = req.body;

    const store = await getStoreBySlug(slug);
    if (!store) {
      return res.status(404).json({
        error: true,
        message: "Store not found"
      });
    }

    const content = await upsertStoreContent({
      storeId: store.id,
      heroLabel,
      heroTitle,
      heroSubtitle,
      heroCta,
      heroImageUrl,
      featuredSections,
      footerDescription,
      newsletterTitle,
      newsletterSubtitle
    });

    res.json({
      error: false,
      data: content
    });
  } catch (error) {
    console.error("Error updating store content:", error);
    res.status(500).json({
      error: true,
      message: "Internal server error"
    });
  }
});

// Get store page data (for Puck editor)
router.get("/:slug/page-data", async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const pageData = await getStorePageDataBySlug(slug);

    res.json({
      error: false,
      data: { pageData }
    });
  } catch (error) {
    console.error("Error fetching page data:", error);
    res.status(500).json({
      error: true,
      message: "Internal server error"
    });
  }
});

// Update store page data (for Puck editor)
router.put("/:slug/page-data", async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const { pageData } = req.body;

    const store = await getStoreBySlug(slug);
    if (!store) {
      return res.status(404).json({
        error: true,
        message: "Store not found"
      });
    }

    const content = await upsertStorePageData(store.id, pageData);

    res.json({
      error: false,
      data: content
    });
  } catch (error) {
    console.error("Error updating page data:", error);
    res.status(500).json({
      error: true,
      message: "Internal server error"
    });
  }
});

// Generate storefront with v0 AI
router.post("/:slug/generate", async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const { colorTemplate = "dark" } = req.body;

    console.log(`Generating storefront for ${slug} with template: ${colorTemplate}`);

    const result = await generateStorefrontForStore(slug, colorTemplate as ColorTemplateName);

    if (!result.success) {
      return res.status(400).json({
        error: true,
        message: result.error || "Generation failed"
      });
    }

    res.json({
      error: false,
      message: "Storefront generated successfully",
      data: {
        storeSlug: slug,
        colorTemplate,
        puckData: result.puckData
      }
    });
  } catch (error) {
    console.error("Error generating storefront:", error);
    res.status(500).json({
      error: true,
      message: "Internal server error"
    });
  }
});

export default router;

