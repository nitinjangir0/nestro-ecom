import express from "express";
import { addToWishlist, removeFromWishlist, getWishlist, checkWishlist, } from "../controllers/wishlist.controller.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();
router.post("/add/:productId", protect, addToWishlist);
router.delete("/remove/:productId", protect, removeFromWishlist);
router.get("/", protect, getWishlist);
router.get("/check/:productId", protect, checkWishlist);

export default router;