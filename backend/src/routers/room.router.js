import express from "express";
const router = express.Router();
import { create, get, deleteById, StatusUpdate, getById } from "../controllers/room.controller.js";


router.get("/", get);
router.post("/create", create);
router.patch("/status-update/:id", StatusUpdate);
router.delete("/delete/:id", deleteById);
router.get("/:id", getById);

export default router