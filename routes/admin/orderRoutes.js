const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/admin/orderController');
const jwtAuth = require('../../middleware/auth');

// Define your routes
router.get('/get_orders', jwtAuth(['admin']), orderController.getOrders);
router.get('/get_order/:orderId', orderController.getOrderById);
router.put('/update_order/:orderId', orderController.updateOrder);
// router.delete('/delete_order/:orderId', orderController.deleteOrder);

// Export the router
module.exports = router;
