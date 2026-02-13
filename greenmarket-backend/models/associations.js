// Model associations setup
// This file should be required after all models are loaded

module.exports = function setupAssociations() {
  const Item = require('./Item');
  const ItemImage = require('./ItemImage');

  // Item - ItemImage relationships (User-Item already defined in Item.js)
  Item.hasMany(ItemImage, { 
    foreignKey: 'itemId', 
    as: 'itemImages',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });
  ItemImage.belongsTo(Item, { foreignKey: 'itemId' });

  console.log('✅ Model associations configured');
};
