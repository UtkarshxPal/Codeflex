const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  auth0Id: {
    type: String,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  profilePicture: {
    type: String,
  },
  provider: {
    type: String,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
