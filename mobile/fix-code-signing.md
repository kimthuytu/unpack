# Fixing Code Signing Issues

## Error: "PLA Update available" / "No Signing Certificates"

This error typically means:
1. Apple Developer Program License Agreement needs to be accepted
2. Xcode needs to be updated
3. You need to accept terms on developer.apple.com

## Solutions (try in order):

### Solution 1: Accept Apple Developer Agreement Online
1. Go to https://developer.apple.com/account
2. Sign in with your Apple ID
3. Accept any pending agreements
4. Return to Xcode and try again

### Solution 2: Update Xcode
1. Open App Store
2. Search for "Xcode"
3. Click "Update" if available
4. After update, restart Xcode and try again

### Solution 3: Let Xcode Auto-Manage Signing (Easiest)
Instead of managing certificates manually:

1. Open `mobile/ios/Runner.xcworkspace` in Xcode
2. Select **Runner** project → **Runner** target
3. Go to **Signing & Capabilities** tab
4. Check **"Automatically manage signing"**
5. Select your **Team** (your Apple ID)
6. Xcode will automatically create certificates for you

### Solution 4: Use iOS Simulator (No Signing Needed)
For development, you can skip code signing entirely:

```bash
cd mobile
flutter run -d "iPhone 15 Pro"  # or any simulator
```

## Quick Test
After fixing, verify certificates:
- Xcode → Preferences → Accounts → Select your Apple ID → Manage Certificates
- You should see certificates appear automatically when you build

