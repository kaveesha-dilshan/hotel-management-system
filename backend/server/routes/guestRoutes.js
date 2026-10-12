import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createGuest } from "../controllers/guestController.js";

const router = express.Router();

router.post("/create", protect, createGuest);

export default router;