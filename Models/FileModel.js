const mongoose = require("mongoose");

const textFileSchema = new mongoose.Schema({

  content: String
});

const TextFile = mongoose.model("TextFile", textFileSchema);

module.exports = TextFile;
