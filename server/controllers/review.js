const { Router } = require("express");
const Review = require("../models/reviewSchema");
const Joi = require("joi");
const { Types } = require("mongoose");

const reviewRouter = Router();

// Create review (public)
reviewRouter.post("/", async (req, res) => {
    try {
        const { message, rating, parking_id, user_id } = req.body;

        const schema = Joi.object({
            message: Joi.string().optional(),
            rating: Joi.number().min(1).max(5).required(),
            parking_id: Joi.string().required(),
            user_id: Joi.string().required()
        });

        const { error } = schema.validate({rating, parking_id, user_id });
        if (error) return res.status(400).json({ error: error.details[0].message });

        const reviewExists = await Review.findOne({ parking_id, user_id });
        if (reviewExists) {
            return res.status(400).json({ error: "You have already reviewed this parking." });
        }

        const review = await Review.create({ message, rating, parking_id, user_id });
        res.json({ message: "Review created", review });
    } catch (err) {
        console.error("Create review error:", err);
        res.status(500).json({ error: "Server error" });
    }
});

// Get reviews (public)
reviewRouter.get("/", async (req, res) => {
    try {
        const { parking_id } = req.query;
        const query = parking_id ? { parking_id } : {};
        const reviews = await Review.find(query).populate("user_id");
        res.json(reviews);
    } catch (err) {
        console.error("Get reviews error:", err);
        res.status(500).json({ error: "Server error" });
    }
});

// Update review (public)
reviewRouter.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        if (!Types.ObjectId.isValid(id)) return res.status(400).json({ error: "Invalid review ID" });

        const review = await Review.findById(id);
        if (!review) return res.status(404).json({ error: "Review not found" });

        // No ownership check
        const schema = Joi.object({
            message: Joi.string().optional(),
            rating: Joi.number().min(1).max(5).optional(),
        });

        const { error } = schema.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        await review.updateOne(req.body);
        res.json({ message: "Review updated successfully" });
    } catch (err) {
        console.error("Update review error:", err);
        res.status(500).json({ error: "Server error" });
    }
});

// Delete review (public)
reviewRouter.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        if (!Types.ObjectId.isValid(id)) return res.status(400).json({ error: "Invalid review ID" });

        const review = await Review.findById(id);
        if (!review) return res.status(404).json({ error: "Review not found" });

        // No ownership check
        await Review.findByIdAndDelete(id);
        res.json({ message: "Review deleted successfully" });
    } catch (err) {
        console.error("Delete review error:", err);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = reviewRouter;
