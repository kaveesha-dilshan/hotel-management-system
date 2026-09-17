import express from "express";
import "dotenv/config.js";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js"
import { protect, authorize } from "./middleware/authMiddleware.js";

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "HOTEL MANAGMNENT SYSTEM API RUNNING"
    })
})

app.get("/api/test/protected", protect, (req, res) => {
    res.json({
        message: "Protected route working",
        user: req.user
    })
})

app.get(
    "/api/test/owner",
    protect,
    authorize("owner"),
    (req, res) => {
        res.json({
            message: "Owner route working"
        });
    }
);

app.use("/api/auth", authRoutes);

connectDB();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})