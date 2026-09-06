const path = require('path');
const fs = require('fs').promises;
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

/**
 * Upload a single image
 * Returns the URL path to access the uploaded file
 */
const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError('No file uploaded.', 400);
  }

  const fileUrl = `/uploads/${req.uploadSubDir || 'general'}/${req.file.filename}`;
  
  res.status(200).json({
    success: true,
    data: {
      url: fileUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
    }
  });
});

/**
 * Upload multiple images
 * Returns array of URL paths
 */
const uploadImages = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    throw new AppError('No files uploaded.', 400);
  }

  const subDir = req.uploadSubDir || 'general';
  const files = req.files.map(file => ({
    url: `/uploads/${subDir}/${file.filename}`,
    filename: file.filename,
    originalName: file.originalname,
    size: file.size,
    mimetype: file.mimetype,
  }));

  res.status(200).json({
    success: true,
    data: files
  });
});

/**
 * Delete an uploaded file
 */
const deleteImage = asyncHandler(async (req, res) => {
  const { url } = req.body;
  
  if (!url) {
    throw new AppError('File URL is required.', 400);
  }

  // Extract relative path from URL (e.g., /uploads/avatars/file.jpg -> uploads/avatars/file.jpg)
  const relativePath = url.startsWith('/') ? url.slice(1) : url;
  const fullPath = path.join(__dirname, '../../', relativePath);

  // Security: ensure the path is within uploads directory
  const uploadsDir = path.join(__dirname, '../../uploads');
  if (!fullPath.startsWith(uploadsDir)) {
    throw new AppError('Invalid file path.', 400);
  }

  try {
    await fs.unlink(fullPath);
    res.status(200).json({
      success: true,
      message: 'File deleted successfully.'
    });
  } catch (err) {
    if (err.code === 'ENOENT') {
      throw new AppError('File not found.', 404);
    }
    throw err;
  }
});

module.exports = {
  uploadImage,
  uploadImages,
  deleteImage,
};
