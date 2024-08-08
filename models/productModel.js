const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  shortDescription: {
    type: String,
    required: true,
  },
  store: {
    type: String,
    required: true,
  },
  inventory: {
    stockStatus: {
      type: String,
      default: "Out of Stock",
    },
    sku: {
      type: String,
    },
    stockQuantity: {
      type: Number,
    },
    price: {
      type: Number,
    },
    discount: {
      type: Number,
    },
    salePrice: {
      type: Number,
    },
    saleStatus: {
      type: Boolean,
      default: false,
    },
  },
  images: {
    thumbnail: {
      type: String,
    },
    productImage: {
      type: String,
    },
    sizeChart: {
      type: String,
    },
  },
  seo: {
    metaTitle: {
      type: String,
    },
    metaDescription: {
      type: String,
    },
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
