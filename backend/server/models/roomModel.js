import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
    {
        roomNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        roomType: {
            type: String,
            enum: ["Single", "Double", "Deluxe", "Suite"],
            required: true
        },

        pricePerNight: {
            type: Number,
            required: true,
            min: 0
        },

        capacity: {
            type: Number,
            required: true,
            min: 11
        },

        status: {
            type: String,
            enum: ["Available", "Occupied", "Maintenance"],
            default: "Available"
        }
    },
    {
        timestamps: true
    }
)

const Room = mongoose.model("Room", roomSchema);

export default Room;