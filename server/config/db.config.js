const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = () => {
    const url = process.env.MONGO_URI;

    if (!url) {
        console.error("MONGO_URI not defined in .env");
        process.exit(1);
    }

    mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    mongoose.connection.once("open", () => {
        console.log("Connected to database");
    });

    mongoose.connection.on("error", (err) => {
        console.error("Error connecting to database:", err);
    });
};

module.exports = {
    connectDB,
};
