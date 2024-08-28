const express = require('express');
const router = express.Router();
const multer = require('multer');
const adminImageController = require('../controllers/adminImageController');
const jwtAuth = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/admin/banners');
  },
  filename: (req, file, cb) => {
    const name = Date.now() + '-' + file.originalname;
    cb(null, name);
  },
});

const upload = multer({ storage: storage });

router.post(
  '/addimage',
  jwtAuth('admin'),
  upload.array('banner', 5),
  adminImageController.addImage
);

router.get('/getImage', jwtAuth('admin'), adminImageController.getImage);

router.post('/generate-upload-url', adminImageController.generateUploadUrls);
router.post(
  '/store-keys',
  jwtAuth('admin'),
  adminImageController.storeAttachmentKeys
);
// Export the router
module.exports = router;
