const dotenv = require('dotenv');

// Load environment variables FIRST
dotenv.config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const sequelize = require('./config/database');

const app = express();
const PORT = 5000; // Use fixed port 5000

// Security middleware - apply FIRST before everything
app.use(helmet());

// CORS configuration - must be before routes
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/items', require('./routes/items'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'GreenMarket API is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Database connection and server startup
const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully');
    
    // Migration strategy:
    // - In production, we do NOT call `sync()` here. Migrations should be applied during deploy.
    // - In development you can opt-in to run migrations automatically by setting AUTO_MIGRATE=true
    // - For tests, migrations are handled by the test setup (sqlite in-memory or CI migrations)
    if (process.env.NODE_ENV === 'production') {
      console.log('ℹ️ Running in production mode – ensure migrations are applied before starting the app.');
    } else if (process.env.NODE_ENV === 'test') {
      console.log('ℹ️ Test environment detected – skipping runtime migrations/sync.');
    } else {
      if (process.env.AUTO_MIGRATE === 'true') {
        console.log('🔁 AUTO_MIGRATE=true — applying migrations before starting server');
        // Run migrations via sequelize-cli if available
        try {
          const { execSync } = require('child_process');
          execSync('npx sequelize-cli db:migrate', { stdio: 'inherit' });
        } catch (err) {
          console.warn('Failed to run automatic migrations:', err && err.message ? err.message : err);
        }
      } else {
        // For local dev when you want quick iteration, you can still use sync by setting AUTO_SYNC=true
        if (process.env.AUTO_SYNC === 'true') {
          await sequelize.sync({ alter: true });
          console.log('✅ Database models synchronized (sync)');
        } else {
          console.log('ℹ️ Skipping runtime sync. To automatically run migrations in dev set AUTO_MIGRATE=true or to sync set AUTO_SYNC=true');
        }
      }
    }
    
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV}`);
      console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL}`);
    });
    
  } catch (error) {
    console.error('❌ Unable to start server:', error);
    process.exit(1);
  }
};

// Only start the server when not running tests. Tests will import `app` directly.
if (process.env.NODE_ENV !== 'test') {
  startServer();
}

module.exports = app;