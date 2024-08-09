const Cart = require('../models/cartModel');
const Product = require('../models/cartModel');

exports.addToCart = async (req, rs) => {
  try {
    const { userId, productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product with ID ${productId} not found.`,
      });
    }
    let cart = await Cart.findOne({ user: userId });
    if (cart) {
      const productIndex = cart.items.findIndex(
        item => item.product.toString() === productId
      );

      if (productIndex > -1) {
        cart.items[productIndex].quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }
    } else {
      cart = new Cart({
        user: userId,
        items: [{ product: productId, quantity }],
      });
    }

    await cart.save();
    return res.status(200).json({
      success: true,
      message: 'Product added to cart successfully',
      cart,
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
    const { userId } = req.body;
    const cart = await Cart.findOne({ user: userId }).populate('items.product');

    if (!cart) {
      return rs.status(404).json({
        success: false,
        message: 'cart not found',
      });
    }

    return res.status(200).json({
      success: true,
      cart,
    });
  } catch (arror) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//update item quantity

exports.updateCartItem = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    const productIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );
    if (productIndex > -1) {
      cart.items[productIndex].quantity = quantity;

      await cart.save();
      return res.status(200).json({
        success: true,
        message: 'quantity added successfully',
        cart,
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
    const { userId, productId } = req.body;
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    cart.items = cart.items.filter(
      item => item.product.toString() !== productId
    );
    await cart.save();
    return res.status(200).json({
      success: true,
      message: 'Cart item removed successfully',
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//clear cart

exports.clearCart = async (req, res) => {
  try {
    const { userId } = req.body;
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
