import express from "express";
import { authorize, protect } from "../middleware/authMiddleware.js";
import { cancelBooking, checkInBooking, checkOutBooking, confirmBooking, createBooking, getAllBookings, getBookingsByID, updateBooking} from "../controllers/bookingController.js";

const router = express.Router();

router.post("/createBooking", protect, authorize("owner", "manager", "receptionist"), createBooking);
router.get("/allBookings", protect, authorize("owner", "manager", "receptionist"), getAllBookings);
router.get("/:id", protect, authorize("owner", "manager", "receptionist"), getBookingsByID);
router.patch("/:id", protect, authorize("owner", "manager", "receptionist"), updateBooking);
router.patch("/:id/cancel", protect, authorize("owner", "manager", "receptionist"), cancelBooking);
router.patch("/:id/check-in", protect, authorize("owner", "manager", "receptionist"), checkInBooking);
router.patch("/:id/confirmBooking", protect, authorize("owner", "manager", "receptionist"), confirmBooking);
router.patch("/:id/check-out", protect, authorize("owner", "manager", "receptionist"), checkOutBooking);

export default router;