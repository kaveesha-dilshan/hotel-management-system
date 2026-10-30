import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createBooking, getAllBookings, getBookingsByID} from "../controllers/bookingController.js";

const router = express.Router();

router.post("/createBooking", protect, createBooking);
router.get("/allBookings", protect, getAllBookings);
router.get("/:id", protect, getBookingsByID);

export default router;