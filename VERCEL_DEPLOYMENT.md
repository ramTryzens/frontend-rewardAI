# Vercel Deployment Guide

This project is configured for **one-click deployment** to Vercel with both frontend and backend API routes.

## Project Structure

```
gradient-cart-viewer/
├── api/                          # Vercel Serverless Functions
│   ├── health.js                 # GET /api/health
│   ├── carts/
│   │   └── [cartId].js          # GET /api/carts/:cartId
│   └── ecommerce-details/
│       ├── index.js             # GET /api/ecommerce-details
│       └── [id].js              # PATCH/DELETE /api/ecommerce-details/:id
├── config/                       # Shared MongoDB config
├── models/                       # Mongoose models
├── src/                          # React frontend
├── server.js                     # Local development server (Express)
└── vercel.json                   # Vercel configuration
```

## How It Works

### Local Development (Express Server)
```bash
npm run dev
```
- Runs Express server on `localhost:3001`
- Runs Vite dev server on `localhost:8080`
- Uses `server.js` for all backend logic

### Vercel Development (Serverless)
```bash
npm run dev:vercel
```
- Simulates Vercel's serverless environment locally
- API routes in `/api` folder become serverless functions
- Frontend served by Vite

### Production (Vercel)
- Frontend: Static build deployed to CDN
- Backend: Serverless functions in `/api` folder
- All routes automatically work at your Vercel domain

## Deployment Steps

### 1. Install Vercel CLI (Optional)
```bash
npm install -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Set Environment Variables

You can set environment variables either:

#### Option A: Using Vercel Dashboard
1. Go to your project on [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `MONGODB_URI` | `mongodb+srv://username:password@cluster.mongodb.net/database` | Production, Preview, Development |
| `BIGCOMMERCE_API_URL` | `https://api.bigcommerce.com/stores/{store_hash}/v3` | Production, Preview, Development |
| `BIGCOMMERCE_TOKEN` | `your_api_token` | Production, Preview, Development |

#### Option B: Using Vercel CLI
```bash
# Set environment variables via CLI
vercel env add MONGODB_URI
vercel env add BIGCOMMERCE_API_URL
vercel env add BIGCOMMERCE_TOKEN
```

### 4. Deploy to Vercel

#### Option A: Deploy via GitHub (Recommended)
1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/new)
3. Click **Import Project**
4. Select your GitHub repository
5. Vercel auto-detects Vite configuration
6. Click **Deploy**

#### Option B: Deploy via CLI
```bash
# Deploy to production
vercel --prod

# Deploy to preview (staging)
vercel
```

### 5. Verify Deployment

After deployment, test your API endpoints:

```bash
# Replace YOUR_DOMAIN with your Vercel domain
curl https://YOUR_DOMAIN.vercel.app/api/health
curl https://YOUR_DOMAIN.vercel.app/api/ecommerce-details
```

## API Endpoints (Production)

All endpoints work the same on Vercel as they do locally:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check + MongoDB status |
| `/api/ecommerce-details` | GET | Get all e-commerce configurations |
| `/api/ecommerce-details/:id` | PATCH | Update configuration by ID |
| `/api/ecommerce-details/:id` | DELETE | Delete configuration by ID |
| `/api/carts/:cartId` | GET | BigCommerce cart proxy |

## Key Differences: Local vs. Vercel

### Local Development (server.js)
- Uses Express.js with long-running server
- MongoDB connection persists across requests
- Routes defined in `/routes` folder
- Startup initialization runs once

### Vercel Production (Serverless)
- Each API request spawns a new serverless function
- MongoDB connection may be cold (reconnects each time)
- Routes defined in `/api` folder as separate files
- Initialization runs on every function invocation

## Database Initialization

The database initialization logic runs automatically:

### Local (server.js)
- Runs **once** when server starts
- Checks if `ecommerce_details` collection is empty
- Inserts default BigCommerce config if needed

