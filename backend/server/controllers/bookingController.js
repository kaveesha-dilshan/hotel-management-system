import mongoose from "mongoose";
import Booking from "../models/bookingModel.js";
import Guest from "../models/guestsModel.js";
import Room from "../models/roomModel.js";

export const createBooking = async (req, res) => {
    try {
        const { guest, rooms, checkInDate, checkOutDate, numberOfGuests, status } = req.body;
        
        if(!guest || !rooms || !checkInDate || !checkOutDate || !numberOfGuests){
            return res.status(400).json({
                message: "All feilds required!"
            })
        }
        
        if(!mongoose.isValidObjectId(guest)){
            return res.status(400).json({
                message: "Invalid guest ID"
            })
        }

        if(!Array.isArray(rooms) || rooms.length === 0) {
            return res.status(400).json({
                message: "At least one room required"
            }) 
        }

        const uniqueRoomIds = new Set(rooms.map(roomId => roomId.toString()));

        if(uniqueRoomIds.size !== rooms.length) {
            return res.status(400).json({
                message: "Duplicate room IDs are not allowed"
            })
        }

        // Check room IDs here, outside the previous if block
        const invalidRoomId = rooms.some(
            (roomId) => !mongoose.isValidObjectId(roomId)
        );

        if (invalidRoomId) {
            return res.status(400).json({
                message: "One or more room IDs are invalid"
            });
        }

        const existingRooms = await Room.find({
            _id: { $in: rooms }
        })

        if(existingRooms.length !== rooms.length){
            return res.status(404).json({
                message: "One or more rooms were not found"
            })
        }

        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);


        const millisecondsPerDay = 1000 * 60 * 60 * 24;
        const nights = Math.ceil(
            (checkOut.getTime() - checkIn.getTime()) / millisecondsPerDay
        );

        const pricePerNight = existingRooms.reduce(
            (total, room) => total + room.pricePerNight,
            0
        )

        const totalAmount = pricePerNight * nights;
 
        if( Number.isNaN(checkIn.getTime()) || Number.isNaN(checkOut.getTime())) {
            return res.status(400).json({
                message: "check-in or check-out dates invalid"
            })
        }

        if(checkOut <= checkIn){
            return res.status(400).json({
                message: "check-out must be after check-in"
            })
        }

        if(!Number.isInteger(numberOfGuests) || numberOfGuests < 1){
            return res.status(400).json({
                message: "Number of guest must be positive whole number"
            })
        }

        const existingGuest = await Guest.findById(guest);

        if(!existingGuest){
            return res.status(404).json({
                message: "Guest not founded"
            })
        }

        const totalCapacity = existingRooms.reduce(
            (total, room) => total + room.capacity,
            0
        );

        if(numberOfGuests > totalCapacity) {
            return res.status(400).json({
                message: `These rooms can accommodate only ${totalCapacity} guests`
            })
        }

        const conflictingBooking  = await Booking.findOne({
            rooms: { $in: rooms },
            status: { $in: ["Pending", "Confirmed", "CheckedIn"] },
            checkInDate: { $lt: checkOut},
            checkOutDate: {$gt: checkIn }
        });

        if (conflictingBooking) {
            return res.status(409).json({
                message: "One or more rooms are already booked for these dates"
            })
        }
        const booking = await Booking.create({
            guest, 
            rooms, 
            checkInDate, 
            checkOutDate, 
            numberOfGuests, 
            status, 
            totalAmount
        })

        res.status(200).json({
            message: "Booking created successfully",
            booking: {
                id: booking._id,
                guest: booking.guest,
                rooms: booking.rooms,
                checkInDate: booking.checkInDate,
                checkOutDate: booking.checkOutDate,
                numberOfGuests: booking.numberOfGuests,
                status: booking.status,
                totalAmount: booking.totalAmount
            }
        })

        // console.log("Room prices:", existingRooms.map(room => room.pricePerNight));
        // console.log("Nights:", nights);
        // console.log("Total amount:", totalAmount);

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}