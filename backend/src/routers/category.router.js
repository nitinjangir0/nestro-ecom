import express from "express";
const router = express.Router();
import { create, get, deleteById, StatusUpdate, getById, update } from "../controllers/category.controller.js";

import upload from "../middleware/multer.js";
import { protect, authorize } from "../middleware/auth.js";
// ===============================
// PUBLIC / WEBSITE
// ===============================
router.get("/", get); router.get("/:id", getById);
// ===============================
// ADMIN ONLY
// ===============================
router.post("/create", protect, authorize("admin", "superadmin"), upload.single("image"), create);
router.patch("/status-update/:id", protect, authorize("admin", "superadmin"), StatusUpdate);
router.put("/update/:id", protect, authorize("admin", "superadmin"), upload.single("image"),
 update);
router.delete("/delete/:id", protect, authorize("admin", "superadmin"), deleteById);

export default router;