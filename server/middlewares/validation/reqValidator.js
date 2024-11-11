import { body, param, query } from 'express-validator'
const validateGetProducts = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer.'),
  query('limit')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Limit must be a positive integer.'),
  query('sortBy')
    .optional()
    .isIn(['priceLowToHigh', 'priceHighToLow', 'featured'])
    .withMessage('Invalid sort option.'),
  query('themes').optional().isString().withMessage('Themes must be a string.'),
  query('styles').optional().isString().withMessage('Styles must be a string.'),
  query('techniques')
    .optional()
    .isString()
    .withMessage('Techniques must be a string.'),
  query('priceRange')
    .optional()
    .isString()
    .matches(/^\d+,\d+$/)
    .withMessage('Price range must be in the format "min,max".'),
  query('aA_zZ').optional().isBoolean().withMessage('aA_zZ must be a boolean.'),
  query('zZ_aA').optional().isBoolean().withMessage('zZ_aA must be a boolean.'),
  query('includeCategories')
    .optional()
    .isBoolean()
    .withMessage('includeCategories must be a boolean.')
]

const validateUpdateCategory = [
  param('id').isMongoId().withMessage('Invalid category ID'),

  body('name')
    .optional()
    .isString()
    .withMessage('Name must be a string.')
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters long.'),

  body('type')
    .optional()
    .isString()
    .withMessage('Type must be a string.')
    .isIn(['Theme', 'Style', 'Technique'])
    .withMessage('Invalid category type.'),

  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string.')
    .isLength({ min: 3 })
    .withMessage('Description must be at least 3 characters long.')
]
const validateAddCategory = [
  body('name')
    .optional()
    .isString()
    .withMessage('Name must be a string.')
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters long.'),

  body('type')
    .optional()
    .isString()
    .withMessage('Type must be a string.')
    .isIn(['Theme', 'Style', 'Technique'])
    .withMessage('Invalid category type.'),

  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string.')
    .isLength({ min: 3 })
    .withMessage('Description must be at least 3 characters long.')
]

