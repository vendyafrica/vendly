import { NextRequest, NextResponse } from "next/server";
import { adminService } from "@/lib/services/admin-service";
import { z } from "zod";

const createCategorySchema = z.object({
    name: z.string().min(1).max(255),
    slug: z.string().min(1).max(100),
    description: z.string().optional(),
    imageUrl: z.string().url().optional(),
    parentId: z.string().uuid().optional(),
    level: z.number().int().min(0).default(0),
});

/**
 * GET /api/categories
 * Get all categories (super-admin only)
 */
export async function GET() {
    try {
        // TODO: Add super-admin auth check
        const categoryList = await adminService.getAllCategories();
        return NextResponse.json(categoryList);
    } catch (error) {
        console.error("Error fetching categories:", error);
        return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
    }
}

/**
 * POST /api/categories
 * Create a new category (super-admin only)
 */
export async function POST(request: NextRequest) {
    try {
        // TODO: Add super-admin auth check
        const body = await request.json();
        const input = createCategorySchema.parse(body);

        const category = await adminService.createCategory(input);
        return NextResponse.json(category, { status: 201 });
    } catch (error) {
        console.error("Error creating category:", error);
        return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
    }
}
