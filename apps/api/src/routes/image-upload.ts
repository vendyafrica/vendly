/**
 * Image Upload Routes
 * Handles image uploads with automatic resizing/normalization
 */
import { Router, Request, Response } from "express";
import multer from "multer";
import sharp from "sharp";
import { put } from "@vercel/blob";

const router: Router = Router();

// Configure multer for memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB max
    },
    fileFilter: (_req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only image files are allowed"));
        }
    },
});

// Standard image sizes for products
const IMAGE_SIZES = {
    thumbnail: { width: 150, height: 150 },
    small: { width: 300, height: 300 },
    medium: { width: 600, height: 600 },
    large: { width: 1200, height: 1200 },
    product: { width: 800, height: 800 }, // Main product image
};

/**
 * Resize and crop image to square with consistent dimensions
 */
async function processProductImage(
    buffer: Buffer,
    size: { width: number; height: number }
): Promise<Buffer> {
    return sharp(buffer)
        .resize(size.width, size.height, {
            fit: "cover", // Crop to fill the dimensions
            position: "center", // Center the crop
        })
        .jpeg({ quality: 85 }) // Consistent format and good quality
        .toBuffer();
}

/**
 * Upload a single product image with automatic resizing
 * POST /api/images/upload
 * 
 * Body (multipart/form-data):
 * - file: Image file
 * - tenantSlug: Store/tenant identifier
 * - productId: (optional) Product ID for organization
 * - size: (optional) "thumbnail" | "small" | "medium" | "large" | "product" (default: "product")
 */
router.post(
    "/upload",
    upload.single("file"),
    async (req: Request, res: Response) => {
        try {
            const file = req.file;
            const { tenantSlug, productId, size = "product" } = req.body;

            if (!file) {
                return res.status(400).json({
                    error: true,
                    message: "No file provided",
                });
            }

            if (!tenantSlug) {
                return res.status(400).json({
                    error: true,
                    message: "tenantSlug is required",
                });
            }

            // Get dimensions for the requested size
            const dimensions = IMAGE_SIZES[size as keyof typeof IMAGE_SIZES] || IMAGE_SIZES.product;

            console.log(`[ImageUpload] Processing image for ${tenantSlug}, size: ${size}`);

            // Process the image (resize and convert to JPEG)
            const processedBuffer = await processProductImage(file.buffer, dimensions);

            // Generate filename
            const timestamp = Date.now();
            const filename = productId
                ? `${tenantSlug}/products/${productId}/${timestamp}.jpg`
                : `${tenantSlug}/images/${timestamp}.jpg`;

            // Upload to Vercel Blob
            const result = await put(filename, processedBuffer, {
                access: "public",
                contentType: "image/jpeg",
                addRandomSuffix: false,
            });

            console.log(`[ImageUpload] Upload successful: ${result.url}`);

            res.json({
                url: result.url,
                pathname: result.pathname,
                size: {
                    width: dimensions.width,
                    height: dimensions.height,
                },
                originalSize: file.size,
                processedSize: processedBuffer.length,
            });
        } catch (error) {
            console.error("[ImageUpload] Error:", error);
            res.status(500).json({
                error: true,
                message: error instanceof Error ? error.message : "Failed to upload image",
            });
        }
    }
);

/**
 * Upload multiple product images at once
 * POST /api/images/upload-multiple
 */
router.post(
    "/upload-multiple",
    upload.array("files", 10), // Max 10 files
    async (req: Request, res: Response) => {
        try {
            const files = req.files as Express.Multer.File[];
            const { tenantSlug, productId, size = "product" } = req.body;

            if (!files || files.length === 0) {
                return res.status(400).json({
                    error: true,
                    message: "No files provided",
                });
            }

            if (!tenantSlug) {
                return res.status(400).json({
                    error: true,
                    message: "tenantSlug is required",
                });
            }

            const dimensions = IMAGE_SIZES[size as keyof typeof IMAGE_SIZES] || IMAGE_SIZES.product;
            const results = [];

            console.log(`[ImageUpload] Processing ${files.length} images for ${tenantSlug}`);

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const processedBuffer = await processProductImage(file.buffer, dimensions);

                const timestamp = Date.now();
                const filename = productId
                    ? `${tenantSlug}/products/${productId}/${timestamp}-${i}.jpg`
                    : `${tenantSlug}/images/${timestamp}-${i}.jpg`;

                const result = await put(filename, processedBuffer, {
                    access: "public",
                    contentType: "image/jpeg",
                    addRandomSuffix: false,
                });

                results.push({
                    url: result.url,
                    pathname: result.pathname,
                    originalName: file.originalname,
                });
            }

            console.log(`[ImageUpload] Uploaded ${results.length} images`);

            res.json({
                count: results.length,
                images: results,
            });
        } catch (error) {
            console.error("[ImageUpload] Error:", error);
            res.status(500).json({
                error: true,
                message: error instanceof Error ? error.message : "Failed to upload images",
            });
        }
    }
);

/**
 * Upload to demo folder (for testing)
 * POST /api/images/demo
 */
router.post(
    "/demo",
    upload.single("file"),
    async (req: Request, res: Response) => {
        try {
            const file = req.file;

            if (!file) {
                return res.status(400).json({
                    error: true,
                    message: "No file provided",
                });
            }

            const dimensions = IMAGE_SIZES.product;

            console.log(`[ImageUpload] Processing demo image`);

            const processedBuffer = await processProductImage(file.buffer, dimensions);

            const timestamp = Date.now();
            const originalName = file.originalname.replace(/\.[^.]+$/, ""); // Remove extension
            const filename = `demo/${timestamp}-${originalName}.jpg`;

            const result = await put(filename, processedBuffer, {
                access: "public",
                contentType: "image/jpeg",
                addRandomSuffix: false,
            });

            console.log(`[ImageUpload] Demo upload successful: ${result.url}`);

            res.json({
                url: result.url,
                pathname: result.pathname,
                size: {
                    width: dimensions.width,
                    height: dimensions.height,
                },
            });
        } catch (error) {
            console.error("[ImageUpload] Error:", error);
            res.status(500).json({
                error: true,
                message: error instanceof Error ? error.message : "Failed to upload image",
            });
        }
    }
);

export default router;
