require("dotenv").config();
const { Router } = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");
const Joi = require("joi");
const { Types } = require("mongoose");

const userRouter = Router();
const SECRET_JWT_CODE = process.env.JWT_SECRET;

// Register
userRouter.post("/register", async (req, res) => {
    try {
        const { name, email, password, type } = req.body;

        const schema = Joi.object({
            name: Joi.string().required().messages({
                "string.empty": "Name is required",
            }),
            email: Joi.string().email().min(8).max(50).required().messages({
                "string.email": "Email must be valid",
                "string.empty": "Email is required",
            }),
            password: Joi.string()
                .min(8)
                .max(20)
                .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/)
                .required()
                .messages({
                    "string.pattern.base": "Password must include uppercase, lowercase, digit, and special character",
                    "string.empty": "Password is required",
                    "string.min": "Password must be at least 8 characters",
                }),
            type: Joi.string().valid("admin", "seeker", "owner").required().messages({
                "any.only": "Type must be admin, seeker, or owner",
                "string.empty": "Type is required",
            }),
        });

        const { error } = schema.validate({ name, email, password, type });
        if (error) return res.status(400).json({ error: error.details[0].message });

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: "Email already in use" });

        const hashedPassword = bcrypt.hashSync(password, 10);
        const newUser = await User.create({ name, email, password: hashedPassword, type });

        return res.status(201).json(newUser);
    } catch (err) {
        console.error("Register error:", err.message);
        return res.status(500).json({ error: "Internal server error" });
    }
});

// Get all users
userRouter.get("/", async (req, res) => {
    try {
        const users = await User.find({});
        return res.json(users);
    } catch (err) {
        console.error("Get users error:", err.message);
        return res.status(500).json({ error: "Failed to fetch users" });
    }
});

// Login
userRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const schema = Joi.object({
            email: Joi.string().email().min(8).max(50).required().messages({
                "string.email": "Email must be valid",
                "string.empty": "Email is required",
            }),
            password: Joi.string().min(6).max(20).required().messages({
                "string.empty": "Password is required",
                "string.min": "Password must be at least 6 characters",
            }),
        });

        const { error } = schema.validate({ email, password });
        if (error) return res.status(400).json({ error: error.details[0].message });

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: "Email not registered" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Incorrect password" });

        const token = jwt.sign({ email: user.email }, SECRET_JWT_CODE);
        return res.json({ user, token });
    } catch (err) {
        console.error("Login error:", err.message);
        return res.status(500).json({ error: "Login failed due to server error" });
    }
});

// Reset Password
userRouter.post("/resetPassword/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { password } = req.body;

        if (!Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid user ID format" });
        }

        const schema = Joi.object({
            password: Joi.string()
                .min(8)
                .max(20)
                .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/)
                .required()
                .messages({
                    "string.pattern.base": "Password must include uppercase, lowercase, digit, and special character",
                }),
        });

        const { error } = schema.validate({ password });
        if (error) return res.status(400).json({ error: error.details[0].message });

        const user = await User.findById(id);
        if (!user) return res.status(404).json({ error: "User not found" });

        user.password = bcrypt.hashSync(password, 10);
        await user.save();

        return res.json({ user, message: "Password updated successfully" });
    } catch (err) {
        console.error("Reset password error:", err.message);
        return res.status(500).json({ error: "Failed to reset password" });
    }
});

// Update user (payment methods: cash / upiId)
userRouter.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { cash, upiId } = req.body;

        if (!Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid user ID format" });
        }

        const user = await User.findById(id);
        if (!user) return res.status(404).json({ error: "User not found" });

        if (typeof cash !== "boolean" && !upiId) {
            return res.status(400).json({ error: "Provide either cash option or UPI ID" });
        }

        if (typeof cash === "boolean") user.cash = cash;
        if (upiId) user.upiId = upiId;

        await user.save();

        return res.json({ user, message: "User payment options updated successfully" });
    } catch (err) {
        console.error("Update user error:", err.message);
        return res.status(500).json({ error: "Failed to update user" });
    }
});

// Delete user
userRouter.delete("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid user ID format" });
        }

        const user = await User.findByIdAndDelete(id);
        if (!user) return res.status(404).json({ error: "User not found" });

        return res.json({ message: "User deleted successfully" });
    } catch (err) {
        console.error("Delete user error:", err.message);
        return res.status(500).json({ error: "Failed to delete user" });
    }
});

module.exports = userRouter;
