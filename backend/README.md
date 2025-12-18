# Unpack Backend

Serverless backend for the Unpack journaling app.

## Tech Stack

- **Runtime**: Node.js 20.x
- **Framework**: Serverless Framework
- **Database**: AWS DynamoDB
- **Storage**: AWS S3
- **OCR**: Google Cloud Vision API
- **AI**: OpenAI GPT-4

## Project Structure

```
backend/
├── src/
│   ├── handlers/      # Lambda handlers
│   ├── services/      # Business logic
│   ├── models/        # Data models
│   ├── utils/         # Utilities
│   └── config/        # Configuration
├── serverless.yml     # Serverless config
└── package.json
```

## Development

### Install Dependencies

```bash
npm install
```

### Run Locally

```bash
npm run dev
```

Starts serverless offline at `http://localhost:3000`

### Build

```bash
npm run build
```

### Deploy

```bash
# Development
npm run deploy:dev

# Production
npm run deploy:prod
```

## Environment Variables

See `.env.example` for required environment variables.

Required:
- `JWT_SECRET` - Secret key for JWT tokens
- `OPENAI_API_KEY` - OpenAI API key
- `GOOGLE_CLOUD_PROJECT_ID` - Google Cloud project ID
- `GOOGLE_CLOUD_KEY_FILE` - Path to Google Cloud service account key

## API Endpoints

See `/docs/api.md` for full API documentation.

## Testing

```bash
npm test
```

## Architecture

- Serverless functions for each endpoint
- DynamoDB for data storage
- S3 for image storage
- External APIs for OCR and AI


