'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Get admin user
    const [adminUsers] = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE role = 'admin' LIMIT 1;`
    );

    if (!adminUsers || adminUsers.length === 0) {
      console.log('No admin user found, skipping item seeder.');
      return;
    }

    const adminId = adminUsers[0].id;

    // Test items (without images - will be added separately)
    const testItems = [
      {
        user_id: adminId,
        title: 'Organic Coffee Beans',
        description: 'Fresh roasted organic coffee beans. Perfect for morning brew. 1 lb bag.',
        price: 8.99,
        category: 'home-garden',
        condition: 'new',
        is_available: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_id: adminId,
        title: 'Plant Starter Kit',
        description: 'Complete kit with seeds, soil, and pots to start your indoor garden.',
        price: 15.00,
        category: 'home-garden',
        condition: 'new',
        is_available: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_id: adminId,
        title: 'Recycled Notebook Set',
        description: 'Set of 3 beautiful notebooks made from recycled materials. Perfect for students.',
        price: 12.00,
        category: 'books',
        condition: 'new',
        is_available: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_id: adminId,
        title: 'Reusable Water Bottle',
        description: 'Stainless steel reusable water bottle, keeps drinks cold for 24 hours.',
        price: 22.00,
        category: 'other',
        condition: 'new',
        is_available: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    // Check if test items already exist
    const [existingItems] = await queryInterface.sequelize.query(
      `SELECT COUNT(*) as count FROM items WHERE title IN ('Organic Coffee Beans', 'Plant Starter Kit', 'Recycled Notebook Set', 'Reusable Water Bottle');`
    );

    if (existingItems[0].count > 0) {
      console.log('Test items already exist, skipping seeder.');
      return;
    }

    // Insert items
    await queryInterface.bulkInsert('items', testItems, {});

    // Get the inserted items to add their images
    const [insertedItems] = await queryInterface.sequelize.query(
      `SELECT id, title FROM items WHERE title IN ('Organic Coffee Beans', 'Plant Starter Kit', 'Recycled Notebook Set', 'Reusable Water Bottle') ORDER BY created_at DESC LIMIT 4;`
    );

    // Define images for each item
    const itemImages = {
      'Organic Coffee Beans': [
        'https://images.unsplash.com/photo-1559056199-641a0ac8b3f7?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1559056199-641a0ac8b3f7?w=400&h=400&fit=crop&crop=faces'
      ],
      'Plant Starter Kit': [
        'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1469022563149-aa64dbd37dae?w=400&h=400&fit=crop'
      ],
      'Recycled Notebook Set': [
        'https://images.unsplash.com/photo-1507842217343-583f20270319?w=400&h=400&fit=crop'
      ],
      'Reusable Water Bottle': [
        'https://images.unsplash.com/photo-1602143407151-7e406142f799?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1523391223703-7651a04a2e71?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1570531987306-4a6e9b74f09d?w=400&h=400&fit=crop'
      ]
    };

    // Insert images for each item
    const imageRecords = [];
    for (const item of insertedItems) {
      const urls = itemImages[item.title] || [];
      urls.forEach((url, index) => {
        imageRecords.push({
          item_id: item.id,
          url: url,
          display_order: index,
          created_at: new Date(),
          updated_at: new Date()
        });
      });
    }

    if (imageRecords.length > 0) {
      await queryInterface.bulkInsert('item_images', imageRecords, {});
      console.log(`✅ Seeded ${imageRecords.length} item images`);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('items', {
      title: ['Organic Coffee Beans', 'Plant Starter Kit', 'Recycled Notebook Set', 'Reusable Water Bottle']
    }, {});
  }
};
