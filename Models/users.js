const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  strname: {
    type: String,
  },
  username: {
    type: String,
  },
  password: {
    type: String,
  },
  email: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

exports.User = mongoose.model("User", userSchema);
