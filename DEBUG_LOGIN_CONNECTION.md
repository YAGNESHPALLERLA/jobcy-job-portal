# Debug Login Connection - Step by Step Guide

## Current Issue
Still getting "Sign In Failed - Unable to connect to server" even after fixing API endpoints.

## Step-by-Step Debugging

### Step 1: Check Railway Backend Status

#### 1.1 Check Railway Dashboard
1. Go to your Railway dashboard
2. Click on your backend service
3. Check if the deployment is **"Deployed"** (green status)
4. Look at the **"Logs"** tab for any errors

#### 1.2 Test Railway Backend Directly
Open these URLs in your browser:

**Health Check:**
```
https://your-railway-app.railway.app/health
```
Expected: `{"status": "healthy", "uptime": 123.456, "timestamp": "..."}`

**API Root:**
```
https://your-railway-app.railway.app/
```
Expected: `{"status": "OK", "message": "Job Portal API is running", ...}`

**Login Endpoint:**
```
https://your-railway-app.railway.app/api/auth/login
```
Expected: `{"error": "Email and password are required."}` (this is normal for GET request)

### Step 2: Check Vercel Environment Variables

#### 2.1 Verify Vercel Settings
1. Go to Vercel dashboard
2. Select your frontend project
3. Go to **Settings** → **Environment Variables**
4. Check if these variables are set:
   ```
   NEXT_PUBLIC_API_URL = https://your-railway-app.railway.app
   NEXT_PUBLIC_SOCKET_URL = https://your-railway-app.railway.app
   ```

#### 2.2 Test Environment Variables
Add this temporary code to your login page to debug:

```javascript
// Add this to your login page temporarily
console.log("Environment check:");
console.log("NEXT_PUBLIC_API_URL:", process.env.NEXT_PUBLIC_API_URL);
console.log("NODE_ENV:", process.env.NODE_ENV);
```

### Step 3: Browser Debugging

#### 3.1 Open Browser Dev Tools
1. Go to your Vercel frontend
2. Open browser dev tools (F12)
3. Go to **Console** tab
4. Try to log in
5. Look for error messages

#### 3.2 Check Network Tab
1. Go to **Network** tab in dev tools
2. Try to log in
3. Look for the login API call
4. Check:
   - **Status code** (200, 404, 500, etc.)
   - **Request URL** (should be your Railway URL)
   - **Response** (error message)

### Step 4: Common Issues & Solutions

#### Issue 1: Railway Backend Not Running
**Symptoms:**
- Railway health check returns error
- Network requests show 502/503 errors

**Solution:**
1. Check Railway logs for errors
2. Verify environment variables in Railway
3. Redeploy Railway service

#### Issue 2: Wrong Environment Variables
**Symptoms:**
- Console shows `undefined` for API URL
- Network requests go to wrong URL

**Solution:**
1. Set correct environment variables in Vercel
2. Redeploy Vercel frontend
3. Clear browser cache

#### Issue 3: CORS Errors
**Symptoms:**
- Browser console shows CORS errors
- Network requests fail with CORS error

**Solution:**
1. Check Railway backend CORS settings
2. Add your Vercel domain to allowed origins

#### Issue 4: Database Connection Issues
**Symptoms:**
- Railway logs show database connection errors
- Backend health check fails

**Solution:**
1. Check MongoDB URI in Railway environment variables
2. Verify database connection string format

### Step 5: Quick Tests

#### Test 1: Direct API Call
Open browser console and run:
```javascript
fetch('https://your-railway-app.railway.app/health')
  .then(response => response.json())
  .then(data => console.log('Health check:', data))
  .catch(error => console.error('Error:', error));
```

#### Test 2: Login API Call
```javascript
fetch('https://your-railway-app.railway.app/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'test@example.com', password: 'password' })
})
.then(response => response.json())
.then(data => console.log('Login response:', data))
.catch(error => console.error('Login error:', error));
```

### Step 6: Environment Variables Checklist

#### Railway Backend Variables:
```
MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET = your-super-secret-jwt-key
NODE_ENV = production
PORT = 3001
FRONTEND_URL = https://your-vercel-app.vercel.app
```

#### Vercel Frontend Variables:
```
NEXT_PUBLIC_API_URL = https://your-railway-app.railway.app
NEXT_PUBLIC_SOCKET_URL = https://your-railway-app.railway.app
```

### Step 7: Debugging Checklist

- [ ] Railway backend is deployed and running
- [ ] Railway health check returns success
- [ ] Vercel environment variables are set correctly
- [ ] Browser console shows correct API URL
- [ ] Network requests go to correct endpoint
- [ ] No CORS errors in browser console
- [ ] Database connection is working in Railway

### Step 8: If Still Not Working

#### Check Railway Logs:
1. Go to Railway dashboard
2. Click on your backend service
3. Go to **"Logs"** tab
4. Look for any error messages during startup

#### Check Vercel Logs:
1. Go to Vercel dashboard
2. Click on your frontend project
3. Go to **"Functions"** tab
4. Check for any build or runtime errors

## Quick Fix Commands

### If Railway Backend Issues:
```bash
# Check Railway service status
railway status

# View Railway logs
railway logs

# Redeploy Railway service
railway up
```

### If Vercel Frontend Issues:
```bash
# Redeploy Vercel
vercel --prod

# Check Vercel logs
vercel logs
```

## Expected Results

### Working Railway Backend:
- Health check: `{"status": "healthy", ...}`
- API root: `{"status": "OK", "message": "Job Portal API is running", ...}`

### Working Vercel Frontend:
- Console shows correct API URL
- Network requests succeed
- Login works without errors

## Next Steps

1. **Test Railway backend** using the URLs above
2. **Check Vercel environment variables**
3. **Debug browser console and network tab**
4. **Report back with specific error messages**

This will help identify the exact issue! 🔍
