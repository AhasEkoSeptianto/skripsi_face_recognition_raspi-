const mongoose = require("mongoose");

const UnknowFace = new mongoose.Schema({
  file_name: {
    type: String,
  },
  created_at: {
    type: String,
  },
});

const UnknowFaces = mongoose.model("UnknowFace", UnknowFace);
module.exports = UnknowFaces;