### Vercel (serverless)
- Runs on **first API request** to `/api/ecommerce-details`
- Same logic: checks and inserts default config
- Cached connection prevents repeated initialization

## Troubleshooting

### MongoDB Connection Errors

**Problem:** `MONGODB_URI is not defined`
- **Solution:** Add environment variable in Vercel Dashboard

**Problem:** Connection timeout
- **Solution:** Whitelist Vercel IPs in MongoDB Atlas:
  1. Go to MongoDB Atlas → Network Access
  2. Add IP: `0.0.0.0/0` (allow all) or use Vercel's IP ranges

### API Routes Not Working

**Problem:** 404 on `/api/*` routes
- **Solution:** Ensure `vercel.json` exists and has correct rewrites

**Problem:** CORS errors from frontend
- **Solution:** API functions include CORS headers automatically

### Cold Start Delays

**Problem:** First request to API is slow (5-10 seconds)
- **Explanation:** Serverless cold start + MongoDB connection
- **Solution:** Consider upgrading to Vercel Pro for faster cold starts

## Environment Variables Checklist

Before deploying, ensure these are set in Vercel:

- [ ] `MONGODB_URI` - MongoDB Atlas connection string
- [ ] `BIGCOMMERCE_API_URL` - BigCommerce API base URL
- [ ] `BIGCOMMERCE_TOKEN` - BigCommerce API token

## Local Testing with Vercel Environment

To test exactly how it will work on Vercel:

```bash
# Install Vercel CLI
npm install -g vercel

# Link to your Vercel project
vercel link

# Pull environment variables from Vercel
vercel env pull

# Run local Vercel dev server
npm run dev:vercel
```

This will:
1. Download your production environment variables
2. Run serverless functions locally
3. Simulate Vercel's production environment

## Security Notes

### What's Protected
- `.env` files are never deployed (listed in `.gitignore`)
- Backend code in `/api` is serverless functions (not accessible as files)
- Environment variables are encrypted in Vercel

### What to Check
- Ensure `MONGODB_URI` includes username/password (stored securely)
- Set MongoDB Network Access to allow Vercel IPs only
- Don't commit `.env` file to git

## Performance Tips

### Optimize Cold Starts
1. **Keep functions small** - Each file in `/api` is a separate function
2. **Use MongoDB connection pooling** - Already configured in `config/database.js`
3. **Cache static assets** - Vite build automatically optimizes

### Reduce API Latency
1. **Choose nearest Vercel region** - Set in `vercel.json` (default: `iad1`)
2. **Optimize MongoDB queries** - Use indexes (already configured)
3. **Enable Vercel Edge Caching** - For GET endpoints

## Continuous Deployment

Once connected to GitHub, every push triggers:
- **Production deployment** on `main` branch
- **Preview deployment** on feature branches

To disable auto-deployment:
1. Go to Vercel Dashboard → Project Settings
2. Git → Disable auto-deploy for specific branches

## Monitoring

### View Logs
```bash
# Real-time logs
vercel logs YOUR_DOMAIN.vercel.app

# Or view in dashboard
# https://vercel.com/dashboard → Your Project → Logs
```

### Check Function Performance
- Go to Vercel Dashboard → Your Project → **Analytics**
- View response times, error rates, and invocation counts

## Cost Estimation

### Vercel Free Tier (Hobby)
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ 100 hours serverless function execution
- ✅ Automatic SSL

### MongoDB Atlas Free Tier (M0)
- ✅ 512MB storage
- ✅ Shared RAM
- ✅ Sufficient for small projects

**Total Cost: $0/month** for small projects

## Next Steps

1. Deploy to Vercel using GitHub integration
2. Add environment variables in Vercel Dashboard
3. Test all API endpoints on your Vercel domain
4. Set up custom domain (optional)
5. Configure MongoDB Network Access whitelist

## Support

- **Vercel Docs:** https://vercel.com/docs
- **Vercel CLI:** https://vercel.com/docs/cli
- **Vite + Vercel:** https://vercel.com/docs/frameworks/vite
