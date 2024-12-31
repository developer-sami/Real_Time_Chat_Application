import express from "express";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import db from "./lib/db.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors"
import { app, server } from "./lib/socket.js";
import { errorHandler } from "./middleware/errorHandler.js";

app.use(express.json({ limit: '15mb' }));
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Authorization"]  // allow specific headers in requests
}));

// load env variables
dotenv.config();

// user routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/message", messageRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log("server started on port " + PORT);
    db();
});