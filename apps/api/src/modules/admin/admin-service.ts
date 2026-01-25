import { adminRepository } from "./admin-repository";
import type { NewCategory } from "@vendly/db/schema";

export const adminService = {
    // Tenants
    getAllTenants: async () => {
        const tenants = await adminRepository.findAllTenants();
        const stats = await adminRepository.getTenantStats();
        return { tenants, stats };
    },

    // Stores
    getAllStores: async () => {
        const stores = await adminRepository.findAllStores();
        const stats = await adminRepository.getStoreStats();
        return { stores, stats };
    },

    // Users
    getAllUsers: async () => {
        return await adminRepository.findAllUsers();
    },

    // Categories
    getAllCategories: async () => {
        return await adminRepository.findAllCategories();
    },

    createCategory: async (data: NewCategory) => {
        return await adminRepository.createCategory(data);
    },
};
