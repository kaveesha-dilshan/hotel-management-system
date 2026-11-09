import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

export const createStaff = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if(!name || !email || !password){
            return res.status(400).json({
                message: "Name, email and password are required"
            })
        }

        const assignedRole = role || "staff";

        if (req.user.role === "manager" && assignedRole === "manager"){
            return res.status(403).json({
                message: "Managers cannot create other managers"
            })
        }

        const existingUser = await User.findOne({
            email: email.trim().toLowerCase()
        })

        if(existingUser){
            return res.status(409).json({
                message: "An account with this email ready exists"
            })
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}