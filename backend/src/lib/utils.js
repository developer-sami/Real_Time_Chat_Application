import jwt from "jsonwebtoken";

export const generateToken = (userId,res) =>{
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
    res.cookie("__token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 24 * 7 * 60 * 60 * 1000,
    });
}