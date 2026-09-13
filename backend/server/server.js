import express from "express";
import "dotenv/config.js";
import connectDB from "./config/db.js";

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "HOTEL MANAGMNENT SYSTEM API RUNNING"
    })
})

connectDB();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})