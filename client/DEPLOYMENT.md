# 🚀 Deployment Guide - Vercel

This guide will help you deploy the HydroLink frontend to Vercel.

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Push your code to GitHub
3. **Environment Variables**: Configure for production

## 🔧 Deployment Steps

### 1. Prepare Your Repository

```bash
# Navigate to client directory
cd client

# Build and test locally
npm run build
npm run preview

# Commit your changes
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### 2. Connect to Vercel

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"New Project"**
3. Import your GitHub repository
4. Select the **`client`** folder as the root directory

### 3. Configure Project Settings

**Framework Preset:** Vite
**Root Directory:** `client`
**Build Command:** `npm run build`
**Output Directory:** `dist`
**Install Command:** `npm install`

### 4. Environment Variables

Add these environment variables in Vercel dashboard:

```env
VITE_APP_NAME=HydroLink
VITE_APP_VERSION=1.0.0
VITE_API_URL=https://your-backend-api.com
VITE_ENABLE_ANALYTICS=true
```

### 5. Deploy

Click **"Deploy"** and wait for the build to complete.

## 🌐 Custom Domain (Optional)

1. Go to your project settings
2. Navigate to **Domains**
3. Add your custom domain
4. Configure DNS records as instructed

## 📊 Performance Optimization

The deployment includes:

- ✅ **Static Asset Caching**: 1 year cache for assets
- ✅ **Gzip Compression**: Automatic compression
- ✅ **SPA Routing**: Proper redirects for React Router
- ✅ **Fast Builds**: Optimized Vite configuration
- ✅ **CDN Distribution**: Global edge network

## 🔍 Post-Deployment Checklist

- [ ] Test all page routes work correctly
- [ ] Verify responsive design on mobile/tablet
- [ ] Check browser console for any errors
- [ ] Test navigation between pages
- [ ] Validate forms and interactions

## 🛠️ Troubleshooting

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Routing Issues
- Ensure `vercel.json` has proper rewrites
- Check that all routes are defined in App.jsx

### Environment Variables
- Make sure all `VITE_` prefixed variables are set
- Check Vercel dashboard environment section

## 📈 Monitoring

### Analytics Setup
1. Add Google Analytics ID to environment variables
2. Monitor performance with Vercel Analytics
3. Set up error tracking with Sentry (optional)

### Performance Monitoring
- Use Vercel's built-in analytics
- Monitor Core Web Vitals
- Check bundle size and loading times

## 🔄 Continuous Deployment

Vercel automatically deploys when you:
1. Push to the main branch
2. Merge pull requests
3. Use Vercel CLI for manual deployments

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from command line
vercel --prod
```

## 🌍 Preview Deployments

Every pull request gets a preview URL:
- Test features before merging
- Share with team for review
- Automatic cleanup after merge

---

Your HydroLink frontend is now ready for production! 🎉
