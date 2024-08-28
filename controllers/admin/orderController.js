const Order = require('../../models/orderModel');
const Product = require('../../models/productModel');
const Address = require('../../models/addressModel');
const User = require('../../models/userModel');
const s3 = require('../../config/s3');

// Create a new order

// Get all orders

exports.getOrders = async (req, res) => {
  try {
    const userId = req.user.userId;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.paginate, 10) || 10;
    const skip = (page - 1) * limit;

    // Find the orders for the given user and populate the relevant fields
    const orders = await Order.find()
      .populate({
        path: 'user',
        select: 'name',
      })
      .populate({
        path: 'shipping_address_id',
        select: 'street city state_name country pincode phone country_code',
      })
      .populate({
        path: 'billing_address_id',
        select: 'street city state_name country pincode phone country_code',
      })
      .select(
        'order_number user created_at total amount shipping_total payment_status payment_method products delivery_description order_status'
      )
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments({ user: userId });

    // Format orders and include thumbnail images
    const formattedOrders = orders.map(order => {
      const lastStatus =
        order.order_status.data[order.order_status.data.length - 1];
      const formattedProducts = order.products.map(item => {
        let productThumbnail = null;
        if (item.product_thumbnail) {
          productThumbnail = s3.getSignedUrl('getObject', {
            Bucket: 'cartoo',
            Key: item.product_thumbnail,
            Expires: 60 * 5, // URL expires in 5 minutes
          });
        }

        return {
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          sub_total: item.sub_total, // Include if needed
          product_thumbnail: { image_url: productThumbnail }, // Add product thumbnail URL
          is_return: item.is_return,
          is_refunded: item.is_refunded,
        };
      });

      return {
        count: total,
        order_number: order.order_number,
        userName: order.user.name,
        created_at: order.created_at,
        totalAmount: order.total_price,
        payment_status: order.payment_status,
        payment_method: order.payment_method,
        order_status: lastStatus,
        products: formattedProducts, // Use formatted products with thumbnails
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
    return res.status(200).json({
      success: true,
      data: formattedOrders,
      total: total,
    });
  } catch (error) {
    console.error(error);
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

// // Create a new order
// exports.createOrder = async (req, res) => {
//   try {
//     const {
//       products,
//       billing_address_id,
//       shipping_address_id,
//       payment_method,
//       delivery_description,
//     } = req.body;
//     const userId = req.user.userId;

//     const billingAddress = await Address.findById(billing_address_id);
//     const shippingAddress = await Address.findById(shipping_address_id);

//     if (!billingAddress || !shippingAddress) {
//       return res.status(404).json({
//         success: false,
//         message: 'Billing or shipping address not found',
//       });
//     }

//     let totalPrice = 0;
//     const productDetails = [];
//     let shipping = 0;

//     for (let item of products) {
//       const product = await Product.findById(item.product_id);
//       if (!product) {
//         return res.status(404).json({
//           success: false,
//           message: `Product with ID ${item.product_id} not found`,
//         });
//       }

//       const priceForItem = product.price * item.quantity;
//       totalPrice += priceForItem;
//       shipping = totalPrice > 50 ? 0 : 2.5;
//       productDetails.push({
//         product: item.product_id,
//         quantity: item.quantity,
//         sub_total: priceForItem,
//         price: product.price,
//         product_thumbnail: product.product_thumbnail_id,
//         is_return: product.isReturn,
//       });
//     }

//     let orderNumber;
//     let isUnique = false;

//     while (!isUnique) {
//       orderNumber = `ORD-${Math.floor(100000000 + Math.random() * 900000000)}`;
//       const existingOrder = await Order.findOne({ order_number: orderNumber });
//       if (!existingOrder) {
//         isUnique = true;
//       }
//     }

//     const initialOrderStatus = {
//       data: [
//         {
//           id: 1,
//           name: 'pending',
//           slug: 'pending',
//           created_by_id: userId,
//         },
//       ],
//       total: 1,
//     };

//     const payment_status =
//       payment_method === 'cod' ? 'Pending' : 'Awaiting Payment';

//     const order = new Order({
//       user: userId,
//       products: productDetails,
//       amount: totalPrice,
//       total: totalPrice + shipping,
//       shipping_total: shipping,
//       billing_address_id,
//       shipping_address_id,
//       delivery_description,
//       status: 'Pending',
//       payment_method,
//       payment_status,
//       order_number: orderNumber,
//       order_status: initialOrderStatus,
//     });

//     await order.save();
//     console.log('order:    ', order);
//     return res.status(201).json({
//       success: true,
//       message: 'Order created successfully',
//       data: order,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// Get all orders

// // Get a single order by ID
// exports.getOrderById = async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const order = await Order.findById(orderId)
//       .populate('user', 'name')
//       .populate('products.product', 'name price');

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: 'Order not found',
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       data: order,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // Update order status
// exports.updateOrderStatus = async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const { status } = req.body;

//     const validStatuses = [
//       'Pending',
//       'Processing',
//       'Shipped',
//       'Delivered',
//       'Cancelled',
//     ];
//     if (!validStatuses.includes(status)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid status',
//       });
//     }

//     const order = await Order.findById(orderId);
//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: 'Order not found',
//       });
//     }

//     order.order_status.data.push({
//       id: order.order_status.total + 1,
//       name: status,
//       slug: status.toLowerCase(),
//       created_by_id: req.user.userId,
//     });
//     order.order_status.total += 1;
//     order.status = status;

//     await order.save();

//     return res.status(200).json({
//       success: true,
//       message: 'Order status updated successfully',
//       data: order,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // Delete an order
// exports.deleteOrder = async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const order = await Order.findById(orderId);
//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: 'Order not found',
//       });
//     }

//     await Order.findByIdAndDelete(orderId);

//     return res.status(200).json({
//       success: true,
//       message: 'Order deleted successfully',
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };
