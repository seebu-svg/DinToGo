const { body, param, query, validationResult } = require('express-validator');

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }
  next();
};

const registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 80 }),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('role').optional().isIn(['customer', 'influencer', 'restaurant', 'admin']).withMessage('Invalid role'),
  handleValidation,
];

const loginRules = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidation,
];

const dinnerRules = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 120 }),
  body('description').optional().isLength({ max: 2000 }),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('maxGuests').isInt({ min: 1, max: 500 }).withMessage('maxGuests must be 1-500'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be >= 0'),
  body('type').optional().isIn(['public', 'private']).withMessage('Type must be public or private'),
  handleValidation,
];

const reservationRules = [
  body('dinner').isInt({ min: 1 }).withMessage('Valid dinner ID is required'),
  body('partySize').isInt({ min: 1, max: 20 }).withMessage('Party size must be 1-20'),
  body('specialRequests').optional().isLength({ max: 500 }),
  handleValidation,
];

const offerRules = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('discountPercent').isFloat({ min: 1, max: 100 }).withMessage('Discount must be 1-100%'),
  body('validFrom').isISO8601().withMessage('validFrom date is required'),
  body('validUntil').isISO8601().withMessage('validUntil date is required'),
  handleValidation,
];

const reviewRules = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be 1-5'),
  body('comment').optional().isLength({ max: 1000 }).withMessage('Comment max 1000 chars'),
  handleValidation,
];

const idParam = (name) => [
  param(name).isInt({ min: 1 }).withMessage(`Invalid ${name}`),
  handleValidation,
];

module.exports = {
  registerRules,
  loginRules,
  dinnerRules,
  reservationRules,
  offerRules,
  reviewRules,
  idParam,
  handleValidation,
};
