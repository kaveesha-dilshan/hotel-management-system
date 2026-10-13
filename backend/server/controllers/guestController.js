import mongoose from "mongoose";
import Guest from "../models/guestsModel.js";

export const createGuest = async (req, res) => {
    try {
        const { fullName, email, phone, address, idNumber } = req.body;

        if( !fullName || !phone || !idNumber ) {
            return res.status(400).json({
                message: "Full name, phone number and ID number required"
            })
        }

        const existingGuest = await Guest.findOne({ idNumber });
        
        if (existingGuest) {
            return res.status(409).json({
                message: "Guest already exists",
                guest: existingGuest
            })
        }

        const guest = await Guest.create({
            fullName, email, phone, address, idNumber
        })

        res.status(201).json({
            message: "Guest created successfully",
            guest
        })
    } catch (error) {
        res.status(500).json({
            message: error.messsage
        })
    }
}


// get all guests
export const getAllGuests = async (req, res) => {
    try {
        const guests = await Guest.find().sort({ createdAt: -1 });

        res.status(200).json({
            count: guests.length,
            guests
        })
    } catch (error) {
        res.status(500).json({
            message: error.messsage
        })
    }
}


// get user by id
export const getGuestById = async (req, res) => {
    try {
        const { id } = req.params;

        if(!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "Invalid Guest Id"
            })
        }

        const guest = await Guest.findById(id);

        if(!guest){
            return res.status(404).json({
                message: "Guest not found"
            })
        }

        res.status(200).json({
            guest
        })
    } catch (error) {
        res.status(500)({
            message: error.message
        })
    }
}


//update guest by id
export const updateGuests = async (req, res) => {
    try {
        const { id } = req.params;

        if(!mongoose.isValidObjectId(id)){
            return res.status(400).json({
                message: "Invalid Guest Id"
            })
        }

        const guest = await Guest.findById(id);

        if(!guest){
            return res.status(404).json({
                message: "Guest not found"
            })
        }

        const { fullName, email, phone, address, idNumber } = req.body;

        // update only user provide. Others remain as previous
        if(fullName !== undefined) {
            guest.fullName = fullName;
        }

        if(email !== undefined) {
            guest.email = email;
        }

        if(phone !== undefined) {
            guest.phone = phone
        }

        if(address !== undefined) {
            guest.address = address
        }

        if(idNumber !== undefined) {
            guest.idNumber = idNumber
        }

        await guest.save();

        res.status(200).json({
            message: "Guest detail updated",
            guest
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}