import { query, validationResult } from 'express-validator'
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
    .isIn(['priceLowToHigh', 'priceHighToLow'])
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

export { validateGetProducts }
