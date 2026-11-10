import mongoose from "mongoose";
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


// getAllStaff
export const getAllStaff = async (req, res) => {
    try {
        const staff = await User.find({
            role: { $ne: "owner"}
        }).select("-password");

        res.status(200).json({
            success: true,
            count: staff.length,
            staff
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}


// getStaffById
export const getStaffById = async (req, res) => {
    try {
        const { id } = req.params;

        if(!mongoose.isValidObjectId(id)){
            return res.status(400).json({
                message: "Invalid staff ID"
            })
        }

        const staff = await User.findOne({
            _id: id,
            role: { $ne: "owner" }
        }).select("-password");

        if(!staff){
            return res.status(404).json({
                message: "Staff member not found"
            })
        }

        res.status(200).json({
            success: true,
            staff
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}


// update staff
export const updateStaff = async (req, res) => {
    try {
        const { id } = req.params;

        if(!mongoose.isValidObjectId(id)){
            return res.status(400).json({
                message: "Invalid staff ID"
            })
        }

        const staff = await User.findOne({
            _id: id,
            role: { $ne: "owner" }
        }).select("-password")

        if(!staff){
            return res.status(404).json({
                message: "Staff member not found"
            })
        }

        const allowedFields = ["name", "email", "password", "role"];
        const receivedFields = Object.keys(req.body || {});

        if(receivedFields.length === 0){
            return res.status(400).json({
                message: "Please provide at least one field to update"
            })
        }

        const invalidFields = receivedFields.filter(
            field => !allowedFields.includes(field)
        )

        if(invalidFields.length > 0){
            return res.status(400).json({
                message: "Invalid fields provided",
                invalidFields
            })
        }

        if(req.user.role === "manager" && req.body.role === "manager"){
            return res.status(403).json({
                message: "Managers cannot assign manager role"
            })
        }

        if(req.user.role === "manager" && staff.role === "manager"){
            return res.status(403).json({
                message: "Managers cannot modify other managers"
            })
        }

        if(req.body.role === "owner"){
            return res.status(400).json({
                message: "Cannot assing the owner role through the staff management"
            })
        }

        if(req.body.name !== undefined){
            staff.name = req.body.name;
        }

        if(req.body.email !== undefined){
            const normalizedEmail = req.body.email.trim().toLowerCase();

            const existingEmail = await User.findOne({
                email: normalizedEmail,
                _id: { $ne: id }
            })

            if(existingEmail){
                return res.status(409).json({
                    message: "This email is already registered"
                })
            }

            staff.email = normalizedEmail;
        }

        if(req.body.password !== undefined){
            staff.password = await bcrypt.hash(req.body.password, 10);
        }

        if(req.body.role !== undefined){
            staff.role = req.body.role
        }

        await staff.save();

        res.status(200).json({
            success: true,
            message: "Staff details updated successfully",
            staff: {
                id: staff._id,
                name: staff.name,
                email: staff.email,
                role: staff.role
            }
        })
        
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}