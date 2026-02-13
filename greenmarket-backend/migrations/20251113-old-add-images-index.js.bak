'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Add a helper column 'has_images' as a boolean to help with sorting
      // This avoids sorting by the large JSON column
      await queryInterface.sequelize.query(
        `ALTER TABLE items ADD COLUMN has_images BOOLEAN DEFAULT FALSE, ADD INDEX idx_items_has_images (has_images)`
      );
      
      // Update existing items
      await queryInterface.sequelize.query(
        `UPDATE items SET has_images = (images IS NOT NULL AND JSON_LENGTH(images) > 0)`
      );
      
      console.log('✅ has_images column and index created successfully');
    } catch (error) {
      if (error.message.includes('Duplicate column') || error.message.includes('already exists')) {
        console.log('ℹ️ Column/index already exists');
      } else {
        console.error('Warning creating helper column:', error.message);
        // Don't fail, just warn
      }
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      await queryInterface.sequelize.query(
        `ALTER TABLE items DROP COLUMN has_images`
      );
      console.log('✅ has_images column removed');
    } catch (error) {
      console.log('ℹ️ Column not found, skipping removal');
    }
  }
};
