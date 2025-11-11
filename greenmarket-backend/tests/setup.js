// Centralized Jest setup/teardown for integration tests
process.env.NODE_ENV = process.env.NODE_ENV || 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'testsecret';

const sequelize = require('../config/database');

beforeAll(async () => {
  // For fast local/CI runs we default to sqlite in-memory.
  // If TEST_DB=mysql is set (CI MySQL job), migrations will be run by the CI step
  // before tests run, so we skip force-sync in that case to avoid dropping prod data.
  if (process.env.TEST_DB === 'mysql') {
    // don't force sync against MySQL in CI; migrations are applied separately
    return;
  }

  // For sqlite (default test) just sync force to ensure a fresh DB per run
  await sequelize.authenticate();
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});
