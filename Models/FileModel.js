const mongoose = require("mongoose");

const textFileSchema = new mongoose.Schema({
  content: String,
  UploadedFileName: String,
  FileTags: [String],
});

const TextFile = mongoose.model("TextFile", textFileSchema);

module.exports = TextFile;
