# Unpack API Documentation

## Base URL
- Development: `http://localhost:3000`
- Production: `https://api.unpack.app`

## Authentication

All endpoints (except auth endpoints) require a Bearer token in the Authorization header:

```
Authorization: Bearer <access_token>
```

## Endpoints

### Authentication

#### Sign Up
```
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Entries

#### Create Entry
```
POST /api/entries
Authorization: Bearer <token>
Content-Type: application/json

{
  "images": ["image-url-1", "image-url-2"]
}
```

#### List Entries
```
GET /api/entries
Authorization: Bearer <token>
```

#### Get Entry
```
GET /api/entries/{id}
Authorization: Bearer <token>
```

#### Process OCR
```
POST /api/entries/{id}/ocr
Authorization: Bearer <token>
```

### Chat

#### Send Chat Message
```
POST /api/entries/{id}/chat
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "What insights can you share about this entry?"
}
```

#### Get Chat History
```
GET /api/entries/{id}/chat
Authorization: Bearer <token>
```

### Recommendations

#### Get Recommendations
```
GET /api/recommendations
Authorization: Bearer <token>
```

## Response Formats

### Success Response
```json
{
  "id": "entry-id",
  "userId": "user-id",
  "createdAt": "2024-01-01T00:00:00Z",
  "images": ["url1", "url2"],
  "ocrText": "Extracted text...",
  "ocrConfidence": 0.85,
  "sentiment": {
    "label": "positive",
    "score": 0.8
  },
  "emotions": ["happy", "grateful"],
  "summary": "Entry summary...",
  "keySentences": ["Key insight 1", "Key insight 2"]
}
```

### Error Response
```json
{
  "error": "Error message"
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error



