const express = require("express");
const AppError = require("./utils/appError");
const errorHandler = require("./services/errorHandler");
const userRouter = require("./routes/user.routes");
const songRouter = require("./routes/song.routes");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

// Middlewarea
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/users", userRouter);
app.use("/api/songs", songRouter);

// 404 middleware
app.use("*", (req, res, next) => {
  next(new AppError("This route is not handled", 404));
});

// error handler middleware
app.use(errorHandler);

module.exports = app;
