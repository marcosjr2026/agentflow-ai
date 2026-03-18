#!/bin/bash
set -e
cd /home/runner/workspace

echo "→ Installing server deps..."
npm install

echo "→ Installing client deps..."
cd client && npm install

echo "→ Building frontend..."
npm run build
cd ..

echo "→ Pushing DB schema..."
npx drizzle-kit push --config=drizzle.config.js 2>&1 | tail -5 || echo "DB push warning"

echo "→ Starting server on port 5000..."
# Kill anything on port 5000 first
fuser -k 5000/tcp 2>/dev/null || true
sleep 1

exec node server/index.js
