import User from "../models/user.model.js";
import { asyncMiddleware } from "../utils/asyncMiddleware.js";
import { ErrorResponse } from "../middleware/errorHandler.js";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../config/cloudinary.js";

// signup user-
export const signup = asyncMiddleware(async (req, res, next) => {
    const { name, email, password} = req.body;
    let avatar = req.body.avatar || null;

    // Check if all fields are provided
    if (!email || !password || !name) {
        return next(new ErrorResponse("Please provide all fields", 400));
    };

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        return next(new ErrorResponse("User already exists", 400));
    };

    // if user send a image 
    if (avatar) {
        try {
            const result = await cloudinary.uploader.upload(avatar, {
                folder: "chat-app/avatars",
                width: 200,
                height: 200,
                crop: "fill",
            });
            avatar = result.secure_url;
        } catch (error) {
            return next(new ErrorResponse(error.message, 400));
        }
    }

    // Create new user 
    const user = await User.create({ name, email, avatar, password });

    // Generate token
    generateToken(user._id, res);

    // Send response
    res.status(201).json({ success: true, data: user });
})

// login user-
export const login = asyncMiddleware(async (req, res, next) => {
    const { email, password } = req.body;

    // Check if all fields are provided
    if (!email || !password) {
        return next(new ErrorResponse("Please provide all fields", 400));
    };

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
        return next(new ErrorResponse("Invalid credentials", 401));
    };

    // Check if password is correct
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return next(new ErrorResponse("Invalid credentials", 401));
    };

    // Generate token
    generateToken(user._id, res);

    // Send response
    res.status(200).json({ success: true, data: user });
})

// logout user-
export const logout = asyncMiddleware(async (req, res, next) => {
    res.cookie("__token", null, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 0,
    });
    res.status(200).json({ success: true, data: {} });
})


// delete user-
export const deleteUser = asyncMiddleware(async (req, res, next) => {
    const id = req.params.id;

    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
        return next(new ErrorResponse("User not found", 404));
    };

    // Delete avatar from cloudinary
    if (user.avatar) {
        const publicId = user.avatar.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
    }

    // Delete user
    await user.remove();

    // Send response
    res.status(200).json({ success: true, data: {} });
})