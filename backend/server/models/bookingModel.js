import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        guest: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Guest",
            required: [true, "Guest is required"]
        },

        rooms: {
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Room"
                }
            ],
            required: true,
            validate: {
                validator: function (rooms) {
                    return rooms.length > 0;
                },
                message: "A booking must contain at least one room"
            }
        },
        checkInDate: {
            type: Date,
            required: [true, "Check-in data is required"],
            validate: {
                validator: function (value) {
                    return !this.checkOutDate || value < this.checkOutDate;
                },
                message: "Check-in must be before check-out date"
            }
        },

        checkOutDate: {
            type: Date,
            required: [true, "Chech-out date is required"],
            validate: {
                validator: function (value) {
                    return !this.checkInDate || value > this.checkInDate;
                },
                message: "Check-out must be after check-in date"
            }
        },

        numberOfGuests: {
            type: Number,
            required: true,
            min: 1,
            validate: {
                validator: Number.isInteger
            }
        },

        status: {
            type: String,
            required: true,
            enum: ["Pending", "Confirmed", "CheckedIn", "CheckedOut", "Cancelled"],
            default: "Pending"
        },

        totalAmount: {
            type: Number,
            required: true,
            min: 0,
            validate: {
                validator: Number.isFinite
            }
        }
    },
    {
        timestamps: true
    }
)

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;