'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // Check if the images column exists before dropping it
      const table = await queryInterface.describeTable('items', { transaction });
      
      if (table.images) {
        console.log('⚠️ Dropping old images JSON column from items table...');
        await queryInterface.removeColumn('items', 'images', { transaction });
        console.log('✅ Removed images column');
      } else {
        console.log('ℹ️ images column already removed');
      }
      
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     * Example:
     * await queryInterface.dropTable('users');
     */
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // Rollback: add the column back (though data will be lost)
      await queryInterface.addColumn(
        'items',
        'images',
        {
          type: Sequelize.JSON,
          defaultValue: '[]',
          comment: 'Array of image URLs (deprecated - use item_images table instead)'
        },
        { transaction }
      );
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
