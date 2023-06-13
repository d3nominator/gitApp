const mongoose = require("mongoose");

const textFileSchema = new mongoose.Schema({
  content: String,
  UploadedFileName: String,
  FileTags: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const TextFile = mongoose.model("TextFile", textFileSchema);

module.exports = TextFile;
