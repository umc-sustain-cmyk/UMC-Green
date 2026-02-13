// Model associations setup
// This file should be required after all models are loaded

module.exports = function setupAssociations() {
  const Item = require('./Item');
  const User = require('./User');
  const ItemImage = require('./ItemImage');

  // Item - User relationships
  User.hasMany(Item, { foreignKey: 'userId', as: 'donations' });
  Item.belongsTo(User, { foreignKey: 'userId', as: 'donor' });

  // Item - ItemImage relationships
  Item.hasMany(ItemImage, { 
    foreignKey: 'itemId', 
    as: 'itemImages',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });
  ItemImage.belongsTo(Item, { foreignKey: 'itemId' });

  console.log('✅ Model associations configured');
};
