# Security Documentation

## File Access Protection

### Problem
By default, Vite dev server can serve ANY file in your project directory, including:
- `server.js` (backend source code)
- `.env` (environment variables with secrets)
- `config/`, `models/`, `routes/` (backend logic)
- `package.json` (dependency information)

### Solution Implemented

#### 1. Vite File System Restrictions (`vite.config.ts`)

```typescript
fs: {
  // Only allow these directories to be served
  allow: [
    "./src",           // Frontend source code
    "./public",        // Public assets
    "./node_modules"   // Dependencies (needed for imports)
  ],

  // Explicitly deny sensitive files
  deny: [
    "**/.env*",        // All environment files
    "**/server.js",    // Express server
    "**/config/**",    // MongoDB config
    "**/models/**",    // Mongoose models
    "**/routes/**",    // Express routes
    "**/api/**",       // Vercel serverless functions
    "**/*.md",         // Documentation
    "**/package.json", // Package info
    "**/vercel.json"   // Vercel config
  ],

  strict: true         // Don't follow symlinks outside allowed dirs
}
```

#### 2. Asset Inclusion Whitelist

Only specific asset types are served:
```typescript
assetsInclude: [
  "**/*.png", "**/*.jpg", "**/*.jpeg",
  "**/*.gif", "**/*.svg", "**/*.webp"
]
```

This prevents serving arbitrary files as assets.

### Testing Protection

Test if backend files are accessible:

```bash
# Should return 403 Forbidden (Good ✅)
curl -I http://localhost:8080/server.js

# Should return 403 Forbidden (Good ✅)
curl -I http://localhost:8080/.env

# Should return 403 Forbidden (Good ✅)
curl -I http://localhost:8080/config/database.js

# Should work (Frontend assets ✅)
curl -I http://localhost:8080/
```

### What's Protected

| File/Directory | Protected | Method |
|---------------|-----------|--------|
| `.env`, `.env.*` | ✅ Yes | Vite deny list + .gitignore |
| `server.js` | ✅ Yes | Vite deny list |
| `config/` | ✅ Yes | Vite deny list + not in allow list |
| `models/` | ✅ Yes | Vite deny list + not in allow list |
| `routes/` | ✅ Yes | Vite deny list + not in allow list |
| `api/` | ✅ Yes | Vite deny list + not in allow list |
| `package.json` | ✅ Yes | Vite deny list |
| `vercel.json` | ✅ Yes | Vite deny list |
| `*.md` files | ✅ Yes | Vite deny list |
| `src/` | ❌ No | Intentionally public (frontend code) |
| `public/` | ❌ No | Intentionally public (static assets) |

## Production Security (Vercel)

### What Happens on Vercel

1. **Frontend Build**
   - Only `dist/` folder is served (compiled frontend)
   - Original source code (`src/`) is NOT accessible
   - No backend files are deployed to CDN

2. **Backend (Serverless Functions)**
   - Files in `api/` become serverless functions
   - Source code is NOT directly accessible
   - Only HTTP endpoints work (e.g., `/api/health`)

3. **Environment Variables**
   - Stored encrypted in Vercel
   - Never exposed to frontend
   - Only accessible to serverless functions

### File Structure on Vercel

```
Vercel Deployment:
├── dist/                    # Frontend (CDN) - PUBLIC
│   ├── index.html
│   ├── assets/
│   └── ...
└── api/                     # Serverless Functions - PRIVATE
    ├── health.js           → /api/health
    ├── ecommerce-details/
    │   ├── index.js       → /api/ecommerce-details
    │   └── [id].js        → /api/ecommerce-details/:id
    └── carts/
        └── [cartId].js    → /api/carts/:cartId

NOT DEPLOYED:
❌ server.js
❌ config/
❌ models/
❌ routes/
❌ .env
❌ src/ (original source)
```

### Testing Production Security

After deploying to Vercel:

