const mongoose = require("mongoose");
async function connectToMongoDb(url) {
  await mongoose
    .connect(url)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.error("MongoDB connection error:", err);
    });
}

module.exports = connectToMongoDb;
