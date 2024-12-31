import express from "express";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import db from "./lib/db.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors"
import { app, server } from "./lib/socket.js";
import { errorHandler } from "./middleware/errorHandler.js";
import path from "path";

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

const __dirname = path.resolve();

// serve static files in production mode
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
}

server.listen(PORT, () => {
    console.log("server started on port " + PORT);
    db();
});