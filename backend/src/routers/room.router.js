import express from "express";
const router = express.Router();
import { create, get, deleteById, StatusUpdate, getById } from "../controllers/room.controller.js";
import { protect, authorize } from "../middleware/auth.js";
// ===============================
// PUBLIC / WEBSITE
// ===============================
router.get("/", get);
router.get("/:id", getById);
// ===============================
// ADMIN ONLY
// ===============================
router.post("/create", protect, authorize("admin", "superadmin"), create);
router.patch("/status-update/:id", protect, authorize("admin", "superadmin"), StatusUpdate);
router.delete("/delete/:id", protect, authorize("admin", "superadmin"), deleteById);

export default router;