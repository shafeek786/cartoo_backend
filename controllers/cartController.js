const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const s3 = require('../config/s3');

exports.addToCart = async (req, res) => {
  try {
    const { product_id, quantity } = req.body;
    const userId = req.user.userId;
    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product with ID ${product_id} not found.`,
      });
    }

    let cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (cart) {
      const productIndex = cart.items.findIndex(
        item => item.product._id.toString() === product_id
      );

      if (productIndex > -1) {
        cart.items[productIndex].quantity += quantity;
      } else {
        cart.items.push({ product: product_id, quantity });
      }
    } else {
      cart = new Cart({
        user: userId,
        items: [{ product: product_id, quantity }],
      });
    }

    await cart.save();

    const updatedCart = await Cart.findOne({ user: userId }).populate(
      'items.product'
    );
    // Calculate the total value of the cart
    const total = updatedCart.items.reduce((acc, item) => {
      const itemTotal =
        (item.product.sale_price || item.product.price) * item.quantity;
      return acc + itemTotal;
    }, 0);

    // Transform the cart items to match the Cart interface
    const cartItems = updatedCart.items.map(item => {
      const itemTotal =
        (item.product.price || item.product.price) * item.quantity; // Calculate itemTotal here

      let thumbnail = null;
      if (item.product.product_thumbnail_id) {
        thumbnail = s3.getSignedUrl('getObject', {
          Bucket: 'cartoo',
          Key: item.product.product_thumbnail_id,
          Expires: 60 * 5, // URL expires in 5 minutes
        });
      }
      return {
        id: item._id, // Assuming the item has an _id field
        product_id: item.product._id, // Assuming the product has an _id field
        variation: item.variation, // Assuming variation is already populated
        variation_id: item.variation ? item.variation._id : null,
        quantity: item.quantity,
        sub_total: itemTotal, // Use the itemTotal for sub_total
        product: {
          ...item.product._doc,
          thumbnail_image: { image_url: thumbnail },
        },
        created_at: item.createdAt, // Assuming createdAt is available in item
        updated_at: item.updatedAt, // Assuming updatedAt is available in item
      };
    });

    // Structure the response to match CartModel interface
    return res.status(200).json({
      success: true,
      items: cartItems,
      total,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//get cart item

exports.getCart = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Find the cart for the given user and populate the product details
    const cart = await Cart.findOne({ user: userId }).populate('items.product');

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    // Calculate the total value of the cart and include thumbnail images
    const cartItems = cart.items.map(item => {
      const itemTotal =
        (item.product.sale_price || item.product.price) * item.quantity;

      let thumbnail = null;
      if (item.product.product_thumbnail_id) {
        thumbnail = s3.getSignedUrl('getObject', {
          Bucket: 'cartoo',
          Key: item.product.product_thumbnail_id,
          Expires: 60 * 5, // URL expires in 5 minutes
        });
      }

      return {
        id: item._id, // Assuming the item has an _id field
        product_id: item.product._id, // Assuming the product has an _id field
        variation: item.variation, // Assuming variation is already populated
        variation_id: item.variation ? item.variation._id : null,
        quantity: item.quantity,
        sub_total: itemTotal, // Use the itemTotal for sub_total
        product: {
          ...item.product._doc,
          thumbnail_image: { image_url: thumbnail },
        }, // Include thumbnail image in product
        created_at: item.createdAt, // Assuming createdAt is available in item
        updated_at: item.updatedAt, // Assuming updatedAt is available in item
      };
    });

    // Calculate the total value of the cart
    const total = cartItems.reduce((acc, item) => acc + item.sub_total, 0);

    // Structure the response to match CartModel interface
    return res.status(200).json({
      success: true,
      items: cartItems,
      total,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//update item quantity

exports.updateCartItem = async (req, res) => {
  try {
    const { product_id, quantity } = req.body;
    const userId = req.user.userId;
    // Find the cart for the given user
    const cart = await Cart.findOne({ user: userId }).populate('items.product');

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    // Find the product in the cart
    const productIndex = cart.items.findIndex(item => {
      return item.product._id.toString() === product_id;
    });

    if (productIndex > -1) {
      cart.items[productIndex].quantity += quantity;
      await cart.save();

      // Calculate the total value of the cart
      const total = cart.items.reduce((acc, item) => {
        const itemTotal =
          (item.product.sale_price || item.product.price) * item.quantity;
        return acc + itemTotal;
      }, 0);

      // Transform the cart items to match the Cart interface
      const cartItems = cart.items.map(item => {
        const itemTotal =
          (item.product.sale_price || item.product.price) * item.quantity;

        return {
          id: item._id.toString(), // Ensure this is a string
          product_id: item.product._id.toString(), // Ensure this is a string
          variation: item.variation, // Assuming variation is already populated
          variation_id: item.variation ? item.variation._id.toString() : null, // Ensure this is a string
          quantity: item.quantity,
          sub_total: itemTotal, // Use the itemTotal for sub_total
          product: item.product, // The product details populated by Mongoose
          created_at: item.createdAt, // Assuming createdAt is available in item
          updated_at: item.updatedAt, // Assuming updatedAt is available in item
        };
      });

      // Structure the response to match CartModel interface
      return res.status(200).json({
        success: true,
        message: 'Cart item updated successfully',
        items: cartItems,
        total, // Pass the total value of the cart
      });
    } else {
      return res.status(404).json({
        success: false,
        message: 'Product not found in cart',
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//remove item from cart

exports.removeItem = async (req, res) => {
  try {
    const productId = req.query.id;
    const userId = req.user.userId;

    // Find the cart and populate the 'product' field
    const cart = await Cart.findOne({ user: userId }).populate('items.product');

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    // Log the cart items for debugging

    // Filter out the item to be removed
    cart.items = cart.items.filter(item => {
      const isMatch = item.product && item._id.toString() === productId;

      return !isMatch;
    });

    await cart.save();

    // Calculate the total value of the cart
    const total = cart.items.reduce((acc, item) => {
      const itemTotal =
        (item.product.sale_price || item.product.price) * item.quantity;
      return acc + itemTotal;
    }, 0);

    // Transform the cart items to match the Cart interface
    const cartItems = cart.items.map(item => {
      const itemTotal =
        (item.product.sale_price || item.product.price) * item.quantity;

      return {
        id: item._id.toString(), // Ensure this is a string
        product_id: item.product._id.toString(), // Ensure this is a string
        variation: item.variation, // Assuming variation is already populated
        variation_id: item.variation ? item.variation._id.toString() : null, // Ensure this is a string
        quantity: item.quantity,
        sub_total: itemTotal, // Use the itemTotal for sub_total
        product: item.product, // The product details populated by Mongoose
        created_at: item.createdAt, // Assuming createdAt is available in item
        updated_at: item.updatedAt, // Assuming updatedAt is available in item
      };
    });

    // Structure the response to match CartModel interface
    return res.status(200).json({
      success: true,
      message: 'Cart item removed successfully',
      items: cartItems,
      total, // Pass the total value of the cart
    });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//clear cart

exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    cart.items = [];
    await cart.save();

    return res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
