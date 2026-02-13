'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Clear all existing donations and images
     */
    const transaction = await queryInterface.sequelize.transaction();
    
    try {
      console.log('🗑️  Clearing item_images table...');
      await queryInterface.sequelize.query(
        'DELETE FROM item_images;',
        { transaction }
      );
      console.log('✅ Cleared item_images');

      console.log('🗑️  Clearing items table...');
      await queryInterface.sequelize.query(
        'DELETE FROM items;',
        { transaction }
      );
      console.log('✅ Cleared items');

      // Reset auto-increment counters
      await queryInterface.sequelize.query(
        'ALTER TABLE items AUTO_INCREMENT = 1;',
        { transaction }
      );
      await queryInterface.sequelize.query(
        'ALTER TABLE item_images AUTO_INCREMENT = 1;',
        { transaction }
      );
      console.log('✅ Reset auto-increment counters');

      await transaction.commit();
      console.log('✅ All donations and images cleared successfully');
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * We don't restore data on rollback since this is a destructive operation
     */
    console.log('⚠️  This migration cannot be rolled back (data was deleted)');
  }
};
