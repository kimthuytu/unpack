#!/bin/bash

# Script to fix iOS project files for Flutter
# Run this from the mobile directory

set -e

echo "🔧 Fixing iOS project files..."

# Step 1: Clean Flutter build cache
echo "📦 Cleaning Flutter build cache..."
flutter clean

# Step 2: Get Flutter dependencies
echo "📥 Getting Flutter dependencies..."
flutter pub get

# Step 3: Regenerate iOS platform files (if needed)
echo "🔄 Regenerating iOS platform files..."
flutter create --platforms=ios .

# Step 4: Install CocoaPods dependencies
echo "🍫 Installing CocoaPods dependencies..."
cd ios
pod install
cd ..

echo "✅ iOS project files fixed!"
echo ""
echo "You can now run: flutter run"

