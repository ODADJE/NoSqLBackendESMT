const mongoose = require("mongoose");

const songSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
  },
  artists: {
    type: [String],
    required: [true, "Please add an artist"],
  },
  album: {
    type: String,
    required: [true, "Please add an album"],
  },
  genre: {
    type: String,
    required: [true, "Please add a genre"],
  },
  popularity: {
    type: Number,
    required: [true, "Please add a popularity"],
  },
  duration_ms: {
    type: Number,
    required: [true, "Please add a duration"],
  },
  explicit: {
    type: Boolean,
    required: [true, "Please add an explicit"],
  },
});

const Song = mongoose.model("Song", songSchema);

module.exports = Song;
