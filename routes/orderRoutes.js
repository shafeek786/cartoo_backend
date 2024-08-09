const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

// Define your routes
router.post("/create_order", orderController.createOrder);
router.get("/get_orders", orderController.getOrders);

// Export the router
module.exports = router;
