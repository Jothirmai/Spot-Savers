const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    message: {
        type: String,
        required: false
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        required: true,
    },
    parking_id: {
        type: mongoose.Schema.Types.ObjectId,
            ref: 'Parking',
            required: true,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model("Review", reviewSchema)