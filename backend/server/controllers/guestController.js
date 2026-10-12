import Guest from "../models/guestsModel.js";

export const createGuest = async (req, res) => {
    try {
        const { fullName, email, phone, address, idNumber } = req.body;

        if( !fullName || !phone || !idNumber ) {
            return res.status(400).json({
                messsage: "Full name, phone number and ID number required"
            })
        }

        const existingGuest = await Guest.findOne({ idNumber });
        
        if (existingGuest) {
            return res.status(409).json({
                messsage: "Guest already exists",
                guest: existingGuest
            })
        }

        const guest = await Guest.create({
            fullName, email, phone, address, idNumber
        })

        res.status(201).json({
            messsage: "Guest created successfully",
            guest
        })
    } catch (error) {
        res.status(500).json({
            messsage: error.messsage
        })
    }
}