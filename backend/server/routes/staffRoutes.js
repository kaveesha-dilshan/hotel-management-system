import express, { Router } from "express";
import { authorize, protect } from "../middleware/authMiddleware.js";
import { validateStaff } from "../middleware/staffValidation.js";
import validateRequest from "../middleware/validateRequest.js";
import { createStaff, getAllStaff, getStaffById } from "../controllers/staffController.js";

const router = express.Router();

router.post("/create", protect, authorize("owner", "manager"), validateStaff, validateRequest, createStaff);
router.get("/all", protect, authorize("owner","manager"), getAllStaff);
router.get("/:id", protect, authorize("owner", "manager"), getStaffById);

export default router;