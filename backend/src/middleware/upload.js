const multer = require('multer');
const path = require('path');
const fs = require('fs');
const AppError = require('../utils/AppError');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Storage configuration - disk storage with organized directories
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const subDir = req.uploadSubDir || 'general';
    const dir = path.join(uploadsDir, subDir);
    
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = allowedTypes.test(file.mimetype);

  if (extName && mimeType) {
    cb(null, true);
  } else {
    cb(new AppError('Only image files (jpeg, png, gif, webp) are allowed.', 400), false);
  }
};

const upload = multer({
  storage,
  limits: { 
    fileSize: 5 * 1024 * 1024, // 5MB per file
    files: 10 // max 10 files per request
  },
  fileFilter,
});

// Middleware to set upload subdirectory
const setUploadDir = (subDir) => (req, res, next) => {
  req.uploadSubDir = subDir;
  next();
};

const uploadSingle = (fieldName) => upload.single(fieldName);
const uploadMultiple = (fieldName, maxCount = 5) => upload.array(fieldName, maxCount);

module.exports = { 
  uploadSingle, 
  uploadMultiple,
  setUploadDir,
  uploadsDir 
};
