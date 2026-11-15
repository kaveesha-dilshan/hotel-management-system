import express from "express";
import { authorize, protect } from "../middleware/authMiddleware.js";
import { createGuest, getAllGuests, getGuestById, updateGuests } from "../controllers/guestController.js";

const router = express.Router();

router.post("/create", protect, authorize("owner", "manager", "receptionist"), createGuest);
router.get("/all", protect, authorize("owner", "manager", "receptionist"), getAllGuests);
router.get("/:id", protect, authorize("owner", "manager", "receptionist"), getGuestById);
router.put("/:id", protect, authorize("owner", "manager", "receptionist"), updateGuests);

export default router;