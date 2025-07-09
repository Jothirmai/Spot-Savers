const { Router } = require("express");
const PaymentMethod = require("../models/paymentMethodSchema");
const Joi = require("joi");
const { Types } = require("mongoose");

const paymentMethodRouter = Router();

// Joi schema for validation
const paymentSchema = Joi.object({
  cash: Joi.boolean().required(),
  upi_id: Joi.string().pattern(/^[\w.-]+@[\w]+$/).allow("", null).messages({
    "string.pattern.base": `"upi_id" must be a valid UPI ID like name@bank`,
  }),
  user_id: Joi.string().required()
});

// Create new payment method (no auth)
paymentMethodRouter.post("/", async (req, res) => {
  try {
    const { cash, upi_id, user_id } = req.body;

    const { error } = paymentSchema.validate({ cash, upi_id, user_id });
    if (error) return res.status(400).json({ error: error.details[0].message });

    const paymentMethod = await PaymentMethod.create({ cash, upi_id, user_id });
    res.json({ message: "Payment method created", paymentMethod });
  } catch (err) {
    console.error("Create Payment Method Error:", err);
    res.status(500).json({ error: "Server error while creating payment method." });
  }
});

// Get all payment methods (no auth)
paymentMethodRouter.get("/", async (req, res) => {
  try {
    const paymentMethods = await PaymentMethod.find({});
    res.json(paymentMethods);
  } catch (err) {
    console.error("Fetch Payment Methods Error:", err);
    res.status(500).json({ error: "Server error while fetching payment methods." });
  }
});

// Update payment method (no auth)
paymentMethodRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { cash, upi_id } = req.body;

    if (!Types.ObjectId.isValid(id)) return res.status(400).json({ error: "Invalid ID" });

    const method = await PaymentMethod.findById(id);
    if (!method) return res.status(404).json({ error: "Payment method not found" });

    const { error } = paymentSchema.validate({ cash, upi_id, user_id: method.user_id.toString() });
    if (error) return res.status(400).json({ error: error.details[0].message });

    method.cash = cash;
    method.upi_id = upi_id;
    await method.save();

    res.json({ message: "Payment method updated", paymentMethod: method });
  } catch (err) {
    console.error("Update Payment Method Error:", err);
    res.status(500).json({ error: "Server error while updating payment method." });
  }
});

// Delete payment method (no auth)
paymentMethodRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) return res.status(400).json({ error: "Invalid ID" });

    const method = await PaymentMethod.findById(id);
    if (!method) return res.status(404).json({ error: "Payment method not found" });

    await method.deleteOne();
    res.json({ message: "Payment method deleted" });
  } catch (err) {
    console.error("Delete Payment Method Error:", err);
    res.status(500).json({ error: "Server error while deleting payment method." });
  }
});

// Simulate a payment (no auth)
const Booking = require("../models/bookingSchema");
const Space = require("../models/spaceSchema");

paymentMethodRouter.post("/simulate", async (req, res) => {
  try {
    const { method_id, booking_id } = req.body;

    if (!Types.ObjectId.isValid(method_id) || !Types.ObjectId.isValid(booking_id)) {
      return res.status(400).json({ error: "Invalid method or booking ID" });
    }

    const method = await PaymentMethod.findById(method_id);
    if (!method) return res.status(404).json({ error: "Payment method not found" });

    const booking = await Booking.findById(booking_id).populate("space_id");
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    const space = booking.space_id;
    if (!space) return res.status(404).json({ error: "Associated space not found" });

    // Calculate duration (in minutes)
    const [sh, sm] = booking.booking_start_time.split(":").map(Number);
    const [eh, em] = booking.booking_end_time.split(":").map(Number);
    const durationMins = (eh * 60 + em) - (sh * 60 + sm);

    const [slotStartH, slotStartM] = space.slot_start_time.split(":").map(Number);
    const [slotEndH, slotEndM] = space.slot_end_time.split(":").map(Number);
    const totalSlotDurationMins = (slotEndH * 60 + slotEndM) - (slotStartH * 60 + slotStartM);

    const intervalCount = Math.ceil(durationMins / totalSlotDurationMins);
    const amount = space.price * intervalCount;

    let statusMessage = "";
    if (method.cash) {
      statusMessage = `Please pay ₹${amount} in cash at the parking counter.`;
    } else if (method.upi_id) {
      statusMessage = `Please scan UPI or send ₹${amount} to ${method.upi_id}`;
    } else {
      statusMessage = "No valid payment method available.";
    }

    res.json({
      message: "Payment simulation success",
      amount,
      instruction: statusMessage,
      simulated: true,
    });
  } catch (err) {
    console.error("Simulate Payment Error:", err);
    res.status(500).json({ error: "Server error during payment simulation." });
  }
});

module.exports = paymentMethodRouter;
