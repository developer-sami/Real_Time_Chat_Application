import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { asyncMiddleware } from "../utils/asyncMiddleware.js";
import { ErrorResponse } from "./errorHandler.js";

export const protect = asyncMiddleware(async (req, res, next) => {
    const token = req.cookies.__token;

    // Check if token is not provided
    if (!token) {
        return next(new ErrorResponse("Not authorized, token is required", 401));
    };
    
    // Check if token is valid
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");
        next();
    } catch (error) {
        return next(new ErrorResponse("Invalid token, please login again", 401));
    }

});