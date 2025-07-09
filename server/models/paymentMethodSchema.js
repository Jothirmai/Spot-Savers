const mongoose = require('mongoose');

const paymentMethodSchema = new mongoose.Schema({
  cash: {
    type: Boolean,
    required: true,
  },
  upi_id: {
    type: String,
    validate: {
      validator: function (v) {
        return !v || /^[\w.-]+@[\w]+$/.test(v); // Validates UPI if present
      },
      message: 'Invalid UPI ID format. Expected format: name@bank',
    },
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt
});

module.exports = mongoose.model("PaymentMethod", paymentMethodSchema);
