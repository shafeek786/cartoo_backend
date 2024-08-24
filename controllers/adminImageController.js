const Img = require('../models/adminImageModel');

exports.addImage = async (req, res) => {
  try {
    // Check if files were uploaded
    if (!req.files) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    // Extract image URLs from the uploaded files
    const original_url = req.files.map(file => file.filename);

    const vendor_id = req.user.userId;

    // Create new Image documents for each uploaded file
    const images = original_url.map(
      original_url => new Img({ original_url, vendor_id })
    );

    // Save all images to the database
    const savedImages = await Img.insertMany(images);

    res
      .status(201)
      .json({ message: 'Images added successfully', data: savedImages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getImage = async (req, res) => {
  const vendor_id = req.user.userId;
  const images = await Img.find({ vendor_id });
  res.status(201).json({ success: true, data: images });
};
