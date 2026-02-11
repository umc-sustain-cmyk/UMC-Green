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
  // Railway provides DATABASE_URL, but we also support individual env vars
  
  let dbHost, dbPort, dbName, dbUser, dbPassword;
  
  // Try to parse DATABASE_URL first (Railway format)
  if (process.env.DATABASE_URL) {
    console.log('📋 Using DATABASE_URL environment variable');
    // DATABASE_URL format: mysql://user:password@host:port/database
    try {
      const url = new URL(process.env.DATABASE_URL);
      dbUser = url.username;
      dbPassword = url.password;
      dbHost = url.hostname;
      dbPort = url.port || 3306;
      dbName = url.pathname.slice(1); // Remove leading slash
    } catch (err) {
      console.error('❌ Failed to parse DATABASE_URL:', err.message);
      dbHost = process.env.DB_HOST || 'localhost';
      dbPort = process.env.DB_PORT || 3306;
      dbName = process.env.DB_NAME || 'greenmarket';
      dbUser = process.env.DB_USER || 'root';
      dbPassword = process.env.DB_PASSWORD || '';
    }
  } else {
    // Use individual environment variables
    console.log('📋 Using individual database environment variables');
    dbHost = process.env.DB_HOST || 'localhost';
    dbPort = process.env.DB_PORT || 3306;
    dbName = process.env.DB_NAME || 'greenmarket';
    dbUser = process.env.DB_USER || 'root';
    dbPassword = process.env.DB_PASSWORD || '';
  }
  
  console.log('📋 Connecting to database:');
  console.log('  - Host:', dbHost);
  console.log('  - Port:', dbPort);
  console.log('  - Database:', dbName);
  console.log('  - User:', dbUser);
  console.log('  - Password: ' + (dbPassword ? '***' : '(empty)'));
  
  const sequelize = new Sequelize(
    dbName,
    dbUser,
    dbPassword,
    {
      host: dbHost,
      port: parseInt(dbPort),
      dialect: 'mysql',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      pool: {
        max: 5,
        min: 0,
        acquire: 60000,
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