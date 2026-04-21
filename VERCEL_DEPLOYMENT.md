# Vercel Frontend Deployment Guide

## Quick Steps

### 1. Push Your Code to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Deploy to Vercel

**Option A: Using Vercel Dashboard (Recommended)**

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. **Configure Project:**
   - **Root Directory:** Select `Frontend` (IMPORTANT!)
   - **Framework Preset:** Vite (should auto-detect)
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `dist` (auto-detected)
   - **Install Command:** `npm install` (auto-detected)

5. **Add Environment Variable:**
   - Click "Environment Variables"
   - Add: `VITE_API_URL` = `https://gapify-ai-resume-and-job-analyzer.onrender.com`

6. Click "Deploy"

**Option B: Using Vercel CLI**

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to Frontend folder
cd Frontend

# Deploy
vercel

# Follow prompts:
# - Link to existing project or create new
# - Set environment variable when prompted
```

### 3. Update Backend CORS

After deployment, you'll get a Vercel URL like: `https://your-app.vercel.app`

1. Go to your Render dashboard
2. Select your backend service
3. Go to "Environment" tab
4. Update `FRONTEND_URL` to your Vercel URL
5. Click "Save Changes"
6. Backend will automatically redeploy

### 4. Test Your Deployment

1. Visit your Vercel URL
2. Register a new account
3. Upload a resume and generate a report
4. Check all features work

## Troubleshooting

### Build Fails
- Make sure you selected `Frontend` as root directory
- Check build logs for specific errors
- Verify all dependencies are in package.json

### API Calls Fail (CORS Error)
- Verify `VITE_API_URL` environment variable is set correctly
- Verify `FRONTEND_URL` in backend matches your Vercel URL exactly
- Wait for backend to finish redeploying after CORS update

### 404 on Page Refresh
- Vercel should handle this automatically with Vite
- If issues persist, check vercel.json rewrites configuration

### Environment Variables Not Working
- Environment variables must start with `VITE_`
- Redeploy after adding/changing environment variables
- Check "Deployments" tab to see which variables were used

## Your Configuration

**Backend URL:** `https://gapify-ai-resume-and-job-analyzer.onrender.com`

**Environment Variable to Add:**
```
VITE_API_URL=https://gapify-ai-resume-and-job-analyzer.onrender.com
```

**After Deployment:**
Update backend `FRONTEND_URL` to your new Vercel URL

## Done! 🎉

Your app should now be live and accessible worldwide!
