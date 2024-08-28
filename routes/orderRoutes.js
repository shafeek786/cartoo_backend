const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const jwtAuth = require('../middleware/auth');

// Define your routes
router.post('/create_order', jwtAuth('consumer'), orderController.createOrder);
router.post('/verify-payment', orderController.verifyRazorpayPayment);
router.get('/get_orders', jwtAuth(['consumer']), orderController.getOrders);
router.get('/get_order/:orderId', orderController.getOrderById);
router.put('/update_order/:orderId', orderController.updateOrder);
router.delete('/delete_order/:orderId', orderController.deleteOrder);

// Export the router
module.exports = router;
