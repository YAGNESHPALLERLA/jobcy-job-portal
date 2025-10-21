# URL and CORS Fix Guide

## Issues Identified

### 1. **Double `/api` in URL**
- **Problem**: `https://your-backend-url.com/api/api/auth/login`
- **Cause**: Environment variable includes `/api` + code adds `/api` again
- **Fix**: Remove extra `/api` from code

### 2. **Placeholder URL**
- **Problem**: Still using `your-backend-url.com`
- **Cause**: Vercel environment variables not updated
- **Fix**: Set actual Railway URL

### 3. **CORS Error**
- **Problem**: "Access-Control-Allow-Origin" header missing
- **Cause**: Railway backend doesn't allow Vercel domain
- **Fix**: Update Railway CORS configuration

## Step-by-Step Fix

### Step 1: Get Your Railway Backend URL

1. **Go to Railway Dashboard:**
   - Visit: https://railway.app/dashboard
   - Click on your `jobcy-job-portal` service
   - Find the **external URL** (not `.internal`)
   - Example: `https://jobcy-job-portal-production.railway.app`

### Step 2: Update Vercel Environment Variables

**In Vercel Dashboard:**
1. Go to your project → **Settings** → **Environment Variables**
2. **Delete** old variables with `your-backend-url.com`
3. **Add** these variables:
   ```
   NEXT_PUBLIC_API_URL = https://your-railway-app.railway.app/api
   NEXT_PUBLIC_SOCKET_URL = https://your-railway-app.railway.app
   ```
4. **Redeploy** your Vercel frontend

### Step 3: Update Railway Environment Variables

**In Railway Dashboard:**
1. Go to your backend service → **Settings** → **Variables**
2. **Add** this variable:
   ```
   FRONTEND_URL = https://jobcy-job-portal-m5j9oahry-karthiks-projects-1f906af9.vercel.app
   ```
3. **Redeploy** your Railway backend

### Step 4: Test the Connection

**Test Railway Backend:**
```
https://your-railway-app.railway.app/health
```

**Test Login Endpoint:**
```
https://your-railway-app.railway.app/api/auth/login
```

## URL Structure Explanation

### Correct URL Structure:
```
NEXT_PUBLIC_API_URL = https://your-railway-app.railway.app/api
Login endpoint = /auth/login
Final URL = https://your-railway-app.railway.app/api/auth/login
```

### What Was Wrong:
```
NEXT_PUBLIC_API_URL = https://your-backend-url.com/api  (placeholder)
Login endpoint = /api/auth/login  (double /api)
Final URL = https://your-backend-url.com/api/api/auth/login  (WRONG)
```

### What's Fixed:
```
NEXT_PUBLIC_API_URL = https://your-railway-app.railway.app/api  (real URL)
Login endpoint = /auth/login  (single /api)
Final URL = https://your-railway-app.railway.app/api/auth/login  (CORRECT)
```

## Files Modified

- `jobcy-frontend-main/src/app/user/auth/login/page.tsx`
- `jobcy-frontend-main/src/app/user/auth/signup/page.tsx`
- `jobcy-frontend-main/src/app/admin/auth/login/page.tsx`
- `jobcy-frontend-main/src/app/hr/auth/login/page.tsx`
- `jobcy-frontend-main/src/app/company/auth/login/page.tsx`

## Expected Results

### After Fix:
- ✅ **No more double `/api` in URLs**
- ✅ **No more CORS errors**
- ✅ **Login requests succeed**
- ✅ **Frontend connects to backend properly**

### Railway Logs Should Show:
```
CORS request from origin: https://jobcy-job-portal-m5j9oahry-karthiks-projects-1f906af9.vercel.app
Origin allowed: https://jobcy-job-portal-m5j9oahry-karthiks-projects-1f906af9.vercel.app
```

## Quick Checklist

- [ ] Get your actual Railway backend URL
- [ ] Update Vercel environment variables with Railway URL
- [ ] Add `FRONTEND_URL` to Railway environment variables
- [ ] Redeploy both Railway and Vercel
- [ ] Clear browser cache
- [ ] Test login again

## Troubleshooting

### If Still Getting CORS Errors:

1. **Check Railway Logs:**
   - Look for CORS-related messages
   - Verify `FRONTEND_URL` is set correctly

2. **Check Vercel Environment Variables:**
   - Verify `NEXT_PUBLIC_API_URL` is set to Railway URL
   - Make sure it includes `/api` at the end

3. **Test with curl:**
   ```bash
   curl -H "Origin: https://jobcy-job-portal-m5j9oahry-karthiks-projects-1f906af9.vercel.app" \
        -H "Access-Control-Request-Method: POST" \
        -H "Access-Control-Request-Headers: Content-Type" \
        -X OPTIONS \
        https://your-railway-app.railway.app/api/auth/login
   ```

The URL and CORS issues should now be resolved! 🚀