```bash
# These should return 404 (Good ✅)
curl https://your-app.vercel.app/server.js
curl https://your-app.vercel.app/.env
curl https://your-app.vercel.app/config/database.js

# These should work (API endpoints ✅)
curl https://your-app.vercel.app/api/health
curl https://your-app.vercel.app/api/ecommerce-details

# Frontend should work (✅)
curl https://your-app.vercel.app/
```

## Environment Variables Security

### Local Development

**File:** `.env` (NEVER commit this!)

```bash
# .gitignore already includes:
*.env*
```

**Protections:**
- ✅ Ignored by git (`.gitignore`)
- ✅ Blocked by Vite dev server (`fs.deny`)
- ✅ Not accessible via HTTP

### Production (Vercel)

**Storage:** Encrypted in Vercel Dashboard

**Access:**
- ✅ Only serverless functions can read them
- ❌ Frontend CANNOT access them
- ❌ Not included in client-side bundles

**Setting Variables:**
```bash
# Via Vercel Dashboard
Settings → Environment Variables

# Or via CLI
vercel env add MONGODB_URI
```

## MongoDB Security

### Connection String

**Format:**
```
mongodb+srv://username:password@cluster.mongodb.net/database
```

**Protections:**
- ✅ Stored in `.env` (not committed)
- ✅ Encrypted in Vercel (production)
- ✅ Only backend can access it

### Network Access (MongoDB Atlas)

**Recommended Settings:**
1. Go to MongoDB Atlas → Network Access
2. **Option A (Most Secure):** Whitelist only Vercel IPs
3. **Option B (Development):** Allow all (`0.0.0.0/0`)

**Vercel IP Ranges:**
- Check: https://vercel.com/docs/concepts/edge-network/regions

## API Security Best Practices

### CORS Configuration

All API functions include CORS headers:

```javascript
res.setHeader('Access-Control-Allow-Origin', '*');
```

**For Production:** Replace `*` with your actual domain:
```javascript
res.setHeader('Access-Control-Allow-Origin', 'https://your-app.vercel.app');
```

### Input Validation

All API endpoints validate:
- ✅ MongoDB ObjectId format
- ✅ HTTP method restrictions
- ✅ Request body structure
- ✅ Allowed fields for updates

### Error Handling

Errors NEVER expose:
- ❌ Database connection strings
- ❌ Internal file paths
- ❌ Stack traces (in production)

## Security Checklist

### Before Committing Code

- [ ] `.env` is in `.gitignore`
- [ ] No hardcoded secrets in code
- [ ] No `console.log()` with sensitive data
- [ ] All API routes validate input

### Before Deploying to Vercel

- [ ] Environment variables set in Vercel Dashboard
- [ ] MongoDB Network Access configured
- [ ] CORS origins restricted (if needed)
- [ ] Test all API endpoints work

### After Deployment

- [ ] Test backend files are NOT accessible
- [ ] Test API endpoints work correctly
- [ ] Verify MongoDB connection works
- [ ] Check Vercel function logs for errors

## Common Security Issues

### ❌ Problem: `.env` committed to git
**Solution:**
```bash
# Remove from git history
git rm --cached .env
git commit -m "Remove .env"
git push
```
Then rotate all secrets (MongoDB password, API tokens).

### ❌ Problem: API secrets exposed in frontend
**Solution:**
- Never use `VITE_` prefix for secrets
- Only use `process.env` in backend (`/api` folder)
- Frontend should call backend APIs, not external APIs directly

### ❌ Problem: Backend source code accessible
**Solution:**
- Already fixed with Vite `fs.deny` configuration
- Test with `curl http://localhost:8080/server.js`

## Reporting Security Issues

If you find a security vulnerability:
1. **DO NOT** open a public GitHub issue
2. Email the maintainer directly
3. Include steps to reproduce
4. Wait for a fix before disclosing publicly

## Additional Resources

- [Vercel Security](https://vercel.com/docs/security)
- [MongoDB Security Checklist](https://www.mongodb.com/docs/manual/administration/security-checklist/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Vite Security](https://vitejs.dev/guide/api-plugin.html#virtual-modules-convention)
