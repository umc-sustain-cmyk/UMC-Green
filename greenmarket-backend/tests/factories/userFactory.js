const { v4: uuidv4 } = require('uuid');

module.exports = {
  basicUser: (overrides = {}) => ({
    firstName: 'Factory',
    lastName: 'User',
    email: `user-${uuidv4().slice(0,8)}@crk.umn.edu`,
    password: 'password123',
    role: 'student',
    ...overrides
  })
};
