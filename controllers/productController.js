const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const slugify = require('slugify');
const crypto = require('crypto');
const s3 = require('../config/s3');
const { bulkSave } = require('../models/imageModel');

async function generateUniqueSlug(name) {
  let slug = slugify(name, { lower: true, strict: true });
  let existingProduct = await Product.findOne({ slug });

  let count = 1;
  while (existingProduct) {
    slug = `${slugify(name, { lower: true, strict: true })}-${count}`;
    existingProduct = await Product.findOne({ slug });
    count++;
  }

  return slug;
}
exports.addProduct = async (req, res) => {
  try {
    const productData = JSON.parse(req.body.product);
    const id = crypto.randomInt(100000, 999999);
    const slug = await generateUniqueSlug(productData.name);

    // Create new product with spread properties
    const newProduct = new Product({
      ...productData,
      slug,
      id,
    });

    await newProduct.save();

    const products = await Product.find();
    // Map through products to generate signed URLs for the gallery images
    const responseProducts = products.map(product => {
      let galleryUrls = [];
      if (product.product_galleries_id) {
        galleryUrls =
          product.product_galleries_id?.map(imageKey => {
            return s3.getSignedUrl('getObject', {
              Bucket: 'cartoo',
              Key: imageKey,
              Expires: 60 * 5, // URL expires in 5 minutes
            });
          }) || [];
      }

      let thumbnail = null;
      if (product.product_thumbnail_id) {
        thumbnail = s3.getSignedUrl('getObject', {
          Bucket: 'cartoo',
          Key: product.product_thumbnail_id,
          Expires: 60 * 5,
        });
      }

      let chart = null;
      if (product.product_chart_id) {
        chart = s3.getSignedUrl('getObject', {
          Bucket: 'cartoo',
          Key: product.product_chart_id,
          Expires: 60 * 5,
        });
      }
      return {
        ...product._doc,
        gallery_images: { images_url: galleryUrls },
        thumbnail_image: { image_url: thumbnail },
        chart_image: { image_url: chart },
      };
    });
    res.status(200).json({ data: responseProducts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const productData = JSON.parse(req.body.product);
    // Find the product by ID
    let product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update product fields by merging existing product with request body
    Object.assign(product, productData);

    // Save the updated product
    await product.save();

    // Generate signed URLs for the updated product
    let galleryUrls = [];
    if (product.product_galleries_id) {
      galleryUrls =
        product.product_galleries_id?.map(imageKey => {
          return s3.getSignedUrl('getObject', {
            Bucket: 'cartoo',
            Key: imageKey,
            Expires: 60 * 5, // URL expires in 5 minutes
          });
        }) || [];
    }

    let thumbnail = null;
    if (product.product_thumbnail_id) {
      thumbnail = s3.getSignedUrl('getObject', {
        Bucket: 'cartoo',
        Key: product.product_thumbnail_id,
        Expires: 60 * 5,
      });
    }

    let chart = null;
    if (product.product_chart_id) {
      chart = s3.getSignedUrl('getObject', {
        Bucket: 'cartoo',
        Key: product.product_chart_id,
        Expires: 60 * 5,
      });
    }

    // Respond with the updated product
    const responseProduct = {
      ...product._doc,
      gallery_images: { images_url: galleryUrls },
      thumbnail_image: { image_url: thumbnail },
      chart_image: { image_url: chart },
    };

    res.status(200).json({ data: responseProduct });
  } catch (err) {
    console.error('Server Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Fetch all products
exports.getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      paginate = 10,
      category,
      // additional filters like status, price, sort, etc.
    } = req.query;

    const query = {};

    if (category) {
      const categoryNames = category.split(',').map(name => name.trim());

      const categories = await Category.find({
        name: { $in: categoryNames },
      }).select('id');

      if (categories.length > 0) {
        const categoryIds = categories.map(cat => cat.id);
        query.categories = { $in: categoryIds };
      } else {
        return res.status(200).json({ data: [] });
      }
    }

    const limit = parseInt(paginate, 10);
    const skip = (page - 1) * limit;

    const products = await Product.find(query).skip(skip).limit(limit);
    // Map through products to generate signed URLs for the gallery images
    const responseProducts = products.map(product => {
      let galleryUrls = [];
      if (product.product_galleries_id) {
        galleryUrls =
          product.product_galleries_id?.map(imageKey => {
            return s3.getSignedUrl('getObject', {
              Bucket: 'cartoo',
              Key: imageKey,
              Expires: 60 * 5, // URL expires in 5 minutes
            });
          }) || [];
      }

      let thumbnail = null;
      if (product.product_thumbnail_id) {
        thumbnail = s3.getSignedUrl('getObject', {
          Bucket: 'cartoo',
          Key: product.product_thumbnail_id,
          Expires: 60 * 5,
        });
      }

      let chart = null;
      if (product.product_chart_id) {
        chart = s3.getSignedUrl('getObject', {
          Bucket: 'cartoo',
          Key: product.product_chart_id,
          Expires: 60 * 5,
        });
      }
      return {
        ...product._doc,
        gallery_images: { image_url: galleryUrls },
        thumbnail_image: { image_url: thumbnail },
        chart_image: { image_url: chart },
      };
    });
    res.status(200).json({ data: responseProducts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Fetch a product by its ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.toggleProductApproval = async (req, res) => {
  try {
    const productId = req.params.id; // Get the product ID from request parameters
    const { isApproved } = req.body; // Get the isApproved status from the request body

    // Find the product by ID
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update the isApproved status
    product.isApproved = isApproved;

    // Save the updated product
    await product.save();

    res.status(200).json({
      message: `Product ${isApproved ? 'approved' : 'blocked'} successfully`,
      product,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProductBySlug = async (req, res) => {
  try {
    // Fetch the main product based on the slug
    const product = await Product.findOne({ slug: req.params.slug });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    let galleryUrls = [];
    if (product.product_galleries_id) {
      galleryUrls =
        product.product_galleries_id?.map(imageKey => {
          return s3.getSignedUrl('getObject', {
            Bucket: 'cartoo',
            Key: imageKey,
            Expires: 60 * 5, // URL expires in 5 minutes
          });
        }) || [];
    }

    let thumbnail = null;
    if (product.product_thumbnail_id) {
      thumbnail = s3.getSignedUrl('getObject', {
        Bucket: 'cartoo',
        Key: product.product_thumbnail_id,
        Expires: 60 * 5,
      });
    }

    let chart = null;
    if (product.product_chart_id) {
      chart = s3.getSignedUrl('getObject', {
        Bucket: 'cartoo',
        Key: product.product_chart_id,
        Expires: 60 * 5,
      });
    }
    // Fetch related products based on shared categories
    const relatedProducts = await Product.find({
      _id: { $ne: product._id },
      categories: { $in: product.categories },
    }).limit(4); // Limit to 4 related products

    // Fetch cross-sell products based on a different criterion, e.g., tags
    const crossSellProducts = await Product.find({
      _id: { $ne: product._id },
      tags: { $in: product.tags }, // Assuming the product has tags
    }).limit(4); // Limit to 4 cross-sell products

    // Structure the response to match frontend expectations
    res.status(200).json({
      data: [
        {
          ...product.toObject(),
          gallery_images: { image_url: galleryUrls },
          thumbnail_image: { image_url: thumbnail },
          chart_image: { image_url: chart },
          related_products: relatedProducts.map(prod => prod._id),
          cross_sell_products: crossSellProducts.map(prod => prod._id),
        },
      ],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
