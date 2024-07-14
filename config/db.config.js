const mongoose = require("mongoose");
const User = require("../models/user.model");
const Song = require("../models/song.model");

// Creates an admin user if it doesn't exist
const createAdmin = async () => {
  try {
    const admin = await User.findOne({ role: "admin" });
    if (!admin) {
      await User.create([
        {
          name: process.env.NAME,
          email: process.env.EMAIL,
          password: process.env.PASSWORD,
          role: process.env.ROLE,
        },
      ]);
      console.log("Admin created");
    }
  } catch (err) {
    console.log(err);
  }
};

const createFirstSong = async () => {
  try {
    const song = await Song.find();
    if (!song.length) {
      await Song.create({
        name: "Test_song",
        artists: ["Test_artist"],
        album: "Test_album",
        genre: "Test_genre",
        popularity: 100,
        duration_ms: 1000,
        explicit: false,
      });
      console.log("Song test created");
    }
  } catch (err) {
    console.log(err);
  }
};

/**
 * Connects to the MongoDB database using the provided URI.
 * If the connection is successful, logs a message to the console.
 * If the connection fails, logs the error and exits the process.
 *
 * @return {Promise<void>} A promise that resolves when the connection is established.
 */
module.exports = function dbConfig() {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log("MongoDB Connected");
      createAdmin();
      createFirstSong();
    })
    .catch((err) => {
      console.log(err);
      process.exit(1);
    });
};
