# Unpack

> From chaos to clarity — Transform your handwritten journal entries into meaningful conversations.

Unpack is a journaling app that bridges the gap between pen-to-paper expression and meaningful self-reflection. Scan your handwritten brain dumps, and AI organizes scattered thoughts into labeled **Tangents** with associated emotions that you can explore through dialogue.

## Features

- **Scan Journal Entries** — Capture photos of your handwritten pages
- **AI-Powered OCR** — Extract text from your handwriting using OpenAI Vision
- **Tangent Discovery** — AI identifies distinct threads of thought and emotions
- **Reflective Chat** — Have a dialogue with AI to unpack each tangent
- **Privacy First** — Choose between cloud storage or local-only mode

## Tech Stack

- **Mobile**: React Native + Expo
- **Backend**: Supabase (Auth, Database, Storage)
- **AI**: OpenAI GPT-4 + Vision API
- **Fonts**: Instrument Serif

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator / Android Emulator / Physical device
- Supabase account
- OpenAI API key

### 1. Install Dependencies

```bash
cd Unpack
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the contents of `supabase/schema.sql`
3. Go to Settings > API and copy your project URL and anon key

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EXPO_PUBLIC_OPENAI_API_KEY=sk-your-openai-key
```

### 4. Add Fonts

Download [Instrument Serif](https://fonts.google.com/specimen/Instrument+Serif) and place the files in:

```
assets/fonts/
  InstrumentSerif-Regular.ttf
  InstrumentSerif-Italic.ttf
```

### 5. Run the App

```bash
# Start Expo
npx expo start

# Or run directly on iOS Simulator
npx expo run:ios
```

## Project Structure

```
Unpack/
├── app/                    # Expo Router screens
│   ├── (auth)/            # Login, signup
│   ├── (tabs)/            # Home, settings
│   ├── new-entry/         # Capture flow
│   └── tangent/           # Chat screen
├── components/            # Reusable UI components
├── context/               # React contexts (auth)
├── lib/                   # API clients (supabase, openai)
├── assets/               # Fonts, images
└── supabase/             # Database schema
```

## Design Philosophy

Unpack uses reflective journaling techniques powered by:

- **Mental Models** — First Principles, Second-Order Thinking
- **Stoic Philosophy** — Focus on what you can control
- **Plutchik's Wheel of Emotions** — Identify and name feelings
- **ABC Model (CBT)** — Activating event → Beliefs → Consequences

The AI fluctuates between:
- **Wise Friend** — When emotions are intense (validate, empathize)
- **Thinking Partner** — When calmer (analyze, challenge with questions)

## License

Private — All rights reserved.

---

Built with ❤️ for journalers who want to turn chaos into clarity.
