import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js"
import { createRoom, getAllRooms, getRoomByID } from "../controllers/roomController.js";


const router = express.Router();

router.post("/createRoom", protect, authorize("owner", "manager"), createRoom);
router.get("/getAllRooms", getAllRooms);
router.get("/:id", protect, getRoomByID);

export default router;