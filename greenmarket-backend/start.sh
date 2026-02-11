#!/usr/bin/env bash
set -euo pipefail

# Simple start script used by Railway when automatic detection fails.
# It installs deps, runs migrations and seeds, then starts the app.

## Note: we removed `npm ci` from runtime start script to avoid attempting
## to install dependencies at container startup. Install should happen at build time.

echo "[start.sh] Preflight debug: Node/npm versions and module checks"
node -v || echo "node not found"
npm -v || echo "npm not found"
echo "NODE_PATH=${NODE_PATH:-<not-set>}"
echo "Listing /app/greenmarket-backend/node_modules (if exists):"
ls -la /app/greenmarket-backend/node_modules || ls -la ./node_modules || echo "no node_modules directory found"
echo "Checking for dotenv via node require.resolve..."
node -e "try{console.log('dotenv resolved at', require.resolve('dotenv'))}catch(e){console.error('dotenv NOT found:', e.message); process.exit(0)}"
# Runtime fallback: install production deps if node_modules missing.
echo "[start.sh] Ensuring dependencies are installed (runtime fallback)"
if [ ! -d "node_modules" ]; then
  echo "[start.sh] node_modules missing — running 'npm ci --omit=dev' (this may take a moment)"
  npm ci --omit=dev || echo "[start.sh] npm ci failed; continuing to migrations (may still fail when starting)"
else
  echo "[start.sh] node_modules already present — skipping runtime install"
fi

# Wait for database to be available (use DB_HOST/DB_PORT or MYSQL_HOST/MYSQL_PORT), retry a few times.
DB_HOST=${DB_HOST:-${MYSQL_HOST:-127.0.0.1}}
DB_PORT=${DB_PORT:-${MYSQL_PORT:-3306}}
MAX_RETRIES=${DB_WAIT_RETRIES:-60}
RETRY_DELAY=${DB_WAIT_DELAY:-1}

echo "[start.sh] Waiting for database at $DB_HOST:$DB_PORT (up to $MAX_RETRIES attempts)..."
attempt=0
until node -e "const net=require('net'); const s=net.createConnection({host: '$DB_HOST', port: $DB_PORT}); s.on('connect', ()=>{console.log('db:open'); s.end(); process.exit(0)}); s.on('error', ()=>process.exit(1));"; do
  attempt=$((attempt+1))
  if [ "$attempt" -ge "$MAX_RETRIES" ]; then
    echo "[start.sh] Database still unavailable after $attempt attempts; continuing (database connection errors will be handled by server)."
    break
  fi
  echo "[start.sh] Database not ready yet — attempt $attempt/$MAX_RETRIES. Sleeping $RETRY_DELAY s..."
  sleep $RETRY_DELAY
done

echo "[start.sh] Running migrations (if any)..."
# In production, skip migrations/seeders since they should be run separately
if [ "$NODE_ENV" = "production" ]; then
  echo "[start.sh] Production mode - skipping migrations/seeders (should be applied before deployment)"
else
  # Run migrations and seeders if npx is available; don't fail the start if they error.
  if command -v npx >/dev/null 2>&1; then
    echo "[start.sh] Executing: npx sequelize-cli db:migrate"
    if npx sequelize-cli db:migrate; then
      echo "[start.sh] ✅ Migrations completed successfully"
    else
      echo "[start.sh] ⚠️  Migrations failed or returned non-zero exit code - continuing anyway"
    fi
    
    echo "[start.sh] Running seeders (if any)..."
    echo "[start.sh] Executing: npx sequelize-cli db:seed:all"
    if npx sequelize-cli db:seed:all; then
      echo "[start.sh] ✅ Seeders completed successfully"
    else
      echo "[start.sh] ⚠️  Seeders failed or returned non-zero exit code - continuing anyway"
    fi
  else
    echo "[start.sh] ⚠️  npx not found - skipping migrations and seeders"
  fi
fi

# Validate environment before starting
echo "[start.sh] Validating environment variables..."
if [ -z "$DB_HOST" ]; then
  echo "[start.sh] ⚠️  WARNING: DB_HOST not set"
fi
if [ -z "$JWT_SECRET" ]; then
  echo "[start.sh] 🔴 ERROR: JWT_SECRET is not set! Login will fail."
fi

echo "[start.sh] Starting application..."
exec npm start
