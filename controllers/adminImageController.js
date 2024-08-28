const Img = require('../models/adminImageModel');
const s3 = require('../config/s3');
const mime = require('mime-types');
exports.addImage = async (req, res) => {
  try {
    // Check if files were uploaded
    if (!req.files) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    // Extract image URLs from the uploaded files
    const original_url = req.files.map(file => file.filename);

    const user_id = req.user.userId;

    // Create new Image documents for each uploaded file
    const images = original_url.map(
      original_url => new Img({ original_url, user_id })
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

exports.generateUploadUrls = async (req, res) => {
  try {
    const fileNames = req.body.fileNames;
    const uploadUrls = fileNames.map(fileName => {
      const extension = fileName.split('.').pop();
      const contentType = mime.lookup(extension);
      const key = `cartoo-${Date.now()}-${fileName}`;
      const uploadUrl = s3.getSignedUrl('putObject', {
        Bucket: 'cartoo',
        Key: key,
        ContentType: contentType || 'application/octet-stream',
      });

      return { key, uploadUrl };
    });

    res.status(200).json({ data: uploadUrls });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Storing the keys
exports.storeAttachmentKeys = async (req, res) => {
  try {
    const keys = req.body; // Assuming req.body contains an array of keys

    const user_id = req.user.userId;

    // Save the images to the database
    const images = keys.map(key => new Img({ original_url: key, user_id }));
    const savedImages = await Img.insertMany(images);

    // Generate signed URLs for the stored images
    const imagesWithUrls = savedImages.map(image => {
      const imageUrl = s3.getSignedUrl('getObject', {
        Bucket: 'cartoo',
        Key: image.original_url,
        Expires: 60 * 5, // URL will expire in 5 minutes
      });
      return {
        ...image._doc, // Spread the image document properties
        image_url: imageUrl, // Add the generated URL
      };
    });

    res.status(201).json({
      message: 'Images added successfully',
      data: imagesWithUrls,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getImage = async (req, res) => {
  try {
    const user_id = req.user.userId;
    const { search, field, sort, page, paginate } = req.query;

    // Constructing the query
    let query = { user_id };

    if (search) {
      query[field || 'original_url'] = { $regex: search, $options: 'i' };
    }

    // Determine sort order based on the sort parameter
    let sortOrder;
    if (sort === 'smallest') {
      sortOrder = { original_url: 1 }; // Ascending order by file name
    } else if (sort === 'largest') {
      sortOrder = { original_url: -1 }; // Descending order by file name
    } else if (sort === 'newest') {
      sortOrder = { createdAt: -1 }; // Newest first
    } else if (sort === 'oldest') {
      sortOrder = { createdAt: 1 }; // Oldest first
    }

    // Fetching images from the database with filtering, sorting, and pagination
    const images = await Img.find(query)
      .sort(sortOrder)
      .skip((page - 1) * parseInt(paginate))
      .limit(parseInt(paginate));
    const responseImages = images.map(image => {
      const imageUrl = s3.getSignedUrl('getObject', {
        Bucket: 'cartoo',
        Key: image.original_url,
        Expires: 60 * 5,
      });

      return {
        ...image._doc,
        image_url: imageUrl,
      };
    });

    res.status(200).json({
      success: true,
      data: responseImages,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
