const express = require("express");
const authController = require("../controllers/auth.controllers");
const userController = require("../controllers/user.controllers");
const router = express.Router();

// Auth routes
router.route("/sign-up").post(authController.signUp);
router.route("/sign-in").post(authController.signIn);
router.route("/me").get(authController.protect, authController.me);
router
  .route("/change-password")
  .patch(authController.protect, authController.changePassword);
router
  .route("/forgot-password")
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    authController.forgotPassword
  );

// User routes
router
  .route("/")
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    userController.getAll
  )
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    userController.create
  );
router
  .route("/:id")
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    userController.getOne
  )
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    userController.update
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    userController.deleteOne
  );

module.exports = router;
