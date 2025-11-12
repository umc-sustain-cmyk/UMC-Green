#!/usr/bin/env bash
set -euo pipefail

# Simple start script used by Railway when automatic detection fails.
# It installs deps, runs migrations and seeds, then starts the app.

echo "[start.sh] Installing dependencies..."
npm ci

# Run migrations if available; continue if it fails to avoid blocking in some CI setups
if command -v npx >/dev/null 2>&1; then
  echo "[start.sh] Running migrations (if any)..."
  npx sequelize-cli db:migrate || true
  echo "[start.sh] Running seeders (if any)..."
  npx sequelize-cli db:seed:all || true
fi

echo "[start.sh] Starting application..."
exec npm start
