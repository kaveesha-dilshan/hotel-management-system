import mongoose from "mongoose";

const userShema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            trime: true,
            lowercase: true
        },

        password: {
            type: String,
            required: true
        },

        role: {
            type: String,
            enum: ["owner", "manager", "receptionist", "staff"],
            default: "staff"
        }
    },
    {
        timestamps: true
    }
);

const User = mongoose.model("User", userShema);

export default User;