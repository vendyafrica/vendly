/**
 * Upload Routes
 * Defines API endpoints for file upload operations
 */
import { Router } from "express";
import multer from "multer";
import { uploadController } from "./blob-controller";

const router: Router = Router();

// Configure multer for file uploads
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB max
        files: 10, // Max 10 files for multiple upload
    },
    fileFilter: (_req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only image files are allowed"));
        }
    },
});

/**
 * @route   POST /api/upload
 * @desc    Upload a single file
 * @access  Public
 * @body    {file: File, tenantSlug: string, productId?: string, size?: string, processImage?: boolean}
 */
router.post(
    "/",
    upload.single("file"),
    uploadController.uploadSingle.bind(uploadController)
);

/**
 * @route   POST /api/upload/multiple
 * @desc    Upload multiple files (max 10)
 * @access  Public
 * @body    {files: File[], tenantSlug: string, productId?: string, size?: string, processImage?: boolean}
 */
router.post(
    "/multiple",
    upload.array("files", 10),
    uploadController.uploadMultiple.bind(uploadController)
);

/**
 * @route   POST /api/upload/product
 * @desc    Upload a product image
 * @access  Public
 * @body    {file: File, tenantSlug: string, productId: string, size?: string}
 */
router.post(
    "/product",
    upload.single("file"),
    uploadController.uploadProduct.bind(uploadController)
);

/**
 * @route   DELETE /api/upload
 * @desc    Delete a single blob
 * @access  Public
 * @body    {url: string}
 */
router.delete("/", uploadController.deleteBlob.bind(uploadController));

/**
 * @route   DELETE /api/upload/multiple
 * @desc    Delete multiple blobs
 * @access  Public
 * @body    {urls: string[]}
 */
router.delete("/multiple", uploadController.deleteBlobs.bind(uploadController));

/**
 * @route   GET /api/upload/list/:tenantSlug
 * @desc    List all blobs for a tenant
 * @access  Public
 * @query   {limit?: number, cursor?: string}
 */
router.get(
    "/list/:tenantSlug",
    uploadController.listTenantBlobs.bind(uploadController)
);

/**
 * @route   GET /api/upload/product/:tenantSlug/:productId
 * @desc    List all images for a specific product
 * @access  Public
 * @query   {limit?: number, cursor?: string}
 */
router.get(
    "/product/:tenantSlug/:productId",
    uploadController.listProductImages.bind(uploadController)
);

export default router;