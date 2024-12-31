import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import { asyncMiddleware } from "../utils/asyncMiddleware.js";
import { ErrorResponse } from "../middleware/errorHandler.js";
import cloudinary from "../config/cloudinary.js";
import { io, getReciverSocketId } from "../lib/socket.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// create pdf folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pdfFolder = path.join(__dirname, "pdf");

if (!fs.existsSync(pdfFolder)) {
    fs.mkdirSync(pdfFolder, { recursive: true });
}

// get all users from database to show in the sidebar
export const getAllUser = asyncMiddleware(async (req, res, next) => {
    const id = req.user.id;

    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
        return next(new ErrorResponse("User not found", 404));
    };

    // get all user 
    const users = await User.find({ _id: { $ne: id } });
    res.status(200).json({ success: true, data: users });
});

// get all message from 2 users for show them in the chat box
export const getMessage = asyncMiddleware(async (req, res, next) => {
    const { id: userToChatId } = req.params; // ID of the other user
    const myId = req.user.id; // Authenticated user's ID

    // Validate input
    if (!myId || !userToChatId) {
        return res.status(400).json({ success: false, message: "Invalid user IDs" });
    }

    // Fetch messages between the two users
    const messages = await Message.find({
        $and: [
            {
                $or: [
                    { senderId: myId, reciverId: userToChatId },
                    { senderId: userToChatId, reciverId: myId },
                ],
            },
        ],
    }).sort({ createdAt: 1 }); // Sort by creation date (ascending)

    return res.status(200).json({ success: true, messages });
});


// send message to other user
export const sendMessage = asyncMiddleware(async (req, res, next) => {
    const logingUserId = req.user.id;
    const otherUserId = req.params.id;
    const { text, image, pdf } = req.body;

    // Check if user exists
    const user = await User.findById(logingUserId);
    if (!user) {
        return next(new ErrorResponse("User not found", 404));
    }

    // Handle image upload
    let cloud_image = null;
    if (image) {
        const result = await cloudinary.uploader.upload(image, {
            folder: "chat-app/messages",
        });
        cloud_image = result;
    }

    // Handle PDF upload
    let pdf_url = null;
    if (pdf) {
        try {
            // Decode Base64 PDF data and save it locally
            const base64Data = pdf.replace(/^data:application\/pdf;base64,/, "");
            const pdfFileName = `upload_${Date.now()}.pdf`;
            const pdfFilePath = path.join(pdfFolder, pdfFileName);

            // Save the PDF
            fs.writeFileSync(pdfFilePath, Buffer.from(base64Data, "base64"));

            // Set the local file path as the URL (you can adjust this for your frontend)
            pdf_url = `/pdf/${pdfFileName}`;
        } catch (error) {
            console.error("Error saving PDF:", error);
            return next(new ErrorResponse("Failed to process PDF upload", 500));
        }
    }

    // Create and save the message
    const message = await Message.create({
        senderId: logingUserId,
        reciverId: otherUserId,
        text,
        image: {
            url: cloud_image ? cloud_image.secure_url : null,
            public_id: cloud_image ? cloud_image.public_id : null,
        },
        pdf: {
            url: pdf_url ? pdf_url : null,
            public_id: pdf_url ? pdf_url : null,
        },
    });

    // Emit the new message event using Socket.IO
    const reciverSocketId = getReciverSocketId(otherUserId);
    if (reciverSocketId) {
        io.to(reciverSocketId).emit("newMessage", message);
        console.log(`Message sent to receiver's socket: ${reciverSocketId}`);
    }

    // Respond with the created message
    res.status(200).json({ success: true, data: message });
});

// delete message with cloud image
export const deleteMessage = asyncMiddleware(async (req, res, next) => {
    const message_id = req.params.id;

    // Check if message exists
    const message = await Message.findById(message_id);
    if (!message) {
        return next(new ErrorResponse("Message not found", 404));
    };

    // Check if sender is the same as logged in user
    if (message.senderId.toString() !== req.user.id) {
        return next(new ErrorResponse("Unauthorized", 401));
    };

    // Delete image from cloudinary
    if (message.image.public_id) {
        try {
            await cloudinary.uploader.destroy(message.image.public_id);
        } catch (error) {
            console.log(error);
        }
    }
    // Delete pdf from cloudinary
    if (message.pdf.public_id) {
        try {
            await cloudinary.uploader.destroy(message.pdf.public_id);
        } catch (error) {
            console.log(error);
        }
    }

    // Delete message
    await Message.findByIdAndDelete(message_id);

    res.status(200).json({ success: true, data: {} });
});