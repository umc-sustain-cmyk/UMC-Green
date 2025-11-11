"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // If 'items' already exists (for example created earlier by sync), skip create
    const [tables] = await queryInterface.sequelize.query("SHOW TABLES LIKE 'items'");
    if (tables.length === 0) {
      await queryInterface.createTable('items', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      title: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      price: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: false,
        defaultValue: 0.00
      },
      category: {
        type: Sequelize.ENUM(
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
        type: Sequelize.ENUM('new', 'like-new', 'good', 'fair', 'poor'),
        allowNull: false
      },
      images: {
        type: Sequelize.JSON,
        allowNull: true
      },
      is_available: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      is_featured: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      tags: {
        type: Sequelize.JSON,
        allowNull: true
      },
      location: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      contact_method: {
        type: Sequelize.ENUM('email', 'phone', 'both'),
        allowNull: false,
        defaultValue: 'email'
      },
      view_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      user_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
      });
    }

    // Add indexes matching model expectations; use unique index names and ignore duplicates
    const safeAddIndex = async (table, fields, name) => {
      try {
        await queryInterface.addIndex(table, fields, { name });
      } catch (err) {
        // If index already exists or duplicate key, ignore
        // MySQL error code for duplicate key name is ER_DUP_KEYNAME (errno 1022)
        // but we'll ignore all errors here to keep migrations idempotent against existing schema
        console.warn(`Skipping index ${name}:`, err.message || err);
      }
    };

    await safeAddIndex('items', ['user_id'], 'idx_items_user_id');
    await safeAddIndex('items', ['category'], 'idx_items_category');
    await safeAddIndex('items', ['is_available'], 'idx_items_is_available');
    await safeAddIndex('items', ['price'], 'idx_items_price');
  },

  async down(queryInterface, Sequelize) {
    // Drop enum types on Postgres/MySQL will be handled by dropping the table
    await queryInterface.dropTable('items');
  }
};
