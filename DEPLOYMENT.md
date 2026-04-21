# Deployment Guide

## Backend Deployment (Render)

1. **Create a new Web Service on Render**
   - Connect your GitHub repository
   - Select the `Backend` folder as the root directory
   - Build Command: `npm install`
   - Start Command: `npm start`

2. **Environment Variables** (Add in Render Dashboard)
   ```
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_secure_jwt_secret
   GROQ_API_KEY=your_groq_api_key
   PORT=3000
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```

3. **MongoDB Atlas Setup**
   - Create a free cluster at https://www.mongodb.com/cloud/atlas
   - Whitelist all IPs (0.0.0.0/0) for Render
   - Get connection string and add to MONGODB_URI

4. **After Deployment**
   - Copy your Render backend URL (e.g., https://your-app.onrender.com)
   - Use this URL in frontend environment variables

---

## Frontend Deployment (Vercel)

1. **Create a new Project on Vercel**
   - Import your GitHub repository
   - Framework Preset: Vite
   - Root Directory: `Frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

2. **Environment Variables** (Add in Vercel Dashboard)
   ```
   VITE_API_URL=https://your-backend-url.onrender.com
   ```

3. **After Deployment**
   - Copy your Vercel frontend URL
   - Update FRONTEND_URL in Render backend environment variables
   - Redeploy backend to apply CORS changes

---

## Important Notes

### Backend (Render)
- Free tier may spin down after inactivity (cold starts)
- First request after inactivity may take 30-60 seconds
- Consider upgrading for production use

### Frontend (Vercel)
- Automatic deployments on git push
- Preview deployments for pull requests
- Custom domain support available

### Database (MongoDB Atlas)
- Free tier: 512MB storage
- Automatic backups
- Upgrade for production workloads

---

## Testing Deployment

1. Visit your Vercel frontend URL
2. Register a new account
3. Upload a resume and generate a report
4. Check if all features work:
   - Authentication
   - Resume upload
   - Report generation
   - Past reports
   - Resume download

---

## Troubleshooting

### CORS Errors
- Ensure FRONTEND_URL in backend matches your Vercel URL exactly
- Redeploy backend after updating environment variables

### Database Connection Issues
- Check MongoDB Atlas IP whitelist
- Verify connection string format
- Check network access settings

### API Not Responding
- Check Render logs for errors
- Verify all environment variables are set
- Check if service is running

### Resume Download Not Working
- Puppeteer may need additional configuration on Render
- Check backend logs for Puppeteer errors
- May need to upgrade Render plan for Puppeteer support
