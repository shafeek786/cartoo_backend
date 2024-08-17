const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const Address = require('../models/addressModel');
const User = require('../models/userModel');

// Create a new order
exports.createOrder = async (req, res) => {
  console.log('body: ', req.body);
  try {
    const {
      products,
      billing_address_id,
      shipping_address_id,
      payment_method,
      delivery_description,
    } = req.body;
    const userId = req.user.userId;

    // Fetch the billing and shipping addresses from the address collection
    const billingAddress = await Address.findById(billing_address_id);
    const shippingAddress = await Address.findById(shipping_address_id);

    if (!billingAddress) {
      return res.status(404).json({
        success: false,
        message: `Billing address with ID ${billing_address_id} not found`,
      });
    }

    if (!shippingAddress) {
      return res.status(404).json({
        success: false,
        message: `Shipping address with ID ${shipping_address_id} not found`,
      });
    }

    let totalPrice = 0;
    const productDetails = [];
    let shipping = 0;

    // Loop through each product and calculate the total price
    for (let item of products) {
      const product = await Product.findById(item.product_id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product with ID ${item.product_id} not found`,
        });
      }

      const priceForItem = product.price * item.quantity;
      totalPrice += priceForItem;
      shipping = totalPrice > 50 ? 0 : 2.5;
      console.log('thumbnail: ', product.product_thumbnail_id);
      productDetails.push({
        product: item.product_id,
        quantity: item.quantity,
        sub_total: priceForItem,
        price: product.price,
        product_thumbnail: product.product_thumbnail_id,
        is_return: product.isReturn,
      });
    }

    // Generate a unique order number, ensuring it doesn't conflict
    let orderNumber;
    let isUnique = false;

    while (!isUnique) {
      orderNumber = `ORD-${Math.floor(100000000 + Math.random() * 900000000)}`;
      console.log(orderNumber);
      const existingOrder = await Order.findOne({ order_number: orderNumber });
      console.log(existingOrder);
      if (!existingOrder) {
        isUnique = true;
      }
    }
    const initialOrderStatus = {
      data: [
        {
          id: 1,
          name: 'pending',
          slug: 'pending',
          created_by_id: userId,
        },
      ],
      total: 1,
    };
    // Set payment status based on payment method
    const paymentStatus = payment_method === 'cod' ? 'Pending' : 'Completed';

    // Create a new order
    const order = new Order({
      user: userId,
      products: productDetails,
      amount: totalPrice,
      total: totalPrice + shipping,
      shipping_total: shipping,
      billing_address_id: billing_address_id,
      shipping_address_id: shipping_address_id,
      delivery_description: delivery_description,
      status: 'Pending', // Default status
      payment_method: payment_method,
      payment_status: paymentStatus,
      order_number: orderNumber,
      order_status: initialOrderStatus,
    });
    console.log('Generated order number:', orderNumber);
    console.log('Order before saving:', order);
    // Save the order to the database
    await order.save();

    return res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate({
        path: 'user',
        select: 'name',
      })
      .populate({
        path: 'products.product',
        select: 'name price product_thumbnail', // Adjust as needed
      })
      .populate({
        path: 'shipping_address_id',
        select: 'street city state_name country pincode phone country_code', // Adjust as needed
      })
      .populate({
        path: 'billing_address_id',
        select: 'street city state_name country pincode phone country_code', // Adjust as needed
      })
      .select(
        'order_number user created_at total amount shipping_total payment_status payment_method products delivery_description order_status'
      );

    const formattedOrders = orders.map(order => {
      const lastStatus =
        order.order_status.data[order.order_status.data.length - 1];
      return {
        order_number: order.order_number,
        userName: order.user.name,
        orderDate: order.created_at,
        totalAmount: order.total_price,
        payment_status: order.payment_status,
        payment_method: order.payment_method,
        order_status: lastStatus,
        products: order.products.map(item => ({
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          sub_total: item.sub_total, // Include if needed
          product_thumbnail: item.product_thumbnail, // Add product thumbnail URL
          is_return: item.is_return,
          is_refunded: item.is_refunded,
        })),
        billing_address: order.billing_address_id,
        shipping_address: order.shipping_address_id,
        invoice_url: order.invoice_url, // Add if applicable
        delivery_description: order.delivery_description, // Add if applicable
        points_amount: order.points_amount, // Add if applicable
        wallet_balance: order.wallet_balance, // Add if applicable
        coupon_total_discount: order.coupon_total_discount, // Add if applicable
        amount: order.amount, // Add if applicable
        shipping_total: order.shipping_total, // Add if applicable
        tax_total: order.tax_total, // Add if applicable
        total: order.total, // Add if applicable
      };
    });
    console.log('complete orders: ', orders);

    console.log('orders: ', formattedOrders);
    return res.status(200).json({
      success: true,
      data: formattedOrders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get a single order by ID
exports.getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId)
      .populate('user', 'name')
      .populate('products.product', 'name price');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update an order by ID
exports.updateOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, payment_status } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    if (status) order.status = status;
    if (payment_status) order.payment_status = payment_status;

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

    // Soft delete by setting the deleted_at field
    order.deleted_at = new Date();
    await order.save();

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
