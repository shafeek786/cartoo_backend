const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  values: {
    activation: {
      coupon_enable: { type: Boolean, default: true },
      multivendor: { type: Boolean, default: true },
      point_enable: { type: Boolean, default: true },
      product_auto_approve: { type: Boolean, default: true },
      stock_product_hide: { type: Boolean, default: true },
      store_auto_approve: { type: Boolean, default: true },
      wallet_enable: { type: Boolean, default: true },
    },
    analytics: {
      facebook_pixel: {
        pixel_id: { type: String },
        status: { type: Boolean, default: false },
      },
      google_analytics: {
        measurement_id: { type: String },
        status: { type: Boolean, default: false },
      },
    },
    delivery: {
      default: {
        description: { type: String },
        title: { type: String },
      },
      default_delivery: { type: Number },
      same_day: {
        description: { type: String },
        title: { type: String },
      },
      same_day_delivery: { type: Boolean, default: false },
      same_day_intervals: [
        {
          description: { type: String },
          title: { type: String },
        },
      ],
    },
    email: {
      mail_encryption: { type: String },
      mail_from_address: { type: String },
      mail_from_name: { type: String },
      mail_host: { type: String },
      mail_mailer: { type: String },
      mail_password: { type: String },
      mail_port: { type: String },
      mail_username: { type: String },
      mailgun_domain: { type: String },
      mailgun_secret: { type: String },
    },
    general: {
      admin_site_language_direction: { type: String },
      copyright: { type: String },
      dark_logo_image_id: { type: String },
      default_currency: {
        id: { type: Number },
        code: { type: String },
        symbol: { type: String },
        no_of_decimal: { type: Number },
        exchange_rate: { type: String },
        symbol_position: { type: String },
        thousands_separator: { type: String },
        decimal_separator: { type: String },
        system_reserve: { type: Number, default: 1 },
        status: { type: Number },
        created_by_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          default: null,
        },
        created_at: { type: Date, default: Date.now },
        updated_at: { type: Date, default: Date.now },
        deleted_at: { type: Date, default: null },
      },
      default_timezone: { type: String },
      favicon_image_id: { type: String },
      light_logo_image_id: { type: String },
      min_order_amount: { type: Number },
      min_order_free_shipping: { type: Number },
      mode: { type: String },
      product_sku_prefix: { type: String },
      site_tagline: { type: String },
      site_title: { type: String },
      tiny_logo_image_id: { type: String },
    },
    google_reCaptcha: {
      secret: { type: String },
      site_key: { type: String },
      status: { type: Boolean, default: false },
    },
    maintenance: {
      description: { type: String },
      maintenance_image_id: { type: String },
      maintenance_mode: { type: Boolean, default: false },
      title: { type: String },
    },
    newsletter: {
      mailchip_api_key: { type: String },
      mailchip_list_id: { type: String },
      status: { type: Boolean, default: false },
    },
    payment_methods: {
      cod: {
        status: { type: Boolean, default: true },
      },
      razorpay: {
        key: { type: String },
        secret: { type: String },
        status: { type: Boolean, default: true },
      },
    },
    refund: {
      refundable_days: { type: Number },
      status: { type: Boolean, default: true },
    },
    vendor_commissions: {
      commission_ranges: [
        {
          commission_rate: { type: Number },
          from_amount: { type: Number },
          to_amount: { type: Number },
        },
      ],
      default_commission_rate: { type: Number },
      is_category_based_commission: { type: Boolean },
      min_withdraw_amount: { type: Number },
      status: { type: Boolean, default: true },
    },
    wallet_points: {
      min_per_order_amount: { type: Number },
      point_currency_ratio: { type: Number },
      reward_per_order_amount: { type: Number },
      signup_points: { type: Number },
    },
  },
});

const Settings = mongoose.model('Settings', settingsSchema);

module.exports = Settings;
