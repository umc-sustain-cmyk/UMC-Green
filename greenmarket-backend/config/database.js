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
  console.log('📋 Database config:');
  console.log('  - Host:', process.env.DB_HOST || 'localhost');
  console.log('  - Port:', process.env.DB_PORT || 3306);
  console.log('  - Database:', process.env.DB_NAME || 'greenmarket');
  console.log('  - User:', process.env.DB_USER || 'root');
  
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
        acquire: 60000, // Increased from 30000 to 60000ms
        idle: 30000,
        evict: 15000
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