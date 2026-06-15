import express from "express";
const router = express.Router();
import { create, get, deleteById, StatusUpdate, getById, update, StatusById } from "../controllers/product.controller.js";
import upload from "../middleware/multer.js"


router.get("/", get);
router.post("/create", upload.single("image"), create);
router.patch("/status-update/:id", StatusUpdate);
router.put("/update/:id", upload.single("image"), update);
router.delete("/delete/:id", deleteById);
router.get("/:id", getById);
router.put("/status/:id", StatusById);

export default router