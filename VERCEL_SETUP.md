# 🚀 HydroLink Vercel Deployment Guide

This guide will help you deploy the HydroLink frontend to Vercel with proper configuration.

## 📋 Prerequisites

1. **Vercel Account**: [Sign up at vercel.com](https://vercel.com)
2. **GitHub Repository**: Your HydroLink repo should be on GitHub
3. **Node.js 18+**: For local testing before deployment

## 🔧 Deployment Steps

### Step 1: Connect Repository to Vercel

1. **Login to Vercel Dashboard**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Sign in with your GitHub account

2. **Import Project**
   - Click "New Project"
   - Select your HydroLink repository
   - Choose the `client` directory as the root

3. **Configure Build Settings**
   ```
   Framework Preset: Vite
   Root Directory: client
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

### Step 2: Environment Variables Setup

In Vercel Dashboard → Settings → Environment Variables, add:

```env
# Production API Configuration
VITE_API_URL=https://your-backend-api.herokuapp.com
VITE_API_BASE_URL=/api

# Blockchain Configuration
VITE_BLOCKCHAIN_NETWORK=polygon
VITE_CHAIN_ID=80002

# Application Configuration
VITE_APP_NAME=HydroLink
VITE_APP_VERSION=1.0.0
VITE_APP_ENVIRONMENT=production

# Features
VITE_ENABLE_DEBUG=false
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_WALLET_CONNECT=true
```

### Step 3: Backend API Setup

For the backend API, you'll need to deploy it separately. Recommended options:

#### Option A: Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy from server directory
cd server
railway login
railway deploy
```

#### Option B: Heroku
```bash
# From server directory
heroku create hydrolink-api
heroku config:set NODE_ENV=production
git subtree push --prefix server heroku main
```

#### Option C: Render
1. Connect your GitHub repo to Render
2. Select the `server` directory
3. Set environment variables in Render dashboard

### Step 4: Update Environment Variables

Once your backend is deployed, update the Vercel environment variables:

```env
VITE_API_URL=https://your-deployed-backend-url.com
```

### Step 5: Custom Domain (Optional)

1. **Add Domain in Vercel**
   - Go to Project Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

2. **Update README.md**
   - Update the live demo link in README.md
   - Commit and push changes

## 🛠️ Build Configuration

The project is configured with:

### Vercel Configuration (`client/vercel.json`)
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Vite Configuration (`client/vite.config.js`)
- Optimized for production builds
- Proper code splitting
- Asset optimization
- Environment variable handling

## 🔍 Troubleshooting

### Common Issues and Solutions

#### 1. **Build Fails**
```bash
# Check dependencies
cd client
npm install
npm run build
```

#### 2. **API Calls Fail**
- Verify `VITE_API_URL` environment variable
- Check CORS settings in backend
- Ensure backend is deployed and accessible

#### 3. **Images Not Loading**
- Ensure images are in `client/public` or properly imported
- Check image paths in components

#### 4. **Routing Issues**
- Verify `vercel.json` rewrites configuration
- Check React Router setup

### Debug Commands

```bash
# Local build test
cd client
npm run build
npm run preview

# Check environment variables
console.log(import.meta.env)

# Verify API connectivity
curl https://your-api-url.com/api/health
```

## 📊 Performance Optimization

### Automatic Optimizations
- ✅ Code splitting by route
- ✅ Asset compression
- ✅ CDN distribution
- ✅ Image optimization
- ✅ Caching headers

### Manual Optimizations
- Lazy load components
- Optimize images before upload
- Use React.memo for expensive components
- Implement service worker (optional)

## 🔐 Security Configuration

The deployment includes:
- Security headers (X-Frame-Options, CSP)
- HTTPS enforcement
- Environment variable protection
- Asset integrity verification

## 📈 Monitoring & Analytics

### Vercel Analytics
- Enable in Project Settings
- Monitor performance metrics
- Track user interactions

### Custom Analytics
```javascript
// In your components
import { config } from '../config/env';

if (config.ENABLE_ANALYTICS) {
  // Your analytics code
}
```

## 🚀 Deployment Checklist

- [ ] Repository connected to Vercel
- [ ] Build configuration set correctly
- [ ] Environment variables configured
- [ ] Backend API deployed
- [ ] API URL updated in environment
- [ ] Test deployment functionality
- [ ] Custom domain configured (optional)
- [ ] Analytics enabled (optional)
- [ ] README.md updated with live demo link

## 🔄 Continuous Deployment

Vercel automatically deploys:
- **Production**: When you push to `main` branch
- **Preview**: For pull requests and other branches

### Branch Configuration
```
main branch → Production deployment
develop branch → Preview deployment
feature/* → Preview deployment
```

## 📞 Support

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Vite Deployment Guide**: [vitejs.dev/guide/build.html](https://vitejs.dev/guide/build.html)
- **React Router**: [reactrouter.com](https://reactrouter.com)

---

**🎉 Happy Deploying!**

Your HydroLink platform will be live and accessible to users worldwide once deployed to Vercel.
