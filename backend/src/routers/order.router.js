import express from "express";
const router = express.Router();
import { protect } from "../middleware/auth.js";
import { place, verifyPayment, myOrders, getOrderById, cancelOrder } from "../controllers/order.controller.js";

router.post("/place", protect, place);
router.post("/verify", protect, verifyPayment);
router.get("/my-orders", protect, myOrders);
router.patch("/cancel/:orderId",protect,cancelOrder);
router.get("/:orderId", protect, getOrderById);

export default router;