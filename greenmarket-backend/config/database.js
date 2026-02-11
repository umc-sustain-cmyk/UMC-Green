const { Sequelize } = require('sequelize');

// Database factory: default to SQLite in-memory for test runs for speed and isolation,
// but allow overriding to MySQL in CI by setting TEST_DB=mysql.
const useMysqlForTest = process.env.NODE_ENV === 'test' && process.env.TEST_DB === 'mysql';
const useSqliteInMemory = process.env.NODE_ENV === 'test' && !useMysqlForTest;

if (useSqliteInMemory) {
  const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true
    }
  });

  module.exports = sequelize;

} else {
  // Create Sequelize instance with MySQL connection for dev/prod and CI MySQL job
  const sequelize = new Sequelize(
    process.env.DB_NAME || 'greenmarket',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      dialect: 'mysql',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 30000, // Increased from 10000 to 30000ms to avoid premature disconnections
        evict: 15000 // Evict idle connections after 15 seconds
      },
      define: {
        timestamps: true,
        underscored: true,
        freezeTableName: true
      }
    }
  );

  module.exports = sequelize;
}