import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createBooking, getAllBookings, getBookingsByID, updateBooking} from "../controllers/bookingController.js";

const router = express.Router();

router.post("/createBooking", protect, createBooking);
router.get("/allBookings", protect, getAllBookings);
router.get("/:id", protect, getBookingsByID);
router.put("/:id", protect, updateBooking);

export default router;