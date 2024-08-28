const { type } = require('express/lib/response');
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        name: {
          type: String,
          require: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        product_thumbnail: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        sub_total: {
          type: Number,
          required: true,
        },
        is_return: {
          type: Boolean,
          required: true,
        },
        is_refunded: {
          type: Boolean,
          default: false,
        },
      },
    ],
    amount: {
      type: Number,
      required: true,
    },
    shipping_total: {
      type: Number,
      required: true,
    },
    tax_total: {
      type: Number,
      required: true,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
    },
    shipping_address_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Address',
      required: true,
    },
    delivery_description: {
      type: String,
      required: true,
    },
    billing_address_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Address',
      required: true,
    },
    status: {
      type: String,
      enum: [
        'Pending',
        'Processing',
        'Shipped',
        'Out for Delivery',
        'Delivered',
      ],
      default: 'Pending',
    },
    payment_status: {
      type: String,
      enum: ['Pending', 'Completed', 'Awaiting Payment', 'Failed'],
      default: 'Pending',
    },
    order_status: {
      data: [
        {
          id: { type: Number, required: true },
          name: { type: String, required: true, default: 'pending' },
          slug: { type: String, required: true, default: 'pending' },
          created_by_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
          },
          created_at: { type: Date, default: Date.now },
          updated_at: { type: Date, default: Date.now },
          deleted_at: { type: Date, default: null },
        },
      ],
      total: { type: Number, required: true, default: 0 },
    },
    payment_method: {
      type: String,
      enum: [
        'Credit Card',
        'Debit Card',
        'PayPal',
        'Bank Transfer',
        'Cash on Delivery',
        'cod',
        'razorpay',
      ],
      required: true,
    },
    order_number: {
      type: String,
      unique: true,
      required: true,
    },
    deleted_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

// Add an index on order_number to ensure uniqueness
orderSchema.index({ order_number: 1 }, { unique: true });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
