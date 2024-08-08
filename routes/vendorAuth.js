const express = require("express");
const router = express.Router();
const vendorController = require("../controllers/vendorAuthController");

// Define your routes
router.post("/register", vendorController.register);
router.post("/login", vendorController.login);

// Export the router
module.exports = router;
