#!/bin/bash
cd /home/runner/workspace

echo "→ Installing deps..."
npm install --prefer-offline 2>/dev/null || npm install

echo "→ Installing client deps..."
cd client && npm install --prefer-offline 2>/dev/null || npm install

echo "→ Building frontend..."
npm run build
cd ..

echo "→ Pushing DB schema..."
npx drizzle-kit push --config=drizzle.config.js 2>&1 | tail -3 || true

echo "→ Killing anything on port 5000..."
fuser -k 5000/tcp 2>/dev/null || true
sleep 1

echo "→ Starting server..."
PORT=5000 exec node server/index.js
