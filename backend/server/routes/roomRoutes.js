import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js"
import { createRoom, deleteRoom, getAllRooms, getRoomByID, markRoomAsAvailable, updaterRoom } from "../controllers/roomController.js";


const router = express.Router();

router.post("/createRoom", protect, authorize("owner", "manager"), createRoom);
router.get("/getAllRooms", getAllRooms);
router.get("/:id", protect, getRoomByID);
router.put("/:id", protect, authorize("owner","manager"), updaterRoom);
router.delete("/:id", protect, authorize("owner", "manager"), deleteRoom);
router.patch("/:id/available", protect, authorize("owner", "manager", "staff"), markRoomAsAvailable);

export default router;