import User from "../models/user.model.js";
import { asyncMiddleware } from "../utils/asyncMiddleware.js";
import { ErrorResponse } from "../middleware/errorHandler.js";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../config/cloudinary.js";


// user profile
export const profile = asyncMiddleware(async (req, res, next) => {
    res.status(200).json({ success: true, data: req.user });
});

// signup user-
export const signup = asyncMiddleware(async (req, res, next) => {
    const { name, email, password } = req.body;

    // Check if all fields are provided
    if (!email || !password || !name) {
        return next(new ErrorResponse("Please provide all fields", 400));
    };

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        return next(new ErrorResponse("User already exists", 400));
    };

    // Create new user 
    const user = await User.create({
        name, email, password, avatar: {
            url: null,
            public_id: null
        }
    });

    // Generate token
    generateToken(user._id, res);

    // Send response
    res.status(201).json({ success: true, data: user });
});

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
});

// logout user-
export const logout = asyncMiddleware(async (req, res, next) => {
    res.cookie("__token", null, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 0,
    });
    res.status(200).json({ success: true, data: {} });
});

// update user-
export const updateUser = asyncMiddleware(async (req, res, next) => {
    const id = req.user.id;
    let avatar = req.body.avatar || null;

    const { name, email } = req.body;

    // Check if all fields are provided
    if (!email || !name) {
        return next(new ErrorResponse("Please provide all fields", 400));
    };

    // Check if email is unique
    const emailExists = await User.findOne({ email });
    if (emailExists && emailExists._id.toString() !== id) {
        return next(new ErrorResponse("Email already exists", 400));
    };

    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
        return next(new ErrorResponse("User not found", 404));
    };

    // Upload avatar if provided 
    let avatarUrl = null;
    let avatarPublicId = null;

    if (avatar) {
        try {

            // Delete avatar from cloudinary
            if (user.avatar.public_id !== null) {
                try {
                    await cloudinary.uploader.destroy(user.avatar.public_id);
                } catch (error) {
                    return next(new ErrorResponse(error.message, 400));
                }
            };

            const result = await cloudinary.uploader.upload(avatar, {
                folder: "chat-app/avatars",
                width: 300,
                height: 300,
                crop: "fill",
            });
            avatarUrl = result.secure_url; // Full URL of the image
            avatarPublicId = result.public_id; // Public ID for deletion
        } catch (error) {
            return next(new ErrorResponse(error.message, 400));
        }
    } else {
        avatarUrl = user.avatar.url;
        avatarPublicId = user.avatar.public_id;
    }

    // Update user
    user.name = name;
    user.email = email;
    user.avatar = { url: avatarUrl, public_id: avatarPublicId };
    await user.save();

    // Send response
    res.status(200).json({ success: true, data: user });
});


// delete user-
export const deleteUser = asyncMiddleware(async (req, res, next) => {
    const id = req.user.id;

    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
        return next(new ErrorResponse("User not found", 404));
    };

    // Delete avatar from cloudinary
    if (user.avatar.public_id !== null) {
        try {
            await cloudinary.uploader.destroy(user.avatar.public_id);
        } catch (error) {
            return next(new ErrorResponse(error.message, 400));
        }
    }

    // Delete user
    await User.findByIdAndDelete(id);

    res.cookie("__token", null, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 0,
    });

    // Send response
    res.status(200).json({ success: true, data: {} });
});