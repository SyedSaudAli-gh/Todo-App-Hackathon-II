#!/bin/bash

echo "🚀 Preparing for deployment..."

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
echo "📤 Pushing to GitHub..."
git push origin main

echo "✅ Code pushed to GitHub!"
echo ""
echo "🔧 Next steps:"
echo "1. Go to Vercel Dashboard and import your GitHub repo"
echo "2. Set root directory to 'web'"
echo "3. Add environment variables from web/.env.production"
echo "4. Update OAuth redirect URLs in Google/Facebook consoles"
echo "5. Deploy and test!"
echo ""
echo "📋 Environment variables to add in Vercel:"
echo "   - DATABASE_URL"
echo "   - BETTER_AUTH_SECRET" 
echo "   - BETTER_AUTH_URL"
echo "   - NEXT_PUBLIC_APP_URL"
echo "   - GOOGLE_CLIENT_ID"
echo "   - GOOGLE_CLIENT_SECRET"
echo "   - FACEBOOK_APP_ID"
echo "   - FACEBOOK_APP_SECRET"
echo "   - NEXT_PUBLIC_GOOGLE_ENABLED=true"
echo "   - NEXT_PUBLIC_FACEBOOK_ENABLED=true"
echo ""
echo "🧪 After deployment, test with:"
echo "   node web/test-auth-production.js"