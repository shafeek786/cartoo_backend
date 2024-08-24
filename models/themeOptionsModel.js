const mongoose = require('mongoose');

const themeOptionsSchema = new mongoose.Schema({
  id: Number,
  options: {
    blog: {
      blog_author_enable: Boolean,
      blog_sidebar_type: String,
      blog_style: String,
      read_more_enable: Boolean,
    },
    collection: {
      collection_banner_image_url: String, // Corrected "collection_banner_image_ur" to "collection_banner_image_url"
      collection_layout: String,
    },
    contact_us: {
      contact_image_url: String,
      details: [
        {
          icon: String,
          label: String,
          text: String,
        },
      ],
    },
    error_page: {
      back_button_enable: Boolean,
      back_button_text: String,
      error_page_content: String,
    },
    footer: {
      about_address: String,
      about_email: String,
      app_store_url: String,
      copyright_content: String,
      facebook: String,
      footer_about: String,
      footer_categories: [{ type: Number }],
      footer_copyright: Boolean,
      footer_style: String,
      help_center: [
        {
          label: String,
          link: String,
        },
      ],
      instagram: String,
      pinterest: String,
      play_store_url: String,
      social_media_enable: Boolean,
      support_email: String,
      support_number: String,
      twitter: String,
      useful_link: [
        {
          label: String,
          link: String,
        },
      ],
    },
    general: {
      back_to_top_enable: Boolean, // Updated from 'true' to 'Boolean'
      cart_style: String,
      language_direction: String,
      mode: String,
      primary_color: String,
      site_tagline: String,
      site_title: String,
    },
    header: {
      category_ids: [{ type: Number }],
      header_options: String,
      page_top_bar_dark: Boolean,
      page_top_bar_enable: Boolean,
      sticky_header_enable: Boolean,
      support_number: String,
      today_deals: [{ type: Number }],
      top_bar_content: [
        {
          content: String,
        },
      ],
    },
    logo: {
      favicon_icon: {
        collection_name: String,
        conversions_disk: String,
        created_at: { type: Date, default: Date.now },
        created_by_id: String,
        disk: String,
        file_name: String,
        id: String,
        mime_type: String,
        name: String,
        original_url: String,
        size: Number,
        updated_at: Date,
      },
      favicon_icon_id: String,
      footer_logo: {
        collection_name: String,
        conversions_disk: String,
        created_at: { type: Date, default: Date.now },
        created_by_id: String,
        disk: String,
        file_name: String,
        id: String,
        mime_type: String,
        name: String,
        original_url: String,
        size: Number,
        updated_at: Date,
      },
      footer_logo_id: String,
      header_logo: {
        collection_name: String,
        conversions_disk: String,
        created_at: { type: Date, default: Date.now },
        created_by_id: String,
        disk: String,
        file_name: String,
        id: String,
        mime_type: String,
        name: String,
        original_url: String,
        size: Number,
        updated_at: Date,
      },
      header_logo_id: String,
    },
    product: {
      banner_enable: Boolean,
      banner_image_url: String,
      encourage_max_order_count: Number,
      encourage_max_view_count: Number,
      encourage_order: Boolean,
      encourage_view: Boolean,
      is_trending_product: Boolean,
      product_layout: String,
      safe_checkout: Boolean,
      safe_checkout_image: String,
      shipping_and_return: String,
      social_share: Boolean,
      sticky_checkout: Boolean,
      sticky_product: Boolean,
    },
    seller: {
      about: {
        description: String,
        image_url: String,
        status: Boolean,
        title: String,
      },
      services: {
        service_1: {
          description: String,
          image_url: String,
          title: String,
        },
        service_2: {
          description: String,
          image_url: String,
          title: String,
        },
        service_3: {
          description: String,
          image_url: String,
          title: String,
        },
        service_4: {
          description: String,
          image_url: String,
          title: String,
        },
      },
      start_selling: {
        description: String,
        status: Boolean,
        title: String,
      },
      steps: {
        status: Boolean,
        step_1: {
          description: String,
          title: String,
        },
        step_2: {
          description: String,
          title: String,
        },
        step_3: {
          description: String,
          title: String,
        },
        title: String,
      },
      store_details: String,
      store_layout: String,
    },
    seo: {
      meta_description: String,
      meta_tags: String,
      meta_title: String,
      og_description: String,
      og_image: {
        collection_name: String,
        conversions_disk: String,
        created_at: { type: Date, default: Date.now },
        created_by_id: String,
        disk: String,
        file_name: String,
        id: String,
        mime_type: String,
        name: String,
        original_url: String,
        size: Number,
        updated_at: Date,
      },
      og_image_id: String,
      og_title: String,
    },
  },
});

const ThemeOptions = mongoose.model('ThemeOptions', themeOptionsSchema);

module.exports = ThemeOptions;
