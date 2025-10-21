# Vercel Environment Variables for Railway Backend

## Overview
Your frontend (Vercel) needs to connect to your backend (Railway). Here are the exact environment variables you need to set in Vercel.

## Required Environment Variables for Vercel

### 1. **NEXT_PUBLIC_API_URL**
- **Purpose**: Base URL for all API calls to your Railway backend
- **Format**: `https://your-railway-app.railway.app`
- **Example**: `https://jobcy-job-portal-production.railway.app`

### 2. **NEXT_PUBLIC_SOCKET_URL**
- **Purpose**: WebSocket URL for real-time chat functionality
- **Format**: `https://your-railway-app.railway.app`
- **Example**: `https://jobcy-job-portal-production.railway.app`

## How to Set Environment Variables in Vercel

### Step 1: Get Your Railway Backend URL
1. Go to your Railway dashboard
2. Click on your backend service
3. Go to the "Settings" tab
4. Copy the "Domain" URL (it looks like: `https://your-app.railway.app`)

### Step 2: Set Variables in Vercel
1. Go to your Vercel dashboard
2. Select your frontend project
3. Go to "Settings" → "Environment Variables"
4. Add the following variables:

#### For Production Environment:
```
NEXT_PUBLIC_API_URL = https://your-railway-app.railway.app
NEXT_PUBLIC_SOCKET_URL = https://your-railway-app.railway.app
```

#### For Preview Environment (optional):
```
NEXT_PUBLIC_API_URL = https://your-railway-app.railway.app
NEXT_PUBLIC_SOCKET_URL = https://your-railway-app.railway.app
```

#### For Development Environment (optional):
```
NEXT_PUBLIC_API_URL = https://your-railway-app.railway.app
NEXT_PUBLIC_SOCKET_URL = https://your-railway-app.railway.app
```

## Example Configuration

### If your Railway URL is: `https://jobcy-job-portal-production.railway.app`

Set these in Vercel:
```
NEXT_PUBLIC_API_URL = https://jobcy-job-portal-production.railway.app
NEXT_PUBLIC_SOCKET_URL = https://jobcy-job-portal-production.railway.app
```

## How These Variables Are Used

### In Your Frontend Code:
```javascript
// API calls use NEXT_PUBLIC_API_URL
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/register`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data)
});

// Socket.IO connections use NEXT_PUBLIC_SOCKET_URL
const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
  auth: { token: userToken }
});
```

## Railway Backend Environment Variables

### Your Railway backend needs these variables:
```
MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET = your-super-secret-jwt-key
NODE_ENV = production
PORT = 3001
FRONTEND_URL = https://your-vercel-app.vercel.app
```

## Step-by-Step Setup

### 1. **Get Railway Backend URL**
- Go to Railway dashboard
- Click on your backend service
- Copy the domain URL from Settings

### 2. **Set Vercel Environment Variables**
- Go to Vercel dashboard
- Select your frontend project
- Go to Settings → Environment Variables
- Add the two variables above

### 3. **Redeploy Both Services**
- Railway will auto-deploy when you push to GitHub
- Vercel will auto-deploy when you push to GitHub
- Both should now connect properly

## Testing the Connection

### 1. **Test API Connection**
Visit: `https://your-vercel-app.vercel.app`
- Try to register a new user
- Check browser network tab for API calls

### 2. **Test Backend Health**
Visit: `https://your-railway-app.railway.app/health`
- Should return: `{"status": "healthy", ...}`

### 3. **Test API Endpoint**
Visit: `https://your-railway-app.railway.app/`
- Should return: `{"status": "OK", "message": "Job Portal API is running", ...}`

## Troubleshooting

### If Frontend Can't Connect to Backend:

1. **Check Railway URL**:
   - Make sure Railway backend is deployed successfully
   - Test the health endpoint: `https://your-railway-app.railway.app/health`

2. **Check Vercel Variables**:
   - Verify environment variables are set correctly
   - Make sure they're set for the right environment (Production/Preview)

3. **Check CORS**:
   - Railway backend should allow your Vercel domain
   - Check Railway logs for CORS errors

4. **Check Network**:
   - Open browser dev tools
   - Check Network tab for failed requests
   - Look for 404 or CORS errors

## Common Issues

### 1. **CORS Errors**
- Railway backend needs to allow your Vercel domain
- Check `app.js` CORS configuration

### 2. **404 Errors**
- Make sure Railway backend is running
- Check the API endpoint URLs

### 3. **Environment Variable Not Working**
- Make sure variables start with `NEXT_PUBLIC_`
- Redeploy Vercel after adding variables

## Quick Reference

### Railway Backend URL Format:
```
https://[service-name]-[environment].railway.app
```

### Vercel Environment Variables:
```
NEXT_PUBLIC_API_URL = https://your-railway-app.railway.app
NEXT_PUBLIC_SOCKET_URL = https://your-railway-app.railway.app
```

### Test URLs:
- Backend Health: `https://your-railway-app.railway.app/health`
- Frontend: `https://your-vercel-app.vercel.app`

## Next Steps

1. **Set the environment variables in Vercel**
2. **Redeploy your Vercel frontend**
3. **Test the connection**
4. **Check both Railway and Vercel logs for any errors**

Your frontend and backend should now be properly connected! 🚀
