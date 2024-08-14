const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  short_description: {
    type: String,
    required: true,
  },
  store_id: {
    type: String, // Adjust type as needed

    required: true,
  },
  type: {
    type: String,
    default: 'simple',
  },
  unit: {
    type: String,
  },
  weight: {
    type: Number,
  },
  stock_status: {
    type: String,
    default: 'in_stock',
  },
  sku: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
  },
  isSaleEnable: {
    type: Boolean,
    default: false,
  },
  saleStartsAt: {
    type: Date,
  },
  saleExpiredAt: {
    type: Date,
  },
  tags: {
    type: [String],
  },
  categories: {
    type: [String],
    required: true,
  },
  isRandomRelatedProducts: {
    type: Boolean,
    default: false,
  },
  relatedProducts: {
    type: [mongoose.Schema.Types.ObjectId], // Adjust type as needed
    ref: 'Product',
  },
  crossSellProducts: {
    type: [mongoose.Schema.Types.ObjectId], // Adjust type as needed
    ref: 'Product',
  },
  product_thumbnail_id: {
    type: String,
  },
  product_galleries_id: {
    type: [String],
  },
  size_chart_image_id: {
    type: String,
  },
  variants: [
    {
      type: mongoose.Schema.Types.Mixed, // Adjust type as needed
    },
  ],
  variations: [
    {
      type: mongoose.Schema.Types.Mixed, // Adjust type as needed
    },
  ],
  attributesIds: [
    {
      type: mongoose.Schema.Types.ObjectId, // Adjust type as needed
      ref: 'Attribute',
    },
  ],
  seo: {
    metaTitle: {
      type: String,
    },
    metaDescription: {
      type: String,
    },
    productMetaImageUrl: {
      type: String,
    },
  },
  safeCheckout: {
    type: Boolean,
    default: true,
  },
  secureCheckout: {
    type: Boolean,
    default: true,
  },
  socialShare: {
    type: Boolean,
    default: true,
  },
  encourageOrder: {
    type: Boolean,
    default: true,
  },
  encourageView: {
    type: Boolean,
    default: true,
  },
  isFreeShipping: {
    type: Boolean,
    default: false,
  },
  estimatedDeliveryText: {
    type: String,
  },
  isReturn: {
    type: Boolean,
    default: false,
  },
  returnPolicyText: {
    type: String,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  isTrending: {
    type: Boolean,
    default: false,
  },
  isReturn: {
    type: Boolean,
    default: true,
  },
  status: {
    type: Number,
    default: 1,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
