import { Router } from "express";
import { productController } from "../controllers/product.controller";

const authenticate = (req: any, res: any, next: any) => next();

export const createProductRouter = (): Router => {
    const router = Router();

    router.use(authenticate);

    // Products
    // Assuming mounted at /api/products
    // Or /api/storefront/stores/:storeId/products ?

    // Let's support nested style via query or params if mounted generally
    // But RESTful often implies /stores/:storeId/products

    // For now, let's just expose these and rely on the main router to mount them appropriately
    // If mounted at /api/products, we need storeId in query or body

    router.get("/", productController.getProducts.bind(productController));
    router.post("/", productController.createProduct.bind(productController)); // Requires storeId in body/query? Or we fix controller to look there

    router.get("/:productId", productController.getProduct.bind(productController));
    router.delete("/:productId", productController.deleteProduct.bind(productController));

    return router;
};
