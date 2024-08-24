// controllers/themeOptionsController.js
const ThemeOptions = require('../../models/themeOptionsModel');

// Create a new theme option
exports.createThemeOption = async (req, res) => {
  try {
    const { payload } = req.body;
    const randomId = Math.floor(Math.random() * 1000000);
    const themeOptionData = {
      id: randomId,
      ...payload,
    };
    const themeOption = new ThemeOptions(themeOptionData);
    await themeOption.save();
    res.status(201).json(themeOption);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all theme options
exports.getLastThemeOption = async (req, res) => {
  try {
    const lastThemeOption = await ThemeOptions.findOne().sort({ _id: -1 });
    if (!lastThemeOption) {
      return res.status(404).json({ message: 'No theme options found' });
    }
    res.status(200).json(lastThemeOption);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single theme option by ID
exports.getThemeOptionById = async (req, res) => {
  try {
    const themeOption = await ThemeOptions.findById(req.params.id);
    if (!themeOption) {
      return res.status(404).json({ message: 'Theme option not found' });
    }
    res.status(200).json(themeOption);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a theme option by ID
exports.updateThemeOptionById = async (req, res) => {
  try {
    const themeOption = await ThemeOptions.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!themeOption) {
      return res.status(404).json({ message: 'Theme option not found' });
    }
    res.status(200).json(themeOption);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a theme option by ID
exports.deleteThemeOptionById = async (req, res) => {
  try {
    const themeOption = await ThemeOptions.findByIdAndDelete(req.params.id);
    if (!themeOption) {
      return res.status(404).json({ message: 'Theme option not found' });
    }
    res.status(200).json({ message: 'Theme option deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
