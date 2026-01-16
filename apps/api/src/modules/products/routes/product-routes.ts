import { Router } from "express";
import multer from "multer";
import { productController } from "../controllers/product-controller";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Create product with optional media (up to 5 images)
router.post(
    "/",
    upload.array("images", 5),
    productController.create
);

// Bulk upload (up to 20 images at once)
router.post(
    "/bulk-upload",
    upload.array("files", 20),
    productController.bulkUpload
);

// Get/List
router.get("/", productController.list);
router.get("/:id", productController.get);

// Update/Delete
router.delete("/:id", productController.delete);

export const productRoutes: Router = router;
