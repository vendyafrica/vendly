import { Router } from "express";
import { adminController } from "./admin-controller";

const router = Router();

// Tenants
router.get("/tenants", adminController.getTenants);

// Stores
router.get("/stores", adminController.getStores);

// Users
router.get("/users", adminController.getUsers);

// Categories
router.get("/categories", adminController.getCategories);
router.post("/categories", adminController.createCategory);

export const adminRoutes: Router = router;
