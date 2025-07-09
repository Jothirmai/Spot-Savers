const mongoose = require("mongoose");

const parkingSchema = new mongoose.Schema({
  name: String,
  address: String,
  city: String,
  lat: String,
  long: String,
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, {
  timestamps: true  
});

module.exports = mongoose.model("Parking", parkingSchema);
