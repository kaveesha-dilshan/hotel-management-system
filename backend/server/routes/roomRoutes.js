import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js"
import { createRoom, getAllRooms, getRoomByID, updaterRoom } from "../controllers/roomController.js";


const router = express.Router();

router.post("/createRoom", protect, authorize("owner", "manager"), createRoom);
router.get("/getAllRooms", getAllRooms);
router.get("/:id", protect, getRoomByID);
router.put("/:id", protect, authorize("owner","manager"), updaterRoom);

export default router;