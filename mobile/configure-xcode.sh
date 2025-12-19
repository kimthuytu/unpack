#!/bin/bash

# Script to open Xcode and configure code signing
# This will open the project in Xcode where you can select your Development Team

echo "🔧 Opening Xcode to configure code signing..."
echo ""
echo "Once Xcode opens:"
echo "1. Select 'Runner' project in the left sidebar"
echo "2. Select 'Runner' target"
echo "3. Go to 'Signing & Capabilities' tab"
echo "4. Check 'Automatically manage signing'"
echo "5. Select your Team from the dropdown (your Apple ID)"
echo "6. Xcode will automatically create certificates"
echo ""
echo "Press Enter to open Xcode..."
read

cd "$(dirname "$0")/ios"
open Runner.xcworkspace

echo ""
echo "✅ Xcode should now be open. Follow the steps above to configure signing."

