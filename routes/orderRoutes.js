const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Define your routes
router.post('/create_order', orderController.createOrder);
router.get('/get_orders', orderController.getOrders);
router.get('/get_order/:orderId', orderController.getOrderById);
router.put('/update_order/:orderId', orderController.updateOrder);
router.delete('/delete_order/:orderId', orderController.deleteOrder);

// Export the router
module.exports = router;
