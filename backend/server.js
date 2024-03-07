import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import connectToMongoDB from "./db/connectToMongoDB.js";
import authRoutes from "./routes/authRoutes.js";


dotenv.config();
const app = express();
const PORT = process.env.PORT || 50000;


app.use(express.json());
app.use(cookieParser());

app.use("/api/auth",authRoutes);

app.get("/", (req, res) => {
    res.send("Hello World")
});


app.listen(PORT, () => {
    connectToMongoDB();
    console.log(`Server is running on PORT ${PORT}`);
})