import express from "express";
import homesRoutes from "./routes/homes.js"
import authRoutes from "./routes/auth.js"
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express()

app.use(cors());
app.use(cookieParser());
app.use(express.json())

app.use("/api/homes", homesRoutes)
app.use("/api/auth", authRoutes)

app.listen(8800, () => {
    console.log("connected")
})