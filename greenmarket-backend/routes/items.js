const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { Op } = require('sequelize');
const Item = require('../models/Item');
const User = require('../models/User');
const { auth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/items
// @desc    Get all items with filtering and pagination
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('minPrice').optional().isFloat({ min: 0 }).withMessage('Minimum price must be non-negative'),
  query('maxPrice').optional().isFloat({ min: 0 }).withMessage('Maximum price must be non-negative'),
  query('category').optional().isIn(['electronics', 'books', 'clothing', 'furniture', 'sports', 'music', 'home-garden', 'automotive', 'other']),
  query('condition').optional().isIn(['new', 'like-new', 'good', 'fair', 'poor'])
], optionalAuth, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { 
      page = 1, 
      limit = 12, 
      search = '', 
      category = '', 
      condition = '', 
      minPrice = '', 
      maxPrice = '',
      sortBy = 'createdAt',
      sortOrder = 'DESC'
    } = req.query;

    // Build where clause
    const where = { isAvailable: true };

    // Search filter
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    // Category filter
    if (category) {
      where.category = category;
    }

    // Condition filter
    if (condition) {
      where.condition = condition;
    }

    // Price filters
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
    }

    // Sorting
    const validSortFields = ['createdAt', 'price', 'title', 'viewCount'];
    const orderField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const orderDirection = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const items = await Item.findAndCountAll({
      where,
      include: [{
        model: User,
        as: 'seller',
        attributes: ['id', 'firstName', 'lastName', 'email', 'role']
      }],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [[orderField, orderDirection]],
      distinct: true
    });

    res.json({
      success: true,
      data: {
        items: items.rows,
        pagination: {
          current: parseInt(page),
          total: Math.ceil(items.count / parseInt(limit)),
          count: items.count,
          limit: parseInt(limit)
        },
        filters: {
          search, category, condition, minPrice, maxPrice, sortBy, sortOrder
        }
      }
    });

  } catch (error) {
    console.error('Get items error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting items'
    });
  }
});

// @route   GET /api/items/:id
// @desc    Get single item by ID
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'seller',
        attributes: ['id', 'firstName', 'lastName', 'email', 'role', 'phone']
      }]
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Increment view count if not the owner
    if (!req.user || req.user.id !== item.userId) {
      await item.incrementViewCount();
    }

    res.json({
      success: true,
      data: {
        item
      }
    });

  } catch (error) {
    console.error('Get item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting item'
    });
  }
});

// @route   POST /api/items
// @desc    Create new item
// @access  Private
router.post('/', [
  auth,
  body('title')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  body('price')
    .isFloat({ min: 0, max: 99999.99 })
    .withMessage('Price must be between 0 and 99999.99'),
  body('category')
    .isIn(['electronics', 'books', 'clothing', 'furniture', 'sports', 'music', 'home-garden', 'automotive', 'other'])
    .withMessage('Invalid category'),
  body('condition')
    .isIn(['new', 'like-new', 'good', 'fair', 'poor'])
    .withMessage('Invalid condition'),
  body('images')
    .optional()
    .isArray()
    .withMessage('Images must be an array'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('contactMethod')
    .optional()
    .isIn(['email', 'phone', 'both'])
    .withMessage('Invalid contact method')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const {
      title,
      description,
      price,
      category,
      condition,
      images = [],
      tags = [],
      location,
      contactMethod = 'email'
    } = req.body;

    const item = await Item.create({
      title,
      description,
      price,
      category,
      condition,
      images,
      tags,
      location,
      contactMethod,
      userId: req.user.id
    });

    // Fetch the item with seller info
    const itemWithSeller = await Item.findByPk(item.id, {
      include: [{
        model: User,
        as: 'seller',
        attributes: ['id', 'firstName', 'lastName', 'email', 'role']
      }]
    });

    res.status(201).json({
      success: true,
      message: 'Item created successfully',
      data: {
        item: itemWithSeller
      }
    });

  } catch (error) {
    console.error('Create item error:', error);
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors.map(err => ({
          field: err.path,
          message: err.message
        }))
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error creating item'
    });
  }
});

// @route   PUT /api/items/:id
// @desc    Update item
// @access  Private (Owner only)
router.put('/:id', [
  auth,
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  body('price')
    .optional()
    .isFloat({ min: 0, max: 99999.99 })
    .withMessage('Price must be between 0 and 99999.99'),
  body('category')
    .optional()
    .isIn(['electronics', 'books', 'clothing', 'furniture', 'sports', 'music', 'home-garden', 'automotive', 'other'])
    .withMessage('Invalid category'),
  body('condition')
    .optional()
    .isIn(['new', 'like-new', 'good', 'fair', 'poor'])
    .withMessage('Invalid condition'),
  body('isAvailable')
    .optional()
    .isBoolean()
    .withMessage('isAvailable must be a boolean'),
  body('images')
    .optional()
    .isArray()
    .withMessage('Images must be an array'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const item = await Item.findByPk(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Check if user owns the item
    if (item.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this item'
      });
    }

    // Update item
    const updatedFields = {};
    const allowedFields = ['title', 'description', 'price', 'category', 'condition', 'images', 'tags', 'location', 'contactMethod', 'isAvailable'];
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updatedFields[field] = req.body[field];
      }
    });

    await item.update(updatedFields);

    // Fetch updated item with seller info
    const updatedItem = await Item.findByPk(item.id, {
      include: [{
        model: User,
        as: 'seller',
        attributes: ['id', 'firstName', 'lastName', 'email', 'role']
      }]
    });

    res.json({
      success: true,
      message: 'Item updated successfully',
      data: {
        item: updatedItem
      }
    });

  } catch (error) {
    console.error('Update item error:', error);
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors.map(err => ({
          field: err.path,
          message: err.message
        }))
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error updating item'
    });
  }
});

// @route   DELETE /api/items/:id
// @desc    Delete item
// @access  Private (Owner only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Check if user owns the item or is admin
    if (item.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this item'
      });
    }

    await item.destroy();

    res.json({
      success: true,
      message: 'Item deleted successfully'
    });

  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting item'
    });
  }
});

// @route   GET /api/items/user/:userId
// @desc    Get items by user ID
// @access  Public
router.get('/user/:userId', optionalAuth, async (req, res) => {
  try {
    const { page = 1, limit = 12 } = req.query;

    const where = { userId: req.params.userId };
    
    // Only show available items unless viewing own items
    if (!req.user || req.user.id !== parseInt(req.params.userId)) {
      where.isAvailable = true;
    }

    const items = await Item.findAndCountAll({
      where,
      include: [{
        model: User,
        as: 'seller',
        attributes: ['id', 'firstName', 'lastName', 'email', 'role']
      }],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        items: items.rows,
        pagination: {
          current: parseInt(page),
          total: Math.ceil(items.count / parseInt(limit)),
          count: items.count,
          limit: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get user items error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting user items'
    });
  }
});

module.exports = router;