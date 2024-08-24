const { status } = require('express/lib/response');
const Category = require('../models/categoryModel');

// Create a new category
exports.createCategory = async (req, res) => {
  console.log(req.body.payload);
  try {
    const {
      name,
      slug,
      description,
      status,
      type,
      commission_rate,
      parent_id,
      created_by_id,
      category_image,
      category_icon,
    } = req.body.payload;

    const id = Math.floor(Math.random() * 1000000000);
    // Create a new category object
    const newCategory = new Category({
      id,
      name,
      slug: name,
      description,
      status,
      type,
      commission_rate,
      parent_id,
      created_by_id,
      category_image: {
        id: category_image.id,
        collection_name: category_image.collection_name,
        name: category_image.name,
        file_name: category_image.file_name,
        mime_type: category_image.mime_type,
        original_url: category_image.original_url,
      },
      category_icon: {
        original_url: category_icon,
      },
    });

    // Save the new category
    await newCategory.save();
    if (parent_id) {
      // If parent_id is provided, find the parent category
      const parentCategory = await Category.findOne({ id: parent_id });

      if (!parentCategory) {
        return res.status(404).json({ message: 'Parent category not found' });
      }

      // Add the new category as a subcategory of the parent
      parentCategory.subcategories.push(newCategory);
      await parentCategory.save();
    }
    const categories = await Category.find();
    res.status(201).json({ data: categories });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ data: categories });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a category by ID
exports.updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true, runValidators: true }
    );
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a category by ID
exports.deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    let deleteCategory = await Category.findOneAndDelete({ id: categoryId });

    if (!deleteCategory) {
      const parentCategory = await Category.findOne({
        'subcategories.id': categoryId,
      });

      if (parentCategory) {
        const subcategoryToRemoveIndex = parentCategory.subcategories.findIndex(
          sub => String(sub.id) === String(categoryId)
        );

        if (subcategoryToRemoveIndex > -1) {
          parentCategory.subcategories.splice(subcategoryToRemoveIndex, 1);
          await parentCategory.save();
        }
      } else {
        return res
          .status(404)
          .json({ message: 'Category or subcategory not found' });
      }
    }
    const categories = await Category.find();
    res.status(201).json({ data: categories });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
