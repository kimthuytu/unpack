# Quick Reference Guide

## Git Commands Cheat Sheet

### Daily Workflow
```bash
# Start working on a feature
git checkout develop
git pull origin develop
git checkout -b feature/my-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push and create PR
git push origin feature/my-feature
# Then create PR on GitHub

# After PR is merged, clean up
git checkout develop
git pull origin develop
git branch -d feature/my-feature
```

### Useful Commands
```bash
# See what changed
git status
git diff

# See commit history
git log --oneline -10
git log --graph --all

# Undo changes
git checkout -- file.txt          # Discard changes
git reset HEAD file.txt           # Unstage file
git reset --soft HEAD~1           # Undo last commit, keep changes

# Fix last commit message
git commit --amend

# Stash changes temporarily
git stash
git stash pop
```

## Environment Setup Checklist

### New Developer Setup
- [ ] Clone repository
- [ ] Install Node.js 20+
- [ ] Install Flutter SDK 3.0+
- [ ] Run `npm install` in backend
- [ ] Run `flutter pub get` in mobile
- [ ] Copy `.env.example` to `.env` (if exists)
- [ ] Configure environment variables
- [ ] Test backend: `npm run dev`
- [ ] Test mobile: `flutter run`

## Code Review Checklist

### For Reviewers
- [ ] Code works as intended
- [ ] No security issues
- [ ] Follows project conventions
- [ ] Tests included
- [ ] Documentation updated
- [ ] No secrets committed
- [ ] Performance acceptable

### For Authors
- [ ] Self-reviewed code
- [ ] Tests pass
- [ ] No console.logs
- [ ] Meaningful commit messages
- [ ] PR description clear

## Common Issues & Solutions

### Backend Issues

**Port 3000 already in use:**
```bash
lsof -ti:3000 | xargs kill -9
```

**Node modules issues:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**TypeScript errors:**
```bash
npm run build
```

### Mobile Issues

**Flutter build errors:**
```bash
flutter clean
flutter pub get
flutter run
```

**iOS build issues:**
```bash
cd ios
pod install
cd ..
flutter run
```

### Git Issues

**Accidentally committed .env:**
```bash
git rm --cached backend/.env
git commit -m "fix: remove .env from tracking"
```

**Need to update .gitignore:**
```bash
# Add to .gitignore, then:
git rm -r --cached .
git add .
git commit -m "fix: update .gitignore"
```

## Deployment Commands

### Backend
```bash
# Development
npm run deploy:dev

# Production
npm run deploy:prod

# Local testing
npm run dev
```

### Mobile
```bash
# iOS
flutter build ios

# Android
flutter build apk
flutter build appbundle
```

## Useful Scripts to Add

### Backend `package.json`
```json
{
  "scripts": {
    "dev": "serverless offline",
    "build": "tsc",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint src --ext .ts",
    "lint:fix": "eslint src --ext .ts --fix",
    "deploy:dev": "serverless deploy --stage dev",
    "deploy:prod": "serverless deploy --stage prod"
  }
}
```

## Security Reminders

- ✅ Never commit `.env` files
- ✅ Never commit API keys or tokens
- ✅ Use strong, random secrets
- ✅ Rotate secrets regularly
- ✅ Use HTTPS in production
- ✅ Validate all user inputs
- ✅ Keep dependencies updated

## Performance Tips

### Backend
- Use pagination for lists
- Cache expensive operations
- Optimize database queries
- Use connection pooling

### Mobile
- Compress images before upload
- Implement lazy loading
- Cache API responses
- Optimize image sizes

## Emergency Contacts

- **Git Issues**: Check `docs/best-practices.md`
- **Deployment Issues**: Check `SETUP.md`
- **API Issues**: Check `docs/api.md`


