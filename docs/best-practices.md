# Best Practices Guide for Unpack

## Table of Contents
1. [Git & Version Control](#git--version-control)
2. [Security](#security)
3. [Code Organization](#code-organization)
4. [Environment Variables](#environment-variables)
5. [API Design](#api-design)
6. [Error Handling](#error-handling)
7. [Testing](#testing)
8. [Documentation](#documentation)
9. [Deployment](#deployment)
10. [Code Review](#code-review)

---

## Git & Version Control

### Commit Messages
**Good:**
```
feat: add OCR processing for journal entries
fix: resolve authentication token expiration issue
docs: update API documentation for chat endpoints
refactor: simplify entry service error handling
```

**Bad:**
```
update
fix stuff
changes
```

**Format:** `<type>: <subject>`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- Subject: imperative mood, lowercase, no period

### Branch Strategy
```
main          # Production-ready code
develop       # Integration branch
feature/*     # New features (feature/ocr-processing)
bugfix/*      # Bug fixes (bugfix/auth-token-expiry)
hotfix/*      # Urgent production fixes
```

**Workflow:**
1. Create feature branch from `develop`
2. Make commits with clear messages
3. Push and create Pull Request
4. Review and merge to `develop`
5. Deploy `develop` to staging
6. Merge `develop` to `main` for production

### What NOT to Commit
- `.env` files (already in .gitignore ✓)
- API keys, tokens, passwords
- `node_modules/`, `dist/`, `.build/`
- IDE-specific files (`.vscode/`, `.idea/`)
- OS files (`.DS_Store`, `Thumbs.db`)
- Large binary files (use Git LFS if needed)

---

## Security

### 1. Environment Variables
**✅ DO:**
- Store all secrets in `.env` files
- Use different `.env` files for dev/staging/prod
- Never commit `.env` files
- Use strong, random secrets (like your JWT_SECRET)
- Rotate secrets regularly

**❌ DON'T:**
- Hardcode API keys in code
- Share `.env` files via email/Slack
- Use the same secrets across environments

### 2. API Keys & Tokens
**✅ DO:**
- Store in environment variables
- Use different keys for dev/prod
- Set expiration dates on tokens
- Use least-privilege scopes
- Rotate keys periodically

**❌ DON'T:**
- Commit keys to git
- Share keys in screenshots/docs
- Use production keys in development

### 3. Authentication
**✅ DO:**
- Use JWT with short expiration times
- Implement refresh tokens
- Hash passwords (bcrypt, argon2)
- Validate all user inputs
- Use HTTPS in production

**❌ DON'T:**
- Store plaintext passwords
- Trust client-side validation alone
- Expose sensitive data in error messages

### 4. Dependencies
**✅ DO:**
- Regularly update dependencies
- Use `npm audit` / `flutter pub audit`
- Pin exact versions in production
- Review dependency licenses
- Remove unused dependencies

**❌ DON'T:**
- Use `*` for versions in production
- Ignore security warnings
- Add dependencies without review

---

## Code Organization

### Backend Structure (Current ✓)
```
backend/
├── src/
│   ├── handlers/     # API endpoints (thin controllers)
│   ├── services/     # Business logic
│   ├── models/       # Data models
│   ├── utils/        # Utilities & helpers
│   └── config/       # Configuration
├── serverless.yml    # Infrastructure as code
└── package.json
```

**Principles:**
- **Separation of Concerns**: Handlers → Services → Models
- **Single Responsibility**: Each file has one purpose
- **DRY (Don't Repeat Yourself)**: Extract common logic

### Mobile App Structure (Current ✓)
```
mobile/lib/
├── core/             # Core functionality
│   ├── config/       # App configuration
│   ├── services/     # API services
│   ├── models/       # Data models
│   └── utils/        # Utilities
├── features/         # Feature modules
│   ├── entries/
│   ├── chat/
│   └── camera/
└── shared/           # Shared components
```

**Principles:**
- **Feature-based organization**: Group by feature, not type
- **Reusable components**: Put shared widgets in `shared/`
- **Clear dependencies**: Features depend on core, not each other

---

## Environment Variables

### Backend `.env` Structure
```env
# Environment
NODE_ENV=development
STAGE=dev

# Secrets (never commit)
JWT_SECRET=your-secret-here
OPENAI_API_KEY=sk-...
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_KEY_FILE=./google-cloud-key.json

# AWS (optional if using AWS CLI)
AWS_REGION=us-east-1
```

### Best Practices
1. **Use `.env.example`** (without secrets):
   ```env
   JWT_SECRET=your-secret-here
   OPENAI_API_KEY=your-openai-key
   GOOGLE_CLOUD_PROJECT_ID=your-project-id
   ```

2. **Different files per environment:**
   - `.env.development`
   - `.env.staging`
   - `.env.production`

3. **Validate on startup:**
   ```typescript
   const required = ['JWT_SECRET', 'OPENAI_API_KEY'];
   required.forEach(key => {
     if (!process.env[key]) {
       throw new Error(`Missing required env: ${key}`);
     }
   });
   ```

---

## API Design

### RESTful Principles
**✅ Good:**
```
GET    /api/entries           # List entries
POST   /api/entries           # Create entry
GET    /api/entries/{id}      # Get entry
PUT    /api/entries/{id}      # Update entry
DELETE /api/entries/{id}      # Delete entry
POST   /api/entries/{id}/ocr  # Sub-resource action
```

**❌ Bad:**
```
GET /getEntries
POST /createEntry
GET /entry?id=123
POST /deleteEntry
```

### Response Format
**✅ Consistent:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Entry created successfully"
}

// Error:
{
  "success": false,
  "error": "Validation failed",
  "details": { ... }
}
```

### Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

### Versioning
```
/api/v1/entries
/api/v2/entries
```

---

## Error Handling

### Backend (TypeScript)
**✅ Good:**
```typescript
try {
  const entry = await entryService.createEntry(data);
  return {
    statusCode: 201,
    body: JSON.stringify({ success: true, data: entry })
  };
} catch (error) {
  if (error instanceof ValidationError) {
    return {
      statusCode: 400,
      body: JSON.stringify({ 
        success: false, 
        error: error.message 
      })
    };
  }
  // Log unexpected errors
  console.error('Unexpected error:', error);
  return {
    statusCode: 500,
    body: JSON.stringify({ 
      success: false, 
      error: 'Internal server error' 
    })
  };
}
```

**❌ Bad:**
```typescript
try {
  // ...
} catch (error) {
  return { statusCode: 500, body: error.toString() };
}
```

### Mobile (Dart)
**✅ Good:**
```dart
try {
  final entries = await entryService.getEntries();
  return entries;
} on NetworkException catch (e) {
  throw Exception('Network error: ${e.message}');
} on ValidationException catch (e) {
  throw Exception('Invalid data: ${e.message}');
} catch (e) {
  throw Exception('Unexpected error: $e');
}
```

---

## Testing

### Backend Tests
```typescript
describe('EntryService', () => {
  it('should create entry with valid data', async () => {
    const entry = await service.createEntry(validData);
    expect(entry.id).toBeDefined();
    expect(entry.userId).toBe(userId);
  });

  it('should throw error for invalid data', async () => {
    await expect(
      service.createEntry(invalidData)
    ).rejects.toThrow(ValidationError);
  });
});
```

### Mobile Tests
```dart
test('should load entries successfully', () async {
  final service = EntryService(mockApiService);
  final entries = await service.getEntries();
  expect(entries.length, greaterThan(0));
});
```

### Test Coverage Goals
- **Unit tests**: 80%+ coverage
- **Integration tests**: Critical paths
- **E2E tests**: Key user flows

---

## Documentation

### Code Comments
**✅ Good:**
```typescript
/**
 * Processes OCR on an entry's images using Google Cloud Vision API
 * @param entryId - The ID of the entry to process
 * @returns OCR result with extracted text and confidence score
 * @throws ValidationError if entry not found
 */
async processOcr(entryId: string): Promise<OCRResult> {
  // Implementation
}
```

**❌ Bad:**
```typescript
// Process OCR
async processOcr(entryId: string) {
  // does stuff
}
```

### README Files
Each major component should have a README:
- Project root README (you have ✓)
- Backend README (you have ✓)
- Mobile README (you have ✓)
- Feature-specific READMEs for complex features

### API Documentation
- Keep `docs/api.md` updated
- Document request/response formats
- Include examples
- List error codes

---

## Deployment

### Environment Separation
```
Development  → Local (serverless offline)
Staging      → AWS dev stage
Production   → AWS prod stage
```

### Pre-Deployment Checklist
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Secrets rotated (if needed)
- [ ] Database migrations (if any)
- [ ] Documentation updated
- [ ] Code reviewed
- [ ] Backup created (for production)

### Deployment Process
1. **Test locally**: `npm run dev`
2. **Run tests**: `npm test`
3. **Deploy to staging**: `npm run deploy:dev`
4. **Test staging**: Verify endpoints work
5. **Deploy to production**: `npm run deploy:prod`
6. **Monitor**: Check logs and metrics

### Rollback Plan
- Keep previous version tagged
- Know how to rollback quickly
- Have database backup strategy

---

## Code Review

### What to Review
- **Functionality**: Does it work as intended?
- **Security**: Any vulnerabilities?
- **Performance**: Any bottlenecks?
- **Code quality**: Readable, maintainable?
- **Tests**: Adequate coverage?
- **Documentation**: Updated?

### Review Comments
**✅ Constructive:**
```
"Consider extracting this logic into a separate function for reusability"
"Should we add error handling for this edge case?"
"This looks good! One suggestion: ..."
```

**❌ Not helpful:**
```
"Wrong"
"Fix this"
"Bad code"
```

### PR Best Practices
- **Small PRs**: Easier to review
- **Clear description**: What and why
- **Screenshots**: For UI changes
- **Tests**: Include test results
- **Checklist**: Use PR template

---

## Performance

### Backend
- **Caching**: Cache expensive operations
- **Pagination**: Don't return all data at once
- **Database indexes**: On frequently queried fields
- **Connection pooling**: Reuse database connections
- **Async operations**: Don't block the event loop

### Mobile
- **Image optimization**: Compress before upload
- **Lazy loading**: Load data as needed
- **Caching**: Cache API responses
- **Background processing**: Don't block UI thread

---

## Monitoring & Logging

### What to Log
- **Errors**: Always log with context
- **Important events**: User actions, API calls
- **Performance**: Slow queries, timeouts
- **Security**: Failed auth attempts

### What NOT to Log
- **Passwords**: Never log passwords
- **API keys**: Never log API keys
- **PII**: Be careful with personal data
- **Excessive detail**: Don't log everything

### Log Levels
```
ERROR   - Something failed
WARN    - Something unexpected but handled
INFO    - Important events
DEBUG   - Detailed debugging info
```

---

## Quick Reference Checklist

### Before Committing
- [ ] Code follows project style
- [ ] No console.logs left in
- [ ] No commented-out code
- [ ] Tests pass
- [ ] No secrets in code
- [ ] Meaningful commit message

### Before Pushing
- [ ] All changes committed
- [ ] Pull latest changes
- [ ] Resolve conflicts
- [ ] Tests still pass

### Before Deploying
- [ ] Code reviewed
- [ ] Tests passing
- [ ] Environment variables set
- [ ] Documentation updated
- [ ] Backup plan ready

---

## Resources

- [Git Best Practices](https://www.atlassian.com/git/tutorials/comparing-workflows)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Flutter Best Practices](https://docs.flutter.dev/development/best-practices)
- [API Design Guide](https://restfulapi.net/)
- [OWASP Security](https://owasp.org/www-project-top-ten/)

---

**Remember**: Best practices evolve. Stay updated, learn from mistakes, and adapt to your team's needs!


