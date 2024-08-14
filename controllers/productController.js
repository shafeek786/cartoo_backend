const Product = require('../models/productModel');
const slugify = require('slugify');
const crypto = require('crypto');

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
    console.log(req.body);
    const productData = JSON.parse(req.body.product);

    // Handle image uploads
    const id = crypto.randomInt(100000, 999999);
    const slug = await generateUniqueSlug(productData.name);
    // Create new product with spread properties
    const newProduct = new Product({
      ...productData,
      slug,
      id,
    });

    await newProduct.save();

    res
      .status(201)
      .json({ message: 'Product added successfully', product: newProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const {
      name,
      description,
      shortDescription,
      store,
      inventory,
      category,
      vendor,
    } = req.body;

    // Handle image updates
    const images = req.files || {};
    const updatedImagePaths = {
      thumbnail: images.thumbnail ? images.thumbnail[0].filename : undefined,
      productImage: images.productImage
        ? images.productImage[0].filename
        : undefined,
      sizeChart: images.sizeChart ? images.sizeChart[0].filename : undefined,
    };

    // Find the product by ID
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update product fields
    product.name = name || product.name;
    product.description = description || product.description;
    product.shortDescription = shortDescription || product.shortDescription;
    product.store = store || product.store;
    product.inventory = {
      ...product.inventory,
      ...inventory,
    };
    product.category = category || product.category;
    product.vendor = vendor || product.vendor;

    // Update image fields if new images are uploaded
    product.productThumbnailUrl =
      updatedImagePaths.thumbnail || product.productThumbnailUrl;
    product.productImageUrl =
      updatedImagePaths.productImage || product.productImageUrl;
    product.sizeChartUrl = updatedImagePaths.sizeChart || product.sizeChartUrl;

    // Save the updated product
    await product.save();

    res.status(200).json({ message: 'Product updated successfully', product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Fetch all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ data: products });
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
