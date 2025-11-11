"use strict";
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    const email = process.env.ADMIN_EMAIL || 'admin@crk.umn.edu';
    const password = process.env.ADMIN_PASSWORD || 'AdminPass123!';

    // Check if user already exists
    const [results] = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE email = ${queryInterface.sequelize.escape(email)} LIMIT 1;`
    );

    if (results && results.length > 0) {
      console.log('Admin user already exists, skipping seeder.');
      return;
    }

    const salt = await bcrypt.genSalt(12);
    const hashed = await bcrypt.hash(password, salt);

    await queryInterface.bulkInsert('users', [{
      first_name: 'Admin',
      last_name: 'User',
      email: email,
      password: hashed,
      phone: null,
      student_id: null,
      role: 'admin',
      is_active: true,
      last_login: null,
      profile_image: null,
      created_at: new Date(),
      updated_at: new Date()
    }], {});
  },

  async down(queryInterface, Sequelize) {
    const email = process.env.ADMIN_EMAIL || 'admin@crk.umn.edu';
    await queryInterface.bulkDelete('users', { email }, {});
  }
};
