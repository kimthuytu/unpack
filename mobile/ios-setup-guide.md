# iOS Setup Guide

## Quick Fix: Run on Simulator (No Code Signing Required)

The easiest way to test your app during development is to use the iOS Simulator, which doesn't require code signing:

```bash
cd mobile

# List available devices/simulators
flutter devices

# Run on iOS Simulator
flutter run -d "iPhone 15 Pro"  # or any available simulator
```

## Option 2: Set Up Code Signing for Physical Device

If you want to run on a physical iOS device, you need to set up code signing:

### Steps:

1. **Open the project in Xcode:**
   ```bash
   cd mobile/ios
   open Runner.xcworkspace
   ```
   ⚠️ **Important:** Open `Runner.xcworkspace`, NOT `Runner.xcodeproj`

2. **Configure Signing:**
   - In Xcode, select the **Runner** project in the left navigator
   - Select the **Runner** target
   - Go to **Signing & Capabilities** tab
   - Check **"Automatically manage signing"**
   - Select your **Team** (your Apple ID)
   - Xcode will automatically create certificates and provisioning profiles

3. **Update Bundle Identifier (if needed):**
   - The current bundle ID is `com.example.unpack`
   - You may want to change it to something unique like `com.yourname.unpack`
   - This is in the **General** tab of the Runner target

4. **Trust the Certificate on Your Device:**
   - After first build, go to your iPhone: **Settings > General > Device Management**
   - Trust your developer certificate

5. **Run the app:**
   ```bash
   flutter run
   ```

## Troubleshooting

- **"No development certificates available"**: Use simulator or set up code signing in Xcode
- **"Bundle identifier already exists"**: Change the bundle ID in Xcode to something unique
- **"Device not registered"**: Connect your device and let Xcode register it automatically

