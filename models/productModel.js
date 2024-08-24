const { type } = require('express/lib/response');
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  attributes_ids: [{ type: Number }],
  categories: {
    type: [Number],
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  encourage_order: { type: Boolean },
  encourage_view: { type: Boolean },
  estimated_delivery_text: { type: String },
  is_featured: { type: Boolean },
  is_free_shipping: { type: Boolean, default: false },
  is_random_related_products: { type: Boolean, default: false },
  is_return: { type: Boolean, default: false },
  is_sale_enable: { type: Boolean, default: false },
  is_trending: { type: Boolean, default: false },
  meta_description: { type: String },
  meta_title: { type: String },
  social_share: { type: Boolean, default: true },

  slug: {
    type: String,
    required: true,
    unique: true,
  },

  short_description: {
    type: String,
    required: true,
  },
  store_id: {
    type: Number,
    required: true,
    ref: 'Vendor',
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
  related_products: [{ type: String }],
  return_policy_text: { type: String },
  safe_checkout: { type: Boolean, default: true },
  sale_expired_at: { type: Date },
  sale_starts_at: { type: Date },
  secure_checkout: { type: Boolean, default: true },

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
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Product',
  },
  crossSellProducts: {
    type: [mongoose.Schema.Types.ObjectId],
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
  product_meta_image_id: {
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
  tax_id: {
    type: String,
  },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
