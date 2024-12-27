import mongoose from "mongoose";
import bcrypt from "bcryptjs";


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter a name"],
        unique: false,
    },
    email: {
        type: String,
        required: [true, "Please enter an email"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please enter a password"],
    },
    avatar: {
        type: String,
    },

}, {
    timestamps: true
});

// hash the password field
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    };
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
})


// compare password
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}


const User = mongoose.model("User", userSchema);

export default User;