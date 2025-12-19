# Unpack Mobile App

Flutter mobile application for Unpack journaling companion.

## Tech Stack

- **Framework**: Flutter 3.x
- **Language**: Dart
- **State Management**: Riverpod
- **Local Storage**: Hive
- **HTTP Client**: Dio

## Project Structure

```
mobile/lib/
├── core/
│   ├── config/        # App configuration
│   ├── constants/     # Constants
│   ├── models/        # Data models
│   ├── services/      # API services
│   └── utils/         # Utilities
├── features/
│   ├── camera/        # Camera capture
│   ├── ocr/           # OCR processing
│   ├── entries/       # Entry management
│   ├── chat/          # AI chat
│   └── recommendations/ # Content recommendations
└── shared/
    └── widgets/       # Shared widgets
```

## Setup

### Install Dependencies

```bash
flutter pub get
```

### Configure Backend URL

Edit `lib/core/config/app_config.dart`:

```dart
apiBaseUrl = 'http://localhost:3000'; // Development
// or
apiBaseUrl = 'https://api.unpack.app'; // Production
```

### Run

```bash
# iOS
flutter run

# Android
flutter run
```

## Building

### iOS

```bash
flutter build ios
```

### Android

```bash
flutter build apk
# or
flutter build appbundle
```

## Testing

```bash
flutter test
```

## Features

- 📸 Multi-page journal entry capture
- 🔍 OCR with handwriting recognition
- 💬 AI-powered conversational companion
- 😊 Emotional analysis
- 📚 Content recommendations



