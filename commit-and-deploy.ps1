#!/usr/bin/env powershell

Write-Host "🚀 Preparing for deployment..." -ForegroundColor Green

# Add all changes
git add .

# Commit with descriptive message
git commit -m "Fix authentication configuration for production deployment

- Fixed database URL encoding (% symbol issue)
- Renamed auth route from [...better-auth] to [...all] 
- Updated auth configuration for production
- Added OAuth provider enablement flags
- Created Vercel configuration file
- Fixed environment variable validation
- Added production environment template
- Created deployment and testing guides"

# Push to main branch
Write-Host "📤 Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host "✅ Code pushed to GitHub!" -ForegroundColor Green
Write-Host ""
Write-Host "🔧 Next steps:" -ForegroundColor Cyan
Write-Host "1. Go to Vercel Dashboard and import your GitHub repo"
Write-Host "2. Set root directory to 'web'"
Write-Host "3. Add environment variables from web/.env.production"
Write-Host "4. Update OAuth redirect URLs in Google/Facebook consoles"
Write-Host "5. Deploy and test!"
Write-Host ""
Write-Host "📋 Environment variables to add in Vercel:" -ForegroundColor Cyan
Write-Host "   - DATABASE_URL"
Write-Host "   - BETTER_AUTH_SECRET" 
Write-Host "   - BETTER_AUTH_URL"
Write-Host "   - NEXT_PUBLIC_APP_URL"
Write-Host "   - GOOGLE_CLIENT_ID"
Write-Host "   - GOOGLE_CLIENT_SECRET"
Write-Host "   - FACEBOOK_APP_ID"
Write-Host "   - FACEBOOK_APP_SECRET"
Write-Host "   - NEXT_PUBLIC_GOOGLE_ENABLED=true"
Write-Host "   - NEXT_PUBLIC_FACEBOOK_ENABLED=true"
Write-Host ""
Write-Host "🧪 After deployment, test with:" -ForegroundColor Cyan
Write-Host "   node web/test-auth-production.js"