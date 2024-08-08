const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

// Admin routes for managing users and vendors
router.put("/user/:id/approve", adminController.updateUserApproval);
router.put("/vendor/:id/approve", adminController.updateVendorApproval);
router.post("/user", adminController.createUser);
router.post("/vendor", adminController.createVendor);
router.delete("/user/:id", adminController.deleteUser);
router.delete("/vendor/:id", adminController.deleteVendor);

// New routes for editing and getting user details
router.put("/user/:id", adminController.editUser);
router.get("/user/:id", adminController.getUser);

// New routes for getting all users and vendors
router.get("/users", adminController.getAllUsers);
router.get("/vendors", adminController.getAllVendors);

module.exports = router;
