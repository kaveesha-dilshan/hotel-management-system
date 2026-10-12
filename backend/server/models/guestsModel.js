import mongoose from "mongoose";

const guestSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            lowercase: true
        },

        phone: {
            type: String,
            required: true,
            trim: true
        },

        address: {
            type: String,
            trim: true,
            default: ""
        },

        idNumber: {
            type: String,
            required: true,
            trim: true
        }
    },
    {
        timestamps: true
    }
)

const Guest = mongoose.model("Guest", guestSchema);

export default Guest;