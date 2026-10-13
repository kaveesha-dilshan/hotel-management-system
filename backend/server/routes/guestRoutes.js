import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createGuest, getAllGuests, getGuestById, updateGuests } from "../controllers/guestController.js";

const router = express.Router();

router.post("/create", protect, createGuest);
router.get("/all", protect, getAllGuests);
router.get("/:id", protect, getGuestById);
router.put("/:id", protect, updateGuests);

export default router;