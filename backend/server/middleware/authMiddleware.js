import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({

                message: "Not authorized, token missing"
            })
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        )
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({
                message: "User not found"
            })
        }

        if(!user.isActive){
            return res.status(403).json({
                message: "Your account has been deactivated"
            })
        }

        req.user = user;

        req.user = user;

        // console.log("PROTECT MIDDELEWARE: ");
        // console.log("User ID: ", req.user._id);
        // console.log("User Role: ", req.user.role)

        next();

    } catch (error) {
        return res.status(401).json({
            message: "Not authorized, invaild token"
        })
    }
}

export const authorize = (...roles) => {
    return (req, res, next) => {

        // console.log("AUTHORIZE MIDDLEWARE:");
        // console.log("User:", req.user);
        // console.log("Allowed roles:", roles);
        // console.log("User role:", req.user?.role);

        if(!req.user){
            return res.status(401).json({
                message: "Not authorized. Please log in"
            })
        }


        // console.log("User role:", req.user.role);
        // console.log("Allowed roles:", roles);
        // console.log("Is role allowed:", roles.includes(req.user.role));

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: "Access denied"
            })
        }

        // console.log("AUTHORIZE MIDDELEWARE: ");
        // console.log("User: ", req.user);
        next();
    }
}