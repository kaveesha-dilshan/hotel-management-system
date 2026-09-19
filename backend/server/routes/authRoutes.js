import express from "express";
import { createOwner, loginUser, registerUser } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/setup-owner", createOwner);

export default router;