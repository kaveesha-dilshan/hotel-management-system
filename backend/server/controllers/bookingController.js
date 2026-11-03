import mongoose from "mongoose";
import Booking from "../models/bookingModel.js";
import Guest from "../models/guestsModel.js";
import Room from "../models/roomModel.js";

export const createBooking = async (req, res) => {
    try {
        const { guest, rooms, checkInDate, checkOutDate, numberOfGuests } = req.body;
        
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

        const roomUnderMaintenance = existingRooms.some(
            room => room.status === "Maintenance"
        );

        if(roomUnderMaintenance) {
            return res.status(400).json({
                message: "Cannot book a room that is under maintenance"
            })
        }

        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);

        // check date is not past day (user entered day sholud be today or future)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (checkIn < today){
            return res.status(400).json({
                message: "Check-in date cannot be in the past"
            })
        }


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
            checkOutDate: { $gt: checkIn }
        });

        // console.log("New check-in:", checkIn);
        // console.log("New check-out:", checkOut);
        // console.log("Conflicting booking:", conflictingBooking);

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


export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate("guest")
            .populate("rooms");

        res.status(200).json({
            bookings
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

export const getBookingsByID = async (req, res) => {
    try {
        const { id } = req.params;

        if(!mongoose.isValidObjectId(id)){
            return res.status(400).json({
                message: "Invalid booking ID"
            })
        }

        const booking = await Booking.findById(id)
            .populate("guest")
            .populate("rooms");

        if(!booking){
            return res.status(404).json({
                message: "Booking not found"
            })
        }

        res.status(200).json({
            booking
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

export const updateBooking = async (req, res) => {
    try {
        const allowedFields = [
            "rooms",
            "checkInDate",
            "checkOutDate",
            "numberOfGuests"
        ];

        const receivedFields = Object.keys(req.body || {});

        if(receivedFields.length === 0) {
            return res.status(400).json({
                message: "Please provide at least one field to update"
            })
        }

        const invalidFields = receivedFields.filter(
            field => !allowedFields.includes(field)
        );

        if(invalidFields.length > 0){
            return res.status(400).json({
                message: `These fields cannot be updated: ${invalidFields.join(", ")}`
            })
        }
        const { id } = req.params;
        
        if(!mongoose.isValidObjectId(id)){
            return res.status(400).json({
                message: "Invalid booking ID"
            })
        }

        const booking = await Booking.findById(id);

        // console.log("Booking rooms:", booking?.rooms);
        // console.log("Request body:", req.body);

        if(!booking){
            return res.status(404).json({
                message: "Booking not found"
            })
        }

        if(["CheckedIn", "CheckedOut", "Cancelled"].includes(booking.status)){
            return res.status(400).json({
                message: `Cannot update booking with status ${booking.status}`
            })
        }

        const { rooms, checkInDate, checkOutDate, numberOfGuests } = req.body;

        const updatedCheckIn = checkInDate ?? booking.checkInDate;
        const updatedCheckOut = checkOutDate ?? booking.checkOutDate;

        const parsedCheckIn = new Date(updatedCheckIn);
        const parsedCheckOut = new Date(updatedCheckOut);

        if( Number.isNaN(parsedCheckIn.getTime()) || Number.isNaN(parsedCheckOut.getTime()) ){
            return res.status(400).json({
                message: "Invalid booking dates"
            })
        }

        if (parsedCheckOut <= parsedCheckIn){
            return res.status(400).json({
                message: "Check-out date must be after the Check-in date"
            })
        }

        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        if (parsedCheckIn < today){
            return res.status(400).json({
                message: "Check-in date cannot be in the past"
            })
        }

        if(rooms !== undefined) {
            if(!Array.isArray(rooms) || rooms.length === 0){
                return res.status(400).json({
                    message: "At least one room is required"
                })
            }

            if (rooms.some(roomId => !mongoose.isValidObjectId(roomId))) {
                return res.status(400).json({
                    message: "One or more room IDs are invalid"
                })
            };

            const uniqueRoomIds = new Set(
                rooms.map(roomId => roomId.toString())
            );

            if (uniqueRoomIds.size !== rooms.length){
                return res.status(400).json({
                    message: "Duplicate room IDs are not allowed"
                })
            }

        }

        const updatedRooms = rooms ?? booking.rooms;

        const existingRooms = await Room.find({
            _id: { $in: updatedRooms }
        })

        // const testRoom = await Room.findById(
        //     "6adc9dc79d7e65a31a8c8ad9"
        // );

        // console.log("Direct ID search:", testRoom);

        // const testRoomNumber = await Room.findOne({
        //     roomNumber: "002"
        // });

        // console.log("Room number search:", testRoomNumber);

        // console.log("Connected database:", Room.db.name);
        // console.log("Room collection:", Room.collection.name);
        // console.log("Database host:", Room.db.host);

        // console.log("Updated rooms:", updatedRooms);
        // console.log("Updated rooms length:", updatedRooms.length);

        // console.log("Found rooms:", existingRooms.map(room => room._id));
        // console.log("Found rooms length:", existingRooms.length)

        // console.log("Database port:", Room.db.port);
        // console.log("Connection state:", Room.db.readyState);

        if(existingRooms.length !== updatedRooms.length) {
            return res.status(400).json({
                message: "One or more rooms not found"
            })
        }

        const roomUnderMaintenance = existingRooms.some(
            room => room.status === "Maintenance"
        )

        if (roomUnderMaintenance){
            return res.status(400).json({
                message: "One or more rooms are in maintenance"
            })
        }

        const updatedNumberOfGuests = numberOfGuests !== undefined ? numberOfGuests : booking.numberOfGuests;

        if(!Number.isInteger(updatedNumberOfGuests) || updatedNumberOfGuests < 1){
            return res.status(400).json({
                message: "Number of guests must be positive or whole number"
            })
        }

        const totalCapacity = existingRooms.reduce(
            (total, room) => total + room.capacity,
            0
        )

        if (updatedNumberOfGuests > totalCapacity){
            return res.status(400).json({
                message: `Selected rooms can accomodate only ${totalCapacity} guests`
            })
        }

        const conflictingBooking = await Booking.findOne({
            _id: { $ne: booking._id },
            rooms: { $in: updatedRooms },
            status: { $in: ["Pending", "Confirmed", "CheckedIn"] },
            checkInDate: { $lt: parsedCheckOut },
            checkOutDate: { $gt: parsedCheckIn}
        })

        if (conflictingBooking){
            return res.status(409).json({
                message: "One or more rooms are already book for these dates"
            })
        }

        const millisecondsPerDay = 1000 * 60 * 60 * 24;

        const nights = Math.ceil(
            (parsedCheckOut.getTime() - parsedCheckIn.getTime()) / millisecondsPerDay
        )

        const pricePerNight = existingRooms.reduce(
            (total, room) => total + room.pricePerNight,
            0
        )

        const updatedTotalAmount = pricePerNight * nights;

        booking.rooms = updatedRooms;
        booking.checkInDate = parsedCheckIn;
        booking.checkOutDate = parsedCheckOut;
        booking.numberOfGuests = updatedNumberOfGuests;
        booking.totalAmount = updatedTotalAmount;

        await booking.save();

        await booking.populate(["guest", "rooms"]);

        return res.status(200).json({
            message: "Booking updated successfully",
            booking
        })

        // if(rooms !== undefined){
        //     booking.rooms = rooms;
        // }

        // if(checkInDate !== undefined){
        //     booking.checkInDate = parsedCheckIn;
        // }

        // if(checkOutDate !== undefined){
        //     booking.checkOutDate = parsedCheckOut;
        // } 

        // if(numberOfGuests !== undefined){
        //     booking.numberOfGuests = numberOfGuests;
        // }

        // await booking.save();

        // res.status(200).json({
        //     message: "booking update successfully!..",
        //     booking
        // })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

export const cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;

        if(!mongoose.isValidObjectId(id)){
            return res.status(400).json({
                message: "Invalid booking ID"
            })
        }

        const booking = await Booking.findById(id);

        if(!booking){
            return res.status(404).json({
                message: "Booking not found"
            })
        }

        if(["CheckedIn", "CheckedOut", "Cancelled"].includes(booking.status)){
            return res.status(409).json({
                message: `Cannot cancel the bookings on ${booking.status}`
            })
        }

        booking.status = "Cancelled";

        await booking.save();

        return res.status(200).json({
            message: "Booking cancelled successfully",
            booking
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}


export const checkInBooking = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)){
            return res.status(400).json({
                message: "Invalid booking ID"
            })
        }

        const booking = await Booking.findById(id);

        if(!booking){
            return res.status(404).json({
                message: "Booking not found"
            })
        }

        if(booking.status !== "Confirmed"){
            return res.status(409).json({
                message: `Cannot check in a booking with status: ${booking.status}`
            })
        }

        const today = new Date();
        const checkInDate = new Date(booking.checkInDate);

        today.setUTCHours(0, 0, 0, 0);
        checkInDate.setUTCHours(0, 0, 0, 0);

        if(today < checkInDate){
            return res.status(400).json({
                message: "Check-in date has not arrived yet"
            })
        }

        const rooms = await Room.find({
            _id: { $in: booking.rooms }
        })

        if(rooms.length !== booking.rooms.length){
            return res.status(409).json({
                message: "one or more booked rooms could not find"
            })
        }

        const unavailableRoom = rooms.some(
            room => room.status !== "Available"
        )

        if(unavailableRoom){
            return res.status(409).json({
                message: "One or more rooms are not available for check-in"
            })
        }

        booking.status = "CheckedIn";

        await Room.updateMany(
            {_id: { $in: booking.rooms}},
            {$set: { status: "Occupied"}}
        )

        await booking.save();

        await booking.populate(["guest", "rooms"])

        res.status(200).json({
            message: "Guest checked in successfully",
            booking
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}