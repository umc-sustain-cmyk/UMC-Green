const dotenv = require('dotenv');

// Load environment variables FIRST
console.log('🔧 Loading environment variables...');
dotenv.config();
console.log('✅ Environment variables loaded');

// Validate critical environment variables
const requiredEnvVars = ['JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0 && process.env.NODE_ENV === 'production') {
  console.error('🔴 CRITICAL: Missing required environment variables:', missingEnvVars.join(', '));
  console.error('Please set these in your Railway dashboard before deploying.');
  process.exit(1);
}

console.log('🔧 Loading Express and dependencies...');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
console.log('✅ Express and dependencies loaded');

console.log('🔧 Loading database configuration...');
const sequelize = require('./config/database');
console.log('✅ Database configuration loaded');

const app = express();
const PORT = process.env.PORT || 5000;
const frontendUrl = (process.env.FRONTEND_URL || '').replace(/\/$/, '');

// CORS configuration - must be FIRST before other middleware
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'https://umc-green.vercel.app',
      'https://umc-green-project-prd-app-01.oit.umn.edu',
      'http://localhost:5173',
      'http://localhost:3000'
    ];

    if (frontendUrl) {
      allowedOrigins.push(frontendUrl);
    }

    // Allow requests with no origin (like mobile apps or server requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Security middleware - apply AFTER CORS
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
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

console.log('🔧 Loading routes...');
try {
  // Note: ItemImage associations removed (images feature disabled)
  
  app.use('/api/auth', require('./routes/auth'));
  console.log('✅ Auth routes loaded');
  app.use('/api/users', require('./routes/users'));
  console.log('✅ User routes loaded');
  app.use('/api/items', require('./routes/items'));
  console.log('✅ Item routes loaded');
} catch (err) {
  console.error('❌ Failed to load routes:', err.message);
  process.exit(1);
}

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
    // Test database connection with retry logic
    let retries = 5;
    let connected = false;
    
    while (retries > 0 && !connected) {
      try {
        await sequelize.authenticate();
        console.log('✅ Database connection established successfully');
        connected = true;
      } catch (dbError) {
        retries--;
        if (retries > 0) {
          const waitTime = (6 - retries) * 2000; // 2s, 4s, 6s, 8s, 10s
          console.log(`⚠️ Database connection failed. Retrying in ${waitTime/1000}s... (${retries} attempts left)`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        } else {
          throw dbError;
        }
      }
    }
    
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
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV}`);
      console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL}`);
    });

    // Handle server errors
    server.on('error', (err) => {
      console.error('❌ Server error:', err);
      process.exit(1);
    });
    
  } catch (error) {
    console.error('❌ Unable to start server:', error.message);
    console.error('Error details:', error);
    if (error.name === 'SequelizeConnectionError') {
      console.error('🔴 DATABASE CONNECTION ERROR - Check that:');
      console.error('  1. MySQL service is running on Railway');
      console.error('  2. DATABASE_URL or DB_HOST/DB_USER/DB_PASSWORD env vars are set');
      console.error('  3. Database credentials are correct');
    }
    process.exit(1);
  }
};

// Global error handlers (should be near the end, before startServer call)
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Only start the server when not running tests. Tests will import `app` directly.
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