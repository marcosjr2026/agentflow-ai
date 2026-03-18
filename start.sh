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

echo "→ Killing any existing node server..."
ps aux | grep "node server/index" | grep -v grep | awk '{print $2}' | xargs kill -9 2>/dev/null || true
sleep 2

echo "→ Starting server on port 5000..."
PORT=5000 exec node server/index.js
