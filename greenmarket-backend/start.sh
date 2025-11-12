#!/usr/bin/env bash
set -euo pipefail

# Simple start script used by Railway when automatic detection fails.
# It installs deps, runs migrations and seeds, then starts the app.

## Note: we removed `npm ci` from runtime start script to avoid attempting
## to install dependencies at container startup. Install should happen at build time.

echo "[start.sh] Running migrations (if any)..."
# Run migrations and seeders if npx is available; don't fail the start if they error.
if command -v npx >/dev/null 2>&1; then
  npx sequelize-cli db:migrate || true
  echo "[start.sh] Running seeders (if any)..."
  npx sequelize-cli db:seed:all || true
fi

echo "[start.sh] Starting application..."
exec npm start
