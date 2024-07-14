const express = require("express");
const authController = require("../controllers/auth.controllers");
const songController = require("../controllers/song.controllers");
const router = express.Router();

// Song routes
router
  .route("/")
  .get(authController.protect, songController.getAll)
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    songController.create
  );

router
  .route("/:id")
  .get(authController.protect, songController.getOne)
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    songController.update
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    songController.delete
  );

module.exports = router;
