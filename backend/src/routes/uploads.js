const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const { protect } = require('../middleware/auth');
const { uploadSingle, uploadMultiple, setUploadDir } = require('../middleware/upload');

// Upload single image (authenticated)
router.post('/single', 
  protect,
  setUploadDir('general'),
  uploadSingle('image'),
  uploadController.uploadImage
);

// Upload multiple images (authenticated)
router.post('/multiple', 
  protect,
  setUploadDir('general'),
  uploadMultiple('images', 10),
  uploadController.uploadImages
);

// Upload avatar (authenticated)
router.post('/avatar', 
  protect,
  setUploadDir('avatars'),
  uploadSingle('avatar'),
  uploadController.uploadImage
);

// Upload cover image (authenticated)
router.post('/cover', 
  protect,
  setUploadDir('covers'),
  uploadSingle('cover'),
  uploadController.uploadImage
);

// Upload dinner images (authenticated)
router.post('/dinner', 
  protect,
  setUploadDir('dinners'),
  uploadMultiple('images', 5),
  uploadController.uploadImages
);

// Upload restaurant images (authenticated)
router.post('/restaurant', 
  protect,
  setUploadDir('restaurants'),
  uploadMultiple('images', 10),
  uploadController.uploadImages
);

// Delete uploaded file (authenticated)
router.delete('/', protect, uploadController.deleteImage);

module.exports = router;
