# Unpack Setup Guide

## Prerequisites

- Flutter SDK 3.0+ ([Install Flutter](https://flutter.dev/docs/get-started/install))
- Node.js 20+ ([Install Node.js](https://nodejs.org/))
- AWS CLI configured ([Install AWS CLI](https://aws.amazon.com/cli/))
- Google Cloud account with Vision API enabled
- OpenAI API key

## Backend Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```env
# JWT Secret (use a strong random string in production)
JWT_SECRET=your-super-secret-jwt-key-change-this

# OpenAI API Key
OPENAI_API_KEY=sk-your-openai-api-key

# Google Cloud Configuration
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_KEY_FILE=./path/to/service-account-key.json

# AWS Configuration (optional if using AWS CLI)
AWS_REGION=us-east-1
```

### 3. Set Up Google Cloud Vision API

1. Create a Google Cloud project at https://console.cloud.google.com/
2. Enable the Vision API:
   - Go to "APIs & Services" → "Library"
   - Search for "Cloud Vision API"
   - Click "Enable"
3. Create a service account:
   - Go to "IAM & Admin" → "Service Accounts"
   - Click "Create Service Account"
   - Give it a name (e.g., "unpack-vision-api")
   - Click "Create and Continue"
   - Grant it the **"Editor"** role (or create a custom role with `cloudvision.images.annotate` permission)
   - Click "Done"
4. Create and download a service account key:
   - Click on the service account you just created
   - Go to the "Keys" tab
   - Click "Add Key" → "Create new key"
   - Choose "JSON" format
   - Download the JSON file and save it somewhere secure (e.g., `backend/google-cloud-key.json`)
5. Update `.env`:
   - Set `GOOGLE_CLOUD_PROJECT_ID` to your project ID (found in project settings)
   - Set `GOOGLE_CLOUD_KEY_FILE` to the path of the downloaded JSON file (e.g., `./google-cloud-key.json`)

### 4. Set Up AWS

1. Configure AWS CLI: `aws configure`
2. Ensure you have permissions for:
   - Lambda
   - API Gateway
   - DynamoDB
   - S3

### 5. Deploy Backend

```bash
# Development
npm run deploy:dev

# Production
npm run deploy:prod
```

### 6. Run Locally (for development)

```bash
npm run dev
```

This starts the serverless offline server at `http://localhost:3000`

## Mobile App Setup

### 1. Install Flutter Dependencies

```bash
cd mobile
flutter pub get
```

### 2. Configure iOS

1. Open `ios/Runner.xcworkspace` in Xcode
2. Update bundle identifier
3. Configure signing & capabilities
4. Ensure camera and photo library permissions are set in `Info.plist`

### 3. Update API Base URL

Edit `mobile/lib/core/config/app_config.dart` to point to your backend:

```dart
// For local development
apiBaseUrl = 'http://localhost:3000';

// For production
apiBaseUrl = 'https://api.unpack.app';
```

### 4. Run the App

```bash
# iOS Simulator
flutter run

# Specific device
flutter run -d <device-id>
```

## Testing

### Backend Tests

```bash
cd backend
npm test
```

### Mobile Tests

```bash
cd mobile
flutter test
```

## Troubleshooting

### Backend Issues

- **Lambda timeout**: Increase timeout in `serverless.yml`
- **DynamoDB errors**: Check IAM permissions
- **OCR errors**: Verify Google Cloud credentials
- **AI errors**: Check OpenAI API key and quota

### Mobile Issues

- **Camera not working**: Check iOS permissions in `Info.plist`
- **API errors**: Verify backend URL in `app_config.dart`
- **Build errors**: Run `flutter clean` and `flutter pub get`

## Next Steps

1. Set up CI/CD pipeline
2. Configure monitoring and logging
3. Set up error tracking (Sentry)
4. Prepare for App Store submission


