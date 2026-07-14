# Task Manager - Deployment Guide

## Current Status
- **Backend**: Deployed on Vercel at `https://taskmanager-api-liart.vercel.app`
- **Frontend**: Running locally on `http://localhost:3000`

## What Was Fixed
✅ **CORS Configuration Updated**: Backend now allows:
  - `http://localhost:3000` (local development)
  - `http://localhost:5000` (local development alternative)
  - `https://task-manager-client-blush.vercel.app` (production)
  - Dynamic `FRONTEND_URL` from environment variables

✅ **Manifest.json Created**: Fixed the 404 error for missing manifest file

---

## Step 1: Update Backend Environment Variables on Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your backend project: `taskmanager-api`
3. Go to **Settings → Environment Variables**
4. Add/Update the following:
   ```
   FRONTEND_URL = https://your-new-frontend-url.vercel.app
   MONGODB_URL = (your existing MongoDB connection string)
   ```
5. Redeploy the backend:
   - Click **Deployments**
   - Find the latest deployment
   - Click the "..." menu → **Redeploy**

---

## Step 2: Deploy Frontend to Vercel

### Option A: Deploy via Vercel Dashboard (Easiest)

1. **Connect GitHub Repository**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click **Add New → Project**
   - Select **Import Git Repository**
   - Authorize GitHub and select your `task_manager` repository
   - Click **Import**

2. **Configure Project Settings**:
   - **Framework**: Select `Create React App`
   - **Root Directory**: Set to `./frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`

3. **Add Environment Variables**:
   - Add `REACT_APP_API_URL` with value: `https://taskmanager-api-liart.vercel.app`

4. **Deploy**: Click **Deploy**
   - Wait for deployment to complete
   - Note the generated URL (e.g., `https://task-manager-xxxx.vercel.app`)

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy the Frontend**:
   ```bash
   cd frontend
   vercel --prod
   ```

4. **Configure during deployment**:
   - Set **Root Directory** to current folder (`.`)
   - Use default build settings
   - Add environment variable: `REACT_APP_API_URL=https://taskmanager-api-liart.vercel.app`

---

## Step 3: Update Backend CORS with New Frontend URL

After frontend deployment is complete:

1. Note your new frontend URL from Vercel (e.g., `https://task-manager-xxxxx.vercel.app`)
2. Go to Vercel Dashboard → Backend Project → **Settings → Environment Variables**
3. Update `FRONTEND_URL` to your new frontend URL
4. Redeploy backend

Alternatively, update [backend/server.js](backend/server.js) directly:
```javascript
const allowedOrigins = [
  "http://localhost:3000",
  "https://your-new-frontend-url.vercel.app", // Add your deployed URL here
  "https://taskmanager-api-liart.vercel.app",
  process.env.FRONTEND_URL
].filter(Boolean)
```

---

## Step 4: Update Frontend API URL (If Needed)

The frontend currently uses: `https://taskmanager-api-liart.vercel.app`

If you want to make this configurable:

1. Create a `.env` file in `frontend/`:
   ```
   REACT_APP_API_URL=https://taskmanager-api-liart.vercel.app
   ```

2. Update [frontend/src/features/users/userHelper.js](frontend/src/features/users/userHelper.js):
   ```javascript
   const API_URL = process.env.REACT_APP_API_URL + "/api/users/"
   ```

3. Do the same for task helpers

---

## Step 5: Test the Application

1. Open your deployed frontend URL in browser
2. Try to sign up/sign in
3. Check browser console (F12) for any CORS errors
4. Verify data is being saved to MongoDB

---

## Troubleshooting

### Still Getting CORS Error?
- Clear browser cache (Ctrl+Shift+Delete)
- Check that frontend URL matches exactly in backend `allowedOrigins`
- Verify backend is redeployed after CORS changes
- Check Network tab in DevTools to see actual request/response headers

### Manifest.json Still Missing?
- Ensure `frontend/public/manifest.json` exists
- Verify `public/index.html` has: `<link rel="manifest" href="%PUBLIC_URL%/manifest.json" />`

### API Requests Still Failing?
- Verify `REACT_APP_API_URL` is correct
- Check MongoDB connection is working
- Review backend logs in Vercel Dashboard

---

## File Changes Made

1. ✅ [backend/server.js](backend/server.js) - Updated CORS configuration
2. ✅ [frontend/public/manifest.json](frontend/public/manifest.json) - Created manifest file
3. ✅ [backend/.env.example](backend/.env.example) - Created environment variable template
4. ✅ [frontend/.env.example](frontend/.env.example) - Created environment variable template

---

## Quick Command Reference

```bash
# Test locally (from root)
cd backend && npm start
cd frontend && npm start

# Build frontend
cd frontend && npm run build

# Deploy via Vercel CLI
cd frontend && vercel --prod

# Check for CORS issues
# Open DevTools → Network tab → Make API request → Check response headers for Access-Control-Allow-Origin
```

---

## Next Steps After Deployment

1. Update all hardcoded URLs to use environment variables
2. Add error handling for CORS failures
3. Set up CI/CD pipeline on Vercel for automatic deployments
4. Consider adding HTTPS enforcement
5. Monitor Vercel analytics for performance

