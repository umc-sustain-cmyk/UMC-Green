#!/usr/bin/env node

const dotenv = require('dotenv');
const { Sequelize } = require('sequelize');

console.log('🔍 DATABASE DIAGNOSTIC TOOL\n');

// Load environment variables
console.log('1️⃣  Loading environment variables...');
dotenv.config();
console.log('✅ Loaded .env file\n');

// Show all database-related env vars
console.log('2️⃣  Environment Variables:');
console.log('  DATABASE_URL:', process.env.DATABASE_URL ? '***SET***' : '(not set)');
console.log('  DB_HOST:', process.env.DB_HOST || '(not set - will default to localhost)');
console.log('  DB_PORT:', process.env.DB_PORT || '(not set - will default to 3306)');
console.log('  DB_NAME:', process.env.DB_NAME || '(not set - will default to greenmarket)');
console.log('  DB_USER:', process.env.DB_USER || '(not set - will default to root)');
console.log('  DB_PASSWORD:', process.env.DB_PASSWORD ? '***SET***' : '(not set)');
console.log('  NODE_ENV:', process.env.NODE_ENV || '(not set)\n');

// Parse connection info
let dbHost, dbPort, dbName, dbUser, dbPassword;

if (process.env.DATABASE_URL) {
  console.log('3️⃣  Parsing DATABASE_URL...');
  try {
    const url = new URL(process.env.DATABASE_URL);
    dbUser = url.username;
    dbPassword = url.password;
    dbHost = url.hostname;
    dbPort = url.port || 3306;
    dbName = url.pathname.slice(1);
    console.log('✅ Successfully parsed DATABASE_URL\n');
  } catch (err) {
    console.error('❌ Failed to parse DATABASE_URL:', err.message);
    console.log('Using individual environment variables instead\n');
    dbHost = process.env.DB_HOST || 'localhost';
    dbPort = process.env.DB_PORT || 3306;
    dbName = process.env.DB_NAME || 'greenmarket';
    dbUser = process.env.DB_USER || 'root';
    dbPassword = process.env.DB_PASSWORD || '';
  }
} else {
  console.log('3️⃣  Using individual environment variables...');
  dbHost = process.env.DB_HOST || 'localhost';
  dbPort = process.env.DB_PORT || 3306;
  dbName = process.env.DB_NAME || 'greenmarket';
  dbUser = process.env.DB_USER || 'root';
  dbPassword = process.env.DB_PASSWORD || '';
  console.log('✅ Loaded from individual env vars\n');
}

// Show resolved connection info
console.log('4️⃣  Resolved Connection Info:');
console.log('  Host:', dbHost);
console.log('  Port:', dbPort);
console.log('  Database:', dbName);
console.log('  User:', dbUser);
console.log('  Password:', dbPassword ? '***SET***' : '(empty)');
console.log('  Connection String:', `mysql://${dbUser}:***@${dbHost}:${dbPort}/${dbName}\n`);

// Test network connectivity
console.log('5️⃣  Testing network connectivity...');
const net = require('net');
const socket = net.createConnection({
  host: dbHost,
  port: parseInt(dbPort),
  timeout: 5000
});

socket.on('connect', () => {
  console.log('✅ Network connection successful!\n');
  socket.end();
  
  // Try Sequelize connection
  testSequelizeConnection();
});

socket.on('error', (err) => {
  console.error('❌ Network connection failed:', err.message);
  console.error('   This likely means:');
  console.error('   - Database host is unreachable (wrong IP/domain)');
  console.error('   - Database port is wrong (default 3306)');
  console.error('   - Database service is not running\n');
  process.exit(1);
});

socket.on('timeout', () => {
  console.error('❌ Network connection timed out (5 seconds)\n');
  process.exit(1);
});

async function testSequelizeConnection() {
  console.log('6️⃣  Testing Sequelize connection...');
  
  const sequelize = new Sequelize(
    dbName,
    dbUser,
    dbPassword,
    {
      host: dbHost,
      port: parseInt(dbPort),
      dialect: 'mysql',
      logging: console.log, // Show SQL queries for debugging
      connectionLimit: 1
    }
  );

  try {
    await sequelize.authenticate();
    console.log('✅ Sequelize authentication successful!\n');
    console.log('7️⃣  Database Details:');
    
    try {
      const result = await sequelize.query("SELECT VERSION()");
      console.log('  MySQL Version:', result[0][0]['VERSION()']);
    } catch (e) {
      console.log('  (could not get MySQL version)');
    }
    
    try {
      const databases = await sequelize.query("SHOW DATABASES");
      const dbList = databases[0].map(db => Object.values(db)[0]).join(', ');
      console.log('  Available Databases:', dbList);
    } catch (e) {
      console.log('  (could not list databases)');
    }
    
    console.log('\n🎉 ALL TESTS PASSED! Database connection is working correctly.\n');
    await sequelize.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ Sequelize authentication failed:', err.message);
    console.error('Full error:', err);
    console.error('\n   This likely means:');
    console.error('   - Database credentials are wrong (user/password)');
    console.error('   - Database user does not have permission');
    console.error('   - Database does not exist\n');
    
    // Try to provide more details
    if (err.message.includes('Access denied')) {
      console.error('   SPECIFIC: Authentication failed - check DB_USER and DB_PASSWORD\n');
    } else if (err.message.includes('unknown database')) {
      console.error('   SPECIFIC: Database does not exist - create it or check DB_NAME\n');
    }
    
    process.exit(1);
  }
}