const validateAddProduct = [
  body('productName').notEmpty().withMessage('Product name is required').trim(),

  body('productPrice')
    .notEmpty()
    .withMessage('Product price is required')
    .isFloat({ gt: 0 })
    .withMessage('Product price must be greater than zero'),

  body('discountPrice')
    .optional({ checkFalsy: true })
    .isFloat({ gt: 0 })
    .withMessage('Discount price must be greater than zero if provided')
    .custom(value => value === null || value >= 0)
    .withMessage('Discount price must be a non-negative number if provided'),

  body('productCategory')
    .notEmpty()
    .withMessage('At least one product category is required'),

  body('productDescription')
    .notEmpty()
    .withMessage('Product description is required')
    .isLength({ min: 10 })
    .withMessage('Description should be at least 10 characters long'),

  body('artistName')
    .notEmpty()
    .withMessage('Artist information is required')
    .isObject()
    .withMessage('Artist information should be an object'),

  body('productInformation')
    .notEmpty()
    .withMessage('Product information is required')
    .isLength({ min: 20 })
    .withMessage('Product information should be at least 20 characters long'),

  body('productYear')
    .isInt({ min: 1000, max: new Date().getFullYear() })
    .withMessage(
      `Product year must be a valid year between 1000 and ${new Date().getFullYear()}`
    ),

  body('productStock')
    .notEmpty()
    .withMessage('Product stock is required')
    .isInt({ min: 0 })
    .withMessage('Stock cannot be negative'),

  body('productImages')
    .isArray({ min: 1 })
    .withMessage('Product images are required and should be an array.')
    .custom(arr => arr.every(item => typeof item === 'string'))
    .withMessage('Each product image should be a string'),

  body('thumbnailImage')
    .isArray({ min: 1 })
    .withMessage('Thumbnail image is required and should be an array.')
    .custom(arr => arr.every(item => typeof item === 'string'))
    .withMessage('Each thumbnail image should be a string'),
  body('weight')
    .optional()
    .isFloat({ gt: 0 })
    .withMessage('Weight must be greater than zero'),

  body('dimensions')
    .optional()
    .matches(
      /^(\d+(\.\d+)?)(?:\s*x\s*)(\d+(\.\d+)?)(?:\s*x\s*)(\d+(\.\d+)?)$|^(\d+(\.\d+)?)"\s*h\s*x\s*(\d+(\.\d+)?)"\s*w\s*x\s*(\d+(\.\d+)?)"\s*d$/i
    )
    .withMessage(
      'Dimensions should be in format: width x height x depth (e.g., 10.5x20.75x30 or 10" h x 20" w x 30" d)'
    )
]
const validateEditProduct = [
  param('id').isMongoId().withMessage('Invalid product ID'),

  body('productName')
    .trim()
    .notEmpty()
    .withMessage('Product name is required*')
    .isLength({ min: 1 })
    .withMessage('Product name must be at least 3 characters long'),

  body('productDescription')
    .trim()
    .notEmpty()
    .withMessage('Description is required*')
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters long'),

  body('productPrice')
    .notEmpty()
    .withMessage('Price is required*')
    .isFloat({ min: 0 })
    .withMessage('Price must be a valid non-negative number'),

  body('discountPrice')
    .optional({ checkFalsy: true })
    .isFloat({ gt: 0 })
    .withMessage('Discount price must be greater than zero if provided')
    .custom(value => value === null || value >= 0)
    .withMessage('Discount price must be a non-negative number if provided'),

  body('productYear')
    .isInt({ min: 0, max: new Date().getFullYear() })
    .withMessage('Product year must be a valid year up to the current year'),

  body('productStock')
    .isInt({ min: 0 })
    .withMessage('Product stock must be positive or zero'),

  body('weight')
    .notEmpty()
    .withMessage('Weight is required*')
    .isFloat({ min: 0 })
    .withMessage('Weight must be a positive number'),

  body('dimensions')
    .optional()
    .matches(
      /^(\d+(\.\d+)?)(?:\s*x\s*)(\d+(\.\d+)?)(?:\s*x\s*)(\d+(\.\d+)?)$|^(\d+(\.\d+)?)"\s*h\s*x\s*(\d+(\.\d+)?)"\s*w\s*x\s*(\d+(\.\d+)?)"\s*d$/i
    )
    .withMessage(
      'Dimensions should be in format: width x height x depth (e.g., 10.5x20.75x30 or 10" h x 20" w x 30" d)'
    ),
  body('artist')
    .notEmpty()
    .withMessage('Artist is required*')
    .isObject()
    .withMessage('Artist should be an object')
    .custom(artist => {
      if (!artist._id || !artist.name) {
        throw new Error('Artist must have valid _id and name')
      }
      return true
    }),

  body('productCategories')
    .isArray({ min: 1 })
    .withMessage('At least one category must be selected'),

  body('thumbnailImage')
    .isArray()
    .withMessage('Thumbnail image must be an array')
    .optional()
    .custom(value => {
      if (
        value &&
        value.length > 0 &&
        !value.every(item => typeof item === 'string')
      ) {
        throw new Error('Each thumbnail image should be a string')
      }
      return true
    }),

  body('productImages')
    .isArray()
    .withMessage('Product images must be an array')
    .optional()
    .custom(value => {
      if (
        value &&
        value.length > 0 &&
        !value.every(item => typeof item === 'string')
      ) {
        throw new Error('Each product image should be a string')
      }
      return true
    })
]
const validateAddDiscount = [
  body('discountData.name').notEmpty().withMessage('Discount name is required'),

  body('discountData.discountTarget')
    .notEmpty()
    .withMessage('Discount target is required'),

  body('discountData.discountType')
    .notEmpty()
    .withMessage('Discount type is required'),

  body('discountData.discountValue')
    .isFloat({ gt: 0 })
    .withMessage('Discount value must be greater than 0')
    .custom((value, { req }) => {
      if (req.body.discountData.discountType === 'fixed' && value < 0) {
        throw new Error('Discount value cannot be negative for fixed discounts')
      }
      if (req.body.discountData.discountType === 'percentage' && value > 100) {
        throw new Error('Discount percentage must be less than or equal to 100')
      }
      return true
    }),

  body('discountData.minValue')
    .optional()
    .custom((value, { req }) => {
      // If discountType is "fixed" and minValue is not provided or is invalid
      if (req.body.discountData.discountType === 'fixed') {
        if (value === undefined || value === null || value === '') {
          throw new Error('Min purchase amount is required for fixed discounts')
        }
        if (value <= 0) {
          throw new Error(
            'Min purchase amount must be greater than 0 for fixed discounts'
          )
        }
      }
      // For "percentage" discounts, minValue can be empty
      return true
    }),

  body('discountData.startDate')
    .notEmpty()
    .withMessage('Start date is required'),
  body('discountData.endDate')
    .notEmpty()
    .withMessage('End date is required')
    .custom((value, { req }) => {
      if (
        req.body.discountData.startDate &&
        new Date(req.body.discountData.startDate) >= new Date(value)
      ) {
        throw new Error('End date must be later than the start date')
      }
      return true
    }),

  body('discountData.targetId')
    .optional()
    .notEmpty()
    .withMessage('Target selection is required for this discount target')
    .custom((value, { req }) => {
      if (req.body.discountData.discountTarget && !value) {
        throw new Error('Target selection is required for this discount target')
      }
      return true
    }),

  body('discountData.status')
    .isIn(['Active', 'Expired', 'Blocked'])
    .withMessage('Discount status must be one of: Active, Expired, Blocked')
]

const ValidateAddCoupon = [
  body('newCoupon.discountType')
    .isIn(['percentage', 'fixed'])
    .withMessage('Discount type must be either "percentage" or "flat"'),
  body('newCoupon.discountAmount')
    .isFloat({ gt: 0 })
    .withMessage('Discount amount must be greater than 0'),
  body('newCoupon.minPurchaseAmount')
    .optional()
    .isFloat({ gt: 0 })
    .withMessage('Min purchase amount must be greater than 0'),
  body('newCoupon.maxDiscountAmount')
    .optional()
    .isFloat({ gt: 0 })
    .withMessage('Max discount amount must be greater than 0'),
  body('newCoupon.validFrom')
    .isISO8601()
    .withMessage('Valid From must be a valid date'),
  body('newCoupon.validTill')
    .isISO8601()
    .withMessage('Valid Till must be a valid date'),
  body('newCoupon.status')
    .isIn(['true', 'false'])
    .withMessage('Status must be either "active" or "inactive"')

  // Handle the request after validation
]
export {
  validateGetProducts,
  validateUpdateCategory,
  validateAddCategory,
  validateAddProduct,
  validateEditProduct,
  validateAddDiscount,
  ValidateAddCoupon
}
