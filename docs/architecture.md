# Unpack Architecture

## System Overview

Unpack is built with a serverless architecture, separating concerns between mobile client and cloud backend.

## Architecture Diagram

```
┌─────────────────────────────────────────┐
│         Mobile App (Flutter)            │
│  ┌──────────┐  ┌──────────┐           │
│  │  Camera  │  │   UI     │           │
│  └──────────┘  └──────────┘           │
└─────────────────────────────────────────┘
                  │
                  │ HTTPS/REST
                  ▼
┌─────────────────────────────────────────┐
│    Serverless Backend (AWS Lambda)     │
│  ┌──────────┐  ┌──────────┐           │
│  │   API    │  │   OCR    │           │
│  │ Gateway  │  │ Service  │           │
│  └──────────┘  └──────────┘           │
│  ┌──────────┐  ┌──────────┐           │
│  │   AI     │  │ Storage  │           │
│  │ Service  │  │  (S3)    │           │
│  └──────────┘  └──────────┘           │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│         External Services               │
│  Google Vision │ OpenAI │ Substack     │
└─────────────────────────────────────────┘
```

## Components

### Mobile App (Flutter)

- **State Management**: Riverpod
- **Local Storage**: Hive
- **HTTP Client**: Dio
- **Image Processing**: Camera, Image Picker

### Backend (Serverless)

- **Runtime**: Node.js 20.x
- **Framework**: Serverless Framework
- **Database**: DynamoDB
- **Storage**: S3
- **API Gateway**: AWS API Gateway

### External Services

- **OCR**: Google Cloud Vision API
- **AI**: OpenAI GPT-4 / GPT-3.5 Turbo
- **Content**: Substack API

## Data Flow

### Entry Creation Flow

1. User captures images in mobile app
2. Images uploaded to S3 via backend
3. Entry created in DynamoDB
4. OCR processing triggered
5. Google Vision API processes images
6. OCR results stored in entry
7. AI analysis triggered (if confidence > 70%)
8. GPT-4 analyzes entry
9. Results stored in entry
10. Entry returned to mobile app

### Chat Flow

1. User sends message
2. Message stored in DynamoDB
3. Chat history retrieved
4. GPT-4 generates response
5. Response stored in DynamoDB
6. Response returned to mobile app

## Security

- JWT-based authentication
- HTTPS/TLS for all communications
- S3 encryption at rest
- User data isolation
- Signed URLs for image access

## Scalability

- Serverless auto-scaling
- DynamoDB on-demand pricing
- S3 unlimited storage
- CDN for static assets (future)

## Cost Optimization

- Tiered AI usage (GPT-3.5 for simple queries)
- OCR result caching
- AI response caching
- Image compression before upload
- S3 lifecycle policies


