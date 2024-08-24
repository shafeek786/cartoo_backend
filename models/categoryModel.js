const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  id: {
    type: Number,
  },
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  status: {
    type: Number,
    default: 1,
  },
  type: {
    type: String,
  },
  commission_rate: {
    type: Number,
    default: null,
  },
  created_by_id: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  deleted_at: {
    type: Date,
    default: null,
  },
  blogs_count: {
    type: Number,
    default: 0,
  },
  products_count: {
    type: Number,
    default: 0,
  },
  category_image: {
    id: Number,
    collection_name: String,
    name: String,
    file_name: String,
    mime_type: String,
    original_url: String,
  },
  category_icon: {
    id: Number,
    collection_name: String,
    name: String,
    file_name: String,
    mime_type: String,
    original_url: String,
  },
  subcategories: [
    {
      id: {
        type: Number,
      },
      name: {
        type: String,
        trim: true,
      },
      slug: {
        type: String,
        trim: true,
      },
      description: {
        type: String,
        trim: true,
      },
      category_image_id: {
        type: Number,
      },
      category_icon_id: {
        type: Number,
      },
      status: {
        type: Number,
        default: 1,
      },
      type: {
        type: String,
      },
      parent_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: null,
      },
      created_by_id: {
        type: String,
      },
      created_at: {
        type: Date,
        default: Date.now,
      },
      updated_at: {
        type: Date,
        default: Date.now,
      },
      category_image: {
        id: Number,
        collection_name: String,
        name: String,
        file_name: String,
        mime_type: String,
        original_url: String,
      },
      category_icon: {
        id: Number,
        collection_name: String,
        name: String,
        file_name: String,
        mime_type: String,
        original_url: String,
      },
    },
  ],
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null,
  },
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
