#!/bin/bash
set -e
cd /home/runner/workspace
npm install
cd client
npm install
npm run build
cd ..
PORT=5000 node server/index.js
