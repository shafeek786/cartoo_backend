const { type } = require('express/lib/response');
const mongoose = require('mongoose');

const homeBannerSchema = new mongoose.Schema({
  content: {
    id: { type: Number },
    slug: {
      type: String,
    },
    featured_banners: {
      banners: [
        {
          image_url: {
            type: String,
          },
          image_key: {
            type: String,
          },

          redirect_link: {
            link: {
              type: String,
            },
            link_type: {
              type: String,
            },
          },
          status: {
            type: Boolean,
            default: true,
          },
        },
      ],
      status: {
        type: Boolean,
        default: true,
      },
    },
    home_banner: {
      main_banner: {
        image_url: {
          type: String,
        },
        image_key: {
          type: String,
        },

        redirect_link: {
          link: {
            type: String,
          },
          link_type: {
            type: String,
          },
        },
      },
      sub_banner_1: {
        image_url: {
          type: String,
        },
        image_key: {
          type: String,
        },
        redirect_link: {
          link: {
            type: String,
          },
          link_type: {
            type: String,
          },
        },
      },
      sub_banner_2: {
        image_url: {
          type: String,
        },
        image_key: {
          type: String,
        },
        redirect_link: {
          link: {
            type: String,
          },
          link_type: {
            type: String,
          },
        },
      },
    },
    main_content: {
      section1_products: {
        description: { type: String },
        product_ids: [{ type: String }],
        status: { type: Boolean },
        title: { type: String },
      },
      section2_categories_list: {
        description: { type: String },
        category_ids: [{ type: Number }],
        image_url: { type: String, default: null },
        image_key: {
          type: String,
        },
        age_key: {
          type: String,
        },
        status: { type: Boolean },
        title: { type: String },
      },
      section3_two_column_banners: {
        banner_1: {
          image_url: { type: String },
          image_key: {
            type: String,
          },

          redirect_link: {
            link: { type: String, default: undefined },
            link_type: { type: String },
            product_ids: { type: [Number], default: undefined },
          },
        },
        banner_2: {
          image_url: { type: String },
          image_key: {
            type: String,
          },

          redirect_link: {
            link: { type: String, default: undefined },
            link_type: { type: String },
          },
        },
        status: { type: Boolean },
      },
      section4_products: {
        description: { type: String },
        product_ids: [{ type: String }],
        status: { type: Boolean },
        title: { type: String },
      },
      section5_coupons: {
        image_url: { type: String },
        image_key: {
          type: String,
        },

        redirect_link: {
          link: { type: String, default: undefined },
          link_type: { type: String },
          product_ids: { type: [Number], default: undefined },
        },
        status: { type: Boolean },
      },
      section6_two_column_banners: {
        banner_1: {
          image_url: { type: String },

          image_key: {
            type: String,
          },
          redirect_link: {
            link: { type: String, default: undefined },
            link_type: { type: String },
          },
        },
        banner_2: {
          image_url: { type: String },
          image_key: {
            type: String,
          },

          redirect_link: {
            link: { type: String, default: undefined },
            link_type: { type: String },
          },
        },
        status: { type: Boolean },
      },
      section7_products: {
        description: { type: String },
        product_ids: [{ type: String }],
        status: { type: Boolean },
        title: { type: String },
      },
      section8_full_width_banner: {
        image_url: { type: String },

        image_key: {
          type: String,
        },
        redirect_link: {
          link: { type: String, default: undefined },
          link_type: { type: String },
          product_ids: { type: [String], default: undefined },
        },
        status: { type: Boolean },
      },
      section9_featured_blogs: {
        blog_ids: [{ type: Number }],
        description: { type: String },
        status: { type: Boolean },
        title: { type: String },
      },
      sidebar: {
        categories_icon_list: {
          category_ids: [{ type: Number }],
          status: { type: Boolean },
          title: { type: String },
        },
        left_side_banners: {
          banner_1: {
            image_url: { type: String },
            image_key: {
              type: String,
            },

            redirect_link: {
              link: { type: String, default: undefined },
              link_type: { type: String },
              product_ids: { type: [String], default: undefined },
            },
          },
          banner_2: {
            image_url: { type: String },
            image_key: {
              type: String,
            },

            redirect_link: {
              link: { type: String, default: undefined },
              link_type: { type: String },
            },
          },
        },
        sidebar_products: {
          product_ids: [{ type: String }],
          status: { type: Boolean },
          title: { type: String },
        },
        status: { type: Boolean },
      },
      status: { type: Boolean },
    },
    news_letter: {
      image_url: { type: String },
      image_key: {
        type: String,
      },
      status: { type: Boolean },
      sub_title: { type: String },
      title: { type: String },
    },
  },
  slug: {
    type: String,
  },
});

const HomeBanner = mongoose.model('HomeBanner', homeBannerSchema);

module.exports = HomeBanner;
