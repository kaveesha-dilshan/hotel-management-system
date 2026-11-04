import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { cancelBooking, checkInBooking, confirmBooking, createBooking, getAllBookings, getBookingsByID, updateBooking} from "../controllers/bookingController.js";

const router = express.Router();

router.post("/createBooking", protect, createBooking);
router.get("/allBookings", protect, getAllBookings);
router.get("/:id", protect, getBookingsByID);
router.patch("/:id", protect, updateBooking);
router.patch("/:id/cancel", protect, cancelBooking);
router.patch("/:id/check-in", protect, checkInBooking);
router.patch("/:id/confirmBooking", protect, confirmBooking);

export default router;