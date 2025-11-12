#!/usr/bin/env bash
set -euo pipefail

# Simple start script used by Railway when automatic detection fails.
# It installs deps, runs migrations and seeds, then starts the app.

## Note: we removed `npm ci` from runtime start script to avoid attempting
## to install dependencies at container startup. Install should happen at build time.

echo "[start.sh] Preflight debug: Node/npm versions and module checks"
node -v || echo "node not found"
npm -v || echo "npm not found"
echo "NODE_PATH=$NODE_PATH"
echo "Listing /app/greenmarket-backend/node_modules (if exists):"
ls -la /app/greenmarket-backend/node_modules || ls -la ./node_modules || echo "no node_modules directory found"
echo "Checking for dotenv via node require.resolve..."
node -e "try{console.log('dotenv resolved at', require.resolve('dotenv'))}catch(e){console.error('dotenv NOT found:', e.message); process.exit(0)}"

echo "[start.sh] Running migrations (if any)..."
# Run migrations and seeders if npx is available; don't fail the start if they error.
if command -v npx >/dev/null 2>&1; then
  npx sequelize-cli db:migrate || true
  echo "[start.sh] Running seeders (if any)..."
  npx sequelize-cli db:seed:all || true
fi

echo "[start.sh] Starting application..."
exec npm start
