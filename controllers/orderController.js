const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const Address = require('../models/addressModel');
const User = require('../models/userModel');

exports.createOrder = async (req, res) => {
  try {
    const { userId, products, addressId, paymentMethod } = req.body;

    // Fetch the address from the address collection
    const address = await Address.findById(addressId);
    if (!address) {
      return res.status(404).json({
        success: false,
        message: `Address with ID ${addressId} not found`,
      });
    }

    let totalPrice = 0;
    const productDetails = [];

    // Loop through each product and calculate the total price
    for (let item of products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product with ID ${item.productId} not found`,
        });
      }

      const priceForItem = product.price * item.quantity;
      totalPrice += priceForItem;

      productDetails.push({
        product: item.productId,
        quantity: item.quantity,
      });
    }

    // Generate a random order number
    const orderNumber = `ORD-${Math.floor(
      100000000 + Math.random() * 900000000
    )}`; // Example: "ORD-123456789"

    // Set payment status based on payment method (you can customize this logic)
    let paymentStatus = paymentMethod === 'COD' ? 'Pending' : 'Completed';

    // Create a new order
    const order = new Order({
      user: userId,
      products: productDetails,
      totalPrice,
      shippingAddress: address, // Use the fetched address
      status: 'Pending', // Default status
      paymentMethod, // Use the provided payment method
      paymentStatus, // Set the payment status
      orderNumber, // Set the generated order number
    });

    // Save the order to the database
    await order.save();

    return res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Get all orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name')
      .select('orderNumber user createdAt totalPrice paymentStatus');

    const formattedOrders = orders.map(order => ({
      orderNumber: order.orderNumber,
      userName: order.user.name,
      orderDate: order.createdAt,
      totalAmount: order.totalPrice,
      paymentStatus: order.paymentStatus,
    }));

    return res.status(200).json({
      success: true,
      orders: formattedOrders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Get a single order by ID

exports.getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId)
      .populate('user', 'name')
      .populate('products.product', 'name rice');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//update an order by ID

exports.updateOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, paymentStatus } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }
    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    await order.save();

    return res.status(200).json({
      success: true,
      message: 'Order has been updated successfully',
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Remove order by ID

// Delete an order by ID
exports.deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    await order.remove();

    return res.status(200).json({
      success: true,
      message: 'Order deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
