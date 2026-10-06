import express from "express";
const router = express.Router();
import { protect } from "../middleware/auth.js";
import { syncCart,addToCart,removeFromCart,qty,clearCart } from "../controllers/cart.controller.js";

router.post("/sync-cart", protect, syncCart);
router.post("/add-to-cart", protect, addToCart);
router.post("/remove-from-cart", protect, removeFromCart);
router.post("/qty", protect, qty);
router.delete("/clear-cart", protect, clearCart);

export default router;