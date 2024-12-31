import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
    },
});



// use for store online users
const userSockets = {};

// get reciver socket id
export const getReciverSocketId = (userId) => {
    return userSockets[userId];
};


io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) userSockets[userId] = socket.id;

    // io.emit is use for sending message to all users
    io.emit("get_online_users", Object.keys(userSockets));

    socket.on("disconnect", () => {
        delete userSockets[userId];
        io.emit("get_online_users", Object.keys(userSockets));
    });
});


export { io, server, app };