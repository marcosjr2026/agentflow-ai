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
npx drizzle-kit push --config=drizzle.config.js || echo "DB push warning (continuing)"

echo "→ Starting server..."
PORT=5000 node server/index.js
