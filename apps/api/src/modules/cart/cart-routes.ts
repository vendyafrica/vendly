import { Router } from "express";
import {
    getCart,
    updateCartItem,
    removeCartItem,
    clearCart
} from "./cart-controller";

const router = Router();

// Middleware to ensure user is authenticated should be applied here or globally
// router.use(requireAuth); 

router.get("/", getCart);
router.post("/items", updateCartItem);
router.delete("/items/:productId", removeCartItem);
router.delete("/", clearCart);

export const cartRoutes = router;
