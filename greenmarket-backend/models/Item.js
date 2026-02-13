const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Item = sequelize.define('Item', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [3, 200]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [10, 2000]
    }
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0,
      max: 99999.99
    }
  },
  category: {
    type: DataTypes.ENUM(
      'electronics',
      'books',
      'clothing',
      'furniture',
      'sports',
      'music',
      'home-garden',
      'automotive',
      'other'
    ),
    allowNull: false
  },
  condition: {
    type: DataTypes.ENUM('new', 'like-new', 'good', 'fair', 'poor'),
    allowNull: false
  },
  images: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  isAvailable: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  tags: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  location: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  contactMethod: {
    type: DataTypes.ENUM('email', 'phone', 'both'),
    defaultValue: 'email'
  },
  viewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  }
}, {
  tableName: 'items',
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['category']
    },
    {
      fields: ['is_available']
    },
    {
      fields: ['price']
    }
  ]
});

// Define associations
User.hasMany(Item, { foreignKey: 'userId', as: 'donations' });
Item.belongsTo(User, { foreignKey: 'userId', as: 'donor' });

// ItemImage association - will be defined after ItemImage model is loaded
// Item.hasMany(ItemImage, { foreignKey: 'itemId', as: 'itemImages', onDelete: 'CASCADE' });
// ItemImage.belongsTo(Item, { foreignKey: 'itemId' });

// Instance methods
Item.prototype.incrementViewCount = async function() {
  this.viewCount += 1;
  await this.save({ silent: true });
};

module.exports = Item;