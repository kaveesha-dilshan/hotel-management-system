import mongoose from "mongoose";
import Room from "../models/roomModel.js";

export const createRoom = async (req, res) => {
    try {
        const { roomNumber, roomType, pricePerNight, capacity } = req.body;

        if (!roomNumber || !roomType || pricePerNight === undefined || capacity === undefined) {
            return res.status(400).json({
                message: "All fields are required"
            })
        }

        const existingRoom = await Room.findOne({
            roomNumber
        })

        if (existingRoom) {
            return res.status(400).json({
                message: "Room already exists"
            })
        }

        const room = await Room.create({
            roomNumber,
            roomType,
            pricePerNight,
            capacity
        })

        res.status(201).json({
            message: "Room created successfully",
            room: {
                id: room._id,
                RoomNumber: room.roomNumber,
                Type: room.roomType,
                price: room.pricePerNight,
                capacity: room.capacity
            }
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

export const getAllRooms = async (req, res) => {
    try {
        const rooms = await Room.find().sort({
            roomNumber: 1
        })

        res.status(200).json({
            const: rooms.length,
            rooms
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

export const getRoomByID = async (req, res) => {
    try {
        const { id } = req.params;

        if(!mongoose.isValidObjectId(id)){
            return res.status(400).json({
                message: "Invalid room ID"
            })
        }

        const room = await Room.findById(id);

        if(!room) {
            return res.status(404).json({
                message: "Room not found"
            })
        }

        res.status(201).json({
            room
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

export const updaterRoom = async (req, res) => {
    try {
        const { id } = req.params;

        if(!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "Invalid room ID"
            })
        }

        const room = await Room.findById(id);

        if(!room) {
            return res.status(404)({
                message: "Room not found"
            })
        }

        const { roomNumber, roomType, pricePerNight, capacity, status } = req.body;

        // update only user provided. others remain as previous
        if(roomNumber !== undefined) {
            room.roomNumber = roomNumber;
        }

        if(roomType !== undefined) {
            room.roomType = roomType;
        }

        if(pricePerNight !== undefined){
            room.pricePerNight = pricePerNight;
        }

        if(capacity !== undefined){
            room.capacity = capacity;
        }

        if(status !== status){
            room.status = status;
        }

        await room.save();

        res.status(200).json({
            message: "Room detail updated",
            room
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

export const deleteRoom = async (req, res) => {
    try {
        const { id } = req.params;

        if(!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "Invaild room ID"
            })
        }

        const room = await Room.findById(id);

        if(!room){
            return res.status(404).json({
                message: "Room not found"
            })
        }

        await Room.findByIdAndDelete(id);

        res.status(201).json({
            message: "Room deleted successfully!"
        })
    } catch (error) {
        req.status(500).json({
            message: error.message
        })
    }
}