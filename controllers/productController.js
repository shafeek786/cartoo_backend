const Product = require("../models/productModel");

exports.addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      shortDescription,
      store,
      inventory,
      category,
      vendor,
    } = req.body;
    const images = req.files;

    // Ensure that images are available before accessing
    const thumbnail =
      images && images.thumbnail ? images.thumbnail[0].filename : undefined;
    const productImage =
      images && images.productImage
        ? images.productImage[0].filename
        : undefined;
    const sizeChart =
      images && images.sizeChart ? images.sizeChart[0].filename : undefined;

    const newProduct = new Product({
      name,
      description,
      shortDescription,
      store,
      inventory: {
        ...inventory, // Spread existing inventory fields
      },
      images: {
        thumbnail,
        productImage,
        sizeChart,
      },
      category,
      vendor,
    });

    await newProduct.save();

    res
      .status(201)
      .json({ message: "Product added successfully", product: newProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id; // Get the product ID from request parameters
    console.log(productId);
    const {
      name,
      description,
      shortDescription,
      store,
      inventory,
      category,
      vendor,
    } = req.body;
    const images = req.files;

    // Find the product by ID
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
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

    // Handle image updates if files are uploaded
    if (images) {
      product.images = {
        thumbnail: images.thumbnail
          ? images.thumbnail[0].filename
          : product.images.thumbnail,
        productImage: images.productImage
          ? images.productImage[0].filename
          : product.images.productImage,
        sizeChart: images.sizeChart
          ? images.sizeChart[0].filename
          : product.images.sizeChart,
      };
    }

    // Save the updated product
    await product.save();

    res.status(200).json({ message: "Product updated successfully", product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Fetch all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Fetch a product by its ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.toggleProductApproval = async (req, res) => {
  try {
    const productId = req.params.id; // Get the product ID from request parameters
    const { isApproved } = req.body; // Get the isApproved status from the request body

    // Find the product by ID
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update the isApproved status
    product.isApproved = isApproved;

    // Save the updated product
    await product.save();

    res.status(200).json({
      message: `Product ${isApproved ? "approved" : "blocked"} successfully`,
      product,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
