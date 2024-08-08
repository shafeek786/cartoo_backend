const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Define your routes
router.post("/register", authController.register);
router.post("/login", authController.login);

router.post("/refresh_token", authController.refreshToken);

// Export the router
module.exports = router;
