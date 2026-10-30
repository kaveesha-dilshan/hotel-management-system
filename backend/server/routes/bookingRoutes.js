import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createBooking, getAllBookings} from "../controllers/bookingController.js";

const router = express.Router();

router.post("/createBooking", protect, createBooking);
router.get("/allBookings", protect, getAllBookings);

export default router;