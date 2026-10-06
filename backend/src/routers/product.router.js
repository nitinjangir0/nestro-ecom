import express from "express";
const router = express.Router();
import {create,get,deleteById,StatusUpdate,getById,getProductBySlug,update,StatusById,addImages,searchProducts,} from "../controllers/product.controller.js"
import upload from "../middleware/multer.js";
import { protect, authorize } from "../middleware/auth.js";

// ===============================
// PUBLIC / WEBSITE
// ===============================
router.get("/", get);
// Search products
// IMPORTANT: This route must come before /:id
router.get("/search", searchProducts)
// Product by slug
router.get("/slug/:slug", getProductBySlug);
// Product by ID
router.get("/:id", getById);
// ===============================
// ADMIN ONLY
// ===============================
router.post("/create",protect,authorize("admin", "superadmin"),upload.single("image"),create);
router.patch("/status-update/:id",protect,authorize("admin", "superadmin"),StatusUpdate)
router.put("/update/:id",protect,authorize("admin", "superadmin"),upload.single("image"),update);
router.delete("/delete/:id",protect,authorize("admin", "superadmin"),deleteById);
router.patch("/status/:id",protect,authorize("admin", "superadmin"),StatusById);
router.post("/add-multiple-images/:id",protect,authorize("admin", "superadmin"),upload.array("images", 4),
    addImages
);

export default router;