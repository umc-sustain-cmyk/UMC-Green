const dotenv = require('dotenv');

// Load environment variables early
console.log('🔧 Loading environment variables...');
dotenv.config();
console.log('✅ Environment variables loaded');

// Validate required env vars in production
const requiredEnv = ['JWT_SECRET'];
const missing = requiredEnv.filter(v => !process.env[v]);
if (missing.length > 0 && process.env.NODE_ENV === 'production') {
  console.error('🔴 CRITICAL: Missing required environment variables:', missing.join(', '));
  process.exit(1);
}

console.log('🔧 Loading dependencies...');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
console.log('✅ Dependencies loaded');

console.log('🔧 Loading database configuration...');
const sequelize = require('./config/database');
console.log('✅ Database configuration loaded');

const app = express();
const PORT = process.env.PORT || 5000;
const frontendUrl = (process.env.FRONTEND_URL || '').replace(/\/$/, '');

// CORS - whitelist frontend URL, fallback to reflect-origin for dev
const corsOptions = {
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Whitelist specific frontend URL(s)
    const allowedOrigins = [
      'https://umc-green.vercel.app',
      'http://localhost:5173',  // dev
      frontendUrl
    ].filter(Boolean);
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.warn(`⚠️ CORS blocked request from ${origin}`);
      return callback(null, true); // Still allow for debugging; change to false in strict mode
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Security headers
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// Rate limiting
// Bypass preflight requests to avoid blocking CORS handshake
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  skip: (req) => req.method === 'OPTIONS',
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Load routes
console.log('🔧 Loading routes...');
try {
  app.use('/api/auth', require('./routes/auth'));
  console.log('✅ Auth routes loaded');
  app.use('/api/users', require('./routes/users'));
  console.log('✅ User routes loaded');
  app.use('/api/items', require('./routes/items'));
  console.log('✅ Item routes loaded');
} catch (err) {
  console.error('❌ Failed to load routes:', err && err.message ? err.message : err);
  process.exit(1);
}

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'GreenMarket API is running', timestamp: new Date().toISOString() });
});

// 404
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'API endpoint not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err && err.stack ? err.stack : err);
  res.status(err && err.status ? err.status : 500).json({
    success: false,
    message: err && err.message ? err.message : 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err && err.stack ? err.stack : undefined })
  });
});

// Helper for waiting between retries
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

// Start server with DB connection and optional migration handling
const startServer = async () => {
  try {
    // Allow local development to skip DB connection entirely when set.
    if (process.env.SKIP_DB === 'true') {
      console.log('ℹ️ SKIP_DB=true — skipping database connection and starting server');
      const server = app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`📊 Environment: ${process.env.NODE_ENV}`);
        console.log(`🌐 Frontend URL: ${frontendUrl || process.env.FRONTEND_URL}`);
      });
      server.on('error', (err) => {
        console.error('❌ Server error:', err);
        process.exit(1);
      });
      return;
    }
    let retries = 5;
    let connected = false;
    while (retries > 0 && !connected) {
      try {
        await sequelize.authenticate();
        console.log('✅ Database connection established successfully');
        connected = true;
      } catch (dbErr) {
        retries--;
        if (retries > 0) {
          const waitTime = (6 - retries) * 2000;
          console.log(`⚠️ Database connection failed. Retrying in ${waitTime/1000}s... (${retries} attempts left)`);
          await wait(waitTime);
        } else {
          throw dbErr;
        }
      }
    }

    // Migration/sync policy
    if (process.env.NODE_ENV === 'production') {
      console.log('ℹ️ Production mode — ensure migrations are applied during deploy.');
    } else if (process.env.NODE_ENV === 'test') {
      console.log('ℹ️ Test environment detected — skipping runtime migrations/sync.');
    } else {
      if (process.env.AUTO_MIGRATE === 'true') {
        console.log('🔁 AUTO_MIGRATE=true — attempting to run migrations');
        try {
          const { execSync } = require('child_process');
          execSync('npx sequelize-cli db:migrate', { stdio: 'inherit' });
        } catch (mErr) {
          console.warn('Failed to run automatic migrations:', mErr && mErr.message ? mErr.message : mErr);
        }
      } else if (process.env.AUTO_SYNC === 'true') {
        await sequelize.sync({ alter: true });
        console.log('✅ Database models synchronized (sync)');
      } else {
        console.log('ℹ️ Skipping runtime migrations/sync. Set AUTO_MIGRATE or AUTO_SYNC to change this.');
      }
    }

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV}`);
      console.log(`🌐 Frontend URL: ${frontendUrl || process.env.FRONTEND_URL}`);
    });

    server.on('error', (err) => {
      console.error('❌ Server error:', err);
      process.exit(1);
    });

  } catch (error) {
    console.error('❌ Unable to start server:', error && error.message ? error.message : error);
    if (error && error.name === 'SequelizeConnectionError') {
      console.error('🔴 DATABASE CONNECTION ERROR - check DATABASE_URL / DB_* env vars and DB service');
    }
    process.exit(1);
  }
};

// Global process-level handlers
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start unless in test mode (tests import the app)
console.log('🔧 Checking if server should start (NODE_ENV=' + process.env.NODE_ENV + ')...');
if (process.env.NODE_ENV !== 'test') {
  console.log('🚀 Starting server...');
  startServer().catch(err => {
    console.error('❌ Fatal error in startServer:', err);
    process.exit(1);
  });
} else {
  console.log('ℹ️ Test mode detected - server not started');
}

module.exports = app;
