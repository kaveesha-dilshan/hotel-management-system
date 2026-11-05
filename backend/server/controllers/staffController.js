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
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}