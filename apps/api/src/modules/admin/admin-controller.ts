import { type Request, type Response } from "express";
import { adminService } from "./admin-service";

export const adminController = {
    // Tenants
    getTenants: async (req: Request, res: Response) => {
        try {
            const result = await adminService.getAllTenants();
            res.json({ success: true, data: result });
        } catch (error) {
            console.error("Error fetching tenants:", error);
            res.status(500).json({ success: false, message: "Failed to fetch tenants" });
        }
    },

    // Stores
    getStores: async (req: Request, res: Response) => {
        try {
            const result = await adminService.getAllStores();
            res.json({ success: true, data: result });
        } catch (error) {
            console.error("Error fetching stores:", error);
            res.status(500).json({ success: false, message: "Failed to fetch stores" });
        }
    },

    // Users
    getUsers: async (req: Request, res: Response) => {
        try {
            const result = await adminService.getAllUsers();
            res.json({ success: true, data: result });
        } catch (error) {
            console.error("Error fetching users:", error);
            res.status(500).json({ success: false, message: "Failed to fetch users" });
        }
    },

    // Categories
    getCategories: async (req: Request, res: Response) => {
        try {
            const result = await adminService.getAllCategories();
            res.json({ success: true, data: result });
        } catch (error) {
            console.error("Error fetching categories:", error);
            res.status(500).json({ success: false, message: "Failed to fetch categories" });
        }
    },

    createCategory: async (req: Request, res: Response) => {
        try {
            const result = await adminService.createCategory(req.body);
            res.status(201).json({ success: true, data: result });
        } catch (error) {
            console.error("Error creating category:", error);
            res.status(500).json({ success: false, message: "Failed to create category" });
        }
    },
};
