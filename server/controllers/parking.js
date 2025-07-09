const { Router } = require("express");
const Parking = require("../models/parkingSchema");
const Review = require("../models/reviewSchema");
const Joi = require("joi");
const { Types } = require("mongoose");

const parkingRouter = Router();

const parkingSchema = Joi.object({
  name: Joi.string().required(),
  address: Joi.string().required(),
  city: Joi.string().required(),
  lat: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
  long: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
});


function haversineDistance(lat1, lon1, lat2, lon2) {
  const toRad = deg => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// POST /parking — Create parking (public)
parkingRouter.post("/", async (req, res) => {
  try {
    const { name, address, city, lat, long, user_id } = req.body; // user_id must be passed manually in body

    const { error } = parkingSchema.validate({ name, address, city, lat, long });
    if (error) return res.status(400).json({ error: error.details[0].message });
    const existing = await Parking.findOne({ 
  name, 
  address, 
  city, 
  lat, 
  long, 
  user_id 
});

if (existing) {
  return res.status(400).json({ error: "A parking with the same details already exists." });
}

    const parking = await Parking.create({ name, address, city, lat, long, user_id });
    res.json({ message: "Parking created", parking });
  } catch (error) {
    console.error("Create Parking Error:", error);
    res.status(500).json({ error: "Server error while creating parking" });
  }
});

// GET /parking — List parkings (public)
parkingRouter.get("/", async (req, res) => {
  try {
    const { user_id, city, lat, long, radius, sortByRating } = req.query;
    let query = {};

    if (user_id) query.user_id = user_id;
    if (city) query.city = city;

    let parkings = await Parking.find(query).populate("user_id");
    const reviews = await Review.find();

    const enriched = parkings.map((parking) => {
      const ownerReviews = reviews.filter(r => r.parking_id && parking._id && r.parking_id.equals(parking._id));
      const ratingSum = ownerReviews.reduce((sum, r) => sum + r.rating, 0);
      const owner_rating = ownerReviews.length ? ratingSum / ownerReviews.length : 0;

      return {
        ...parking.toObject(),
        owner_rating,
        lat: parseFloat(parking.lat),
        long: parseFloat(parking.long)
      };
    });

    let filtered = enriched;
    if (lat && long && radius) {
      const userLat = parseFloat(lat);
      const userLong = parseFloat(long);
      const maxDist = parseFloat(radius);

      filtered = enriched.filter(p => {
        const dist = haversineDistance(userLat, userLong, p.lat, p.long);
        return dist <= maxDist;
      });
    }

    if (sortByRating === 'true') {
      filtered.sort((a, b) => b.owner_rating - a.owner_rating);
    }

    res.json(filtered);
  } catch (error) {
    console.error("Get Parking Error:", error);
    res.status(500).json({ error: "Server error while fetching parkings" });
  }
});

// PUT /parking/:id — Update parking (public)
parkingRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id))
      return res.status(400).json({ error: "Invalid parking ID" });

    const parking = await Parking.findById(id);
    if (!parking)
      return res.status(404).json({ error: "Parking not found" });

    const updatedFields = { ...req.body };
    const { error } = parkingSchema.validate(updatedFields);
    if (error) return res.status(400).json({ error: error.details[0].message });

    await Parking.updateOne({ _id: id }, updatedFields);
    res.json({ message: "Parking updated successfully" });
  } catch (error) {
    console.error("Update Parking Error:", error);
    res.status(500).json({ error: "Server error while updating parking" });
  }
});

// DELETE /parking/:id — Delete parking (public)
parkingRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id))
      return res.status(400).json({ error: "Invalid parking ID" });

    const parking = await Parking.findById(id);
    if (!parking)
      return res.status(404).json({ error: "Parking not found" });

    await Parking.deleteOne({ _id: id });
    res.json({ message: "Parking deleted successfully" });
  } catch (error) {
    console.error("Delete Parking Error:", error);
    res.status(500).json({ error: "Server error while deleting parking" });
  }
});

module.exports = parkingRouter;
