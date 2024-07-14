const catchAsync = require("../utils/catchAsync");
const Song = require("../models/song.model");
const AppError = require("../utils/appError");

const sendSong = (song, statusCode, res) => {
  return res.status(statusCode).json({
    status: "success",
    results: song.length,
    data: {
      song: song,
    },
  });
};

exports.getAll = catchAsync(async (req, res, next) => {
  const songs = await Song.find();
  return sendSong(songs, 200, res);
});

exports.getOne = catchAsync(async (req, res, next) => {
  const song = await Song.findById(req.params.id);
  return sendSong(song, 200, res);
});

exports.create = catchAsync(async (req, res, next) => {
  const song = await Song.create(req.body);
  return sendSong(song, 201, res);
});

exports.update = catchAsync(async (req, res, next) => {
  const song = await Song.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  return sendSong(song, 200, res);
});

exports.delete = catchAsync(async (req, res, next) => {
  const song = await Song.findByIdAndDelete(req.params.id);
  return sendSong(song, 204, res);
});
