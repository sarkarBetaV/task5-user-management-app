#!/bin/bash

echo "🚀 Starting build process on Render..."
echo "📊 Node version: $(node -v)"
echo "📦 NPM version: $(npm -v)"
echo "📁 Current directory: $(pwd)"
echo "🌐 Environment: $NODE_ENV"

# Install dependencies
echo "📥 Installing dependencies..."
npm install

# Create public directory if it doesn't exist
mkdir -p public

echo "✅ Build completed successfully"
echo "🎯 Starting application..."