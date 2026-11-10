import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

export const createStaff = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

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
                message: "An account with this email already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newStaff = await User.create({
            name,
            email: email.trim().toLowerCase(),
            password: hashedPassword,
            role: assignedRole
        })

        res.status(201).json({
            message: "Staff account creation successfully",
            id: newStaff._id,
            name: newStaff.name,
            email: newStaff.email,
            role: newStaff.role
        })


    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}