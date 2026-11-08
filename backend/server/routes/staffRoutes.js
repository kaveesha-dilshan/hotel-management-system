import express, { Router } from "express";
import { authorize, protect } from "../middleware/authMiddleware.js";
import { validateStaff } from "../middleware/staffValidation.js";
import validateRequest from "../middleware/validateRequest.js";
import { createStaff } from "../controllers/staffController.js";

const router = express.Router();

router.post("/create", protect, authorize("owner", "manager"), validateStaff, validateRequest, createStaff);

export default router;