'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Create the item_images table
    await queryInterface.createTable('item_images', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      item_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'items',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      url: {
        type: Sequelize.STRING(500),
        allowNull: false
      },
      display_order: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // Create indexes
    await queryInterface.addIndex('item_images', ['item_id']);
    await queryInterface.addIndex('item_images', ['display_order']);

    // Migrate existing JSON images to the new table
    try {
      const sequelize = queryInterface.sequelize;
      
      // Get all items with images
      const [items] = await sequelize.query(
        `SELECT id, images FROM items WHERE images IS NOT NULL AND JSON_LENGTH(images) > 0`
      );

      // Insert images into the new table
      for (const item of items) {
        try {
          const images = JSON.parse(item.images);
          if (Array.isArray(images)) {
            for (let i = 0; i < images.length; i++) {
              const imageUrl = images[i];
              if (imageUrl && typeof imageUrl === 'string') {
                await sequelize.query(
                  `INSERT INTO item_images (item_id, url, display_order, created_at, updated_at) 
                   VALUES (${item.id}, '${sequelize.escape(imageUrl)}', ${i}, NOW(), NOW())`
                );
              }
            }
          }
        } catch (err) {
          console.log(`⚠️ Could not migrate images for item ${item.id}:`, err.message);
        }
      }

      console.log('✅ Images migrated to item_images table');
    } catch (err) {
      console.log('ℹ️ Image migration skipped (table may be empty)');
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('item_images');
  }
};
