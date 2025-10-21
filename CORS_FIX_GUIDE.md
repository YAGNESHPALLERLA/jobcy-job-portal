# CORS Fix Guide - "Access-Control-Allow-Origin" Error

## Problem Identified
You're getting a CORS error because:
1. **Vercel environment variables** are set to placeholder URLs (`your-backend-url.com`)
2. **Railway backend** needs to allow your Vercel domain
3. **CORS configuration** needs to be updated

## Step-by-Step Fix

### Step 1: Get Your Railway Backend URL

1. **Go to Railway Dashboard:**
   - Visit: https://railway.app/dashboard
   - Click on your `jobcy-job-portal` service
   - Look for the **external URL** (not the `.internal` one)
   - It should look like: `https://jobcy-job-portal-production.railway.app`

### Step 2: Update Vercel Environment Variables

**In Vercel Dashboard:**
1. Go to your project → **Settings** → **Environment Variables**
2. **Delete** the old variables with placeholder URLs
3. **Add** these new variables:
   ```
   NEXT_PUBLIC_API_URL = https://your-actual-railway-app.railway.app
   NEXT_PUBLIC_SOCKET_URL = https://your-actual-railway-app.railway.app
   ```
4. **Redeploy** your Vercel frontend

### Step 3: Update Railway Environment Variables

**In Railway Dashboard:**
1. Go to your backend service → **Settings** → **Variables**
2. **Add** this environment variable:
   ```
   FRONTEND_URL = https://jobcy-job-portal-jydd2z01t-karthiks-projects-1f906af9.vercel.app
   ```
3. **Redeploy** your Railway backend

### Step 4: Test the Connection

**Test Railway Backend:**
```
https://your-railway-app.railway.app/health
```
Should return: `{"status": "healthy", ...}`

**Test CORS:**
Open browser console and run:
```javascript
fetch('https://your-railway-app.railway.app/health')
  .then(response => response.json())
  .then(data => console.log('Success:', data))
  .catch(error => console.error('Error:', error));
```

## Expected Results

### After Fix:
- ✅ No more CORS errors
- ✅ Login requests succeed
- ✅ Frontend connects to backend properly

### Railway Logs Should Show:
```
CORS request from origin: https://jobcy-job-portal-jydd2z01t-karthiks-projects-1f906af9.vercel.app
Origin allowed: https://jobcy-job-portal-jydd2z01t-karthiks-projects-1f906af9.vercel.app
```

## Troubleshooting

### If Still Getting CORS Errors:

1. **Check Railway Logs:**
   - Go to Railway dashboard → Your service → Logs
   - Look for CORS-related messages

2. **Verify Environment Variables:**
   - Railway: `FRONTEND_URL` should be your Vercel URL
   - Vercel: `NEXT_PUBLIC_API_URL` should be your Railway URL

3. **Clear Browser Cache:**
   - Hard refresh (Ctrl+F5)
   - Clear browser cache

4. **Test with curl:**
   ```bash
   curl -H "Origin: https://jobcy-job-portal-jydd2z01t-karthiks-projects-1f906af9.vercel.app" \
        -H "Access-Control-Request-Method: POST" \
        -H "Access-Control-Request-Headers: Content-Type" \
        -X OPTIONS \
        https://your-railway-app.railway.app/api/auth/login
   ```

## Quick Checklist

- [ ] Railway backend is running (green status)
- [ ] Railway has `FRONTEND_URL` environment variable set
- [ ] Vercel has `NEXT_PUBLIC_API_URL` set to Railway URL
- [ ] Both services are redeployed
- [ ] Browser cache is cleared
- [ ] No CORS errors in browser console

## Files Modified

- `jobcy-backend-main/app.js` - Enhanced CORS configuration with logging
- Added comprehensive CORS troubleshooting guide

The CORS issue should now be resolved! 🚀
