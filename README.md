# Unpack

AI-powered journaling companion app that complements physical journaling by providing intelligent reflection, emotional analysis, and personalized insights.

## Overview

Unpack transforms journaling from a monologue into a dialogue. Capture handwritten journal entries, get AI-powered insights, and continue the conversation beyond the last sentence.

## Architecture

- **Mobile App**: Flutter (iOS, Android-ready)
- **Backend**: Serverless (AWS Lambda/Vercel)
- **Database**: AWS DynamoDB
- **Storage**: AWS S3
- **OCR**: Google Cloud Vision API
- **AI**: OpenAI GPT-4
- **Content**: Substack API

## Project Structure

```
unpack/
├── mobile/          # Flutter mobile app
├── backend/         # Serverless backend
├── shared/          # Shared types
└── docs/            # Documentation
```

## Getting Started

### Prerequisites

- Flutter SDK 3.0+
- Node.js 20+
- AWS CLI configured (for backend)
- Google Cloud account (for OCR)
- OpenAI API key (for AI features)

### Mobile App Setup

```bash
cd mobile
flutter pub get
flutter run
```

### Backend Setup

```bash
cd backend
npm install
npm run build
```

### Environment Variables

Create `.env` files in the backend directory:

```env
JWT_SECRET=your-secret-key
OPENAI_API_KEY=your-openai-key
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_KEY_FILE=path-to-key-file.json
AWS_REGION=us-east-1
```

### Deployment

#### Backend
```bash
cd backend
npm run deploy:dev    # Deploy to dev
npm run deploy:prod   # Deploy to production
```

#### Mobile App
- iOS: Build via Xcode or `flutter build ios`
- Android: `flutter build apk` or `flutter build appbundle`

## Features

### MVP Features
- 📸 Multi-page journal entry capture
- 🔍 OCR with handwriting recognition
- 💬 AI-powered conversational companion
- 😊 Emotional analysis and sentiment detection
- 📚 Content recommendations based on journal themes

### Post-MVP Features
- End-to-end encryption
- Biometric authentication
- Offline mode
- Advanced analytics
- Android version
- Web version

## Development

### Running Locally

**Backend:**
```bash
cd backend
npm run dev  # Starts serverless offline
```

**Mobile:**
```bash
cd mobile
flutter run
```

## Testing

```bash
# Backend tests
cd backend
npm test

# Mobile tests
cd mobile
flutter test
```

## License

Proprietary - All rights reserved



