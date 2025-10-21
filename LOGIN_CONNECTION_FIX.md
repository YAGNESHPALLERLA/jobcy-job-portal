# Login Connection Fix - "Unable to connect to server"

## Problem Identified
The "Sign In Failed - Unable to connect to server" error was caused by **incorrect API endpoints** in the frontend login pages.

## Root Cause
Frontend login pages were calling wrong API endpoints:
- ❌ **Wrong**: `/login` 
- ✅ **Correct**: `/api/auth/login`

## Fixes Applied

### 1. User Login (`/user/auth/login/page.tsx`)
```javascript
// Before (WRONG)
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {

// After (CORRECT)
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
```

### 2. User Signup Auto-Login (`/user/auth/signup/page.tsx`)
```javascript
// Before (WRONG)
const loginResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {

// After (CORRECT)
const loginResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
```

### 3. Admin Login (`/admin/auth/login/page.tsx`)
```javascript
// Before (WRONG)
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {

// After (CORRECT)
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
```

### 4. HR Login (`/hr/auth/login/page.tsx`)
```javascript
// Before (WRONG)
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {

// After (CORRECT)
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
```

### 5. Company Login (`/company/auth/login/page.tsx`)
```javascript
// Before (WRONG)
const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login-company`, {

// After (CORRECT)
const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/company/login`, {
```

## Backend API Endpoints (Reference)

### Available Login Endpoints:
- `POST /api/auth/login` - Unified login (user, hr, admin)
- `POST /api/auth/company/login` - Company login
- `POST /api/auth/user/login` - User-specific login
- `POST /api/auth/hr/login` - HR-specific login

### Registration Endpoints:
- `POST /api/auth/user/register` - User registration
- `POST /api/auth/company/register` - Company registration
- `POST /api/auth/hr/register` - HR registration

## Testing the Fix

### 1. **Check Environment Variables**
Make sure Vercel has these variables set:
```
NEXT_PUBLIC_API_URL = https://your-railway-app.railway.app
NEXT_PUBLIC_SOCKET_URL = https://your-railway-app.railway.app
```

### 2. **Test Railway Backend**
Visit: `https://your-railway-app.railway.app/health`
Should return: `{"status": "healthy", ...}`

### 3. **Test Login Endpoints**
- User Login: `https://your-railway-app.railway.app/api/auth/login`
- Company Login: `https://your-railway-app.railway.app/api/auth/company/login`

### 4. **Test Frontend Login**
- Go to your Vercel frontend
- Try logging in with valid credentials
- Check browser console for any errors

## Debugging Steps

### 1. **Check Browser Console**
Open browser dev tools and look for:
- Network errors (404, 500, CORS)
- Console errors
- API call URLs

### 2. **Verify API Calls**
In browser dev tools → Network tab:
- Look for login API calls
- Check if they're going to correct endpoints
- Verify response status codes

### 3. **Test API Directly**
Use curl or Postman to test:
```bash
curl -X POST https://your-railway-app.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

## Common Issues After Fix

### 1. **Still Getting Connection Error**
- Check if Railway backend is running
- Verify environment variables in Vercel
- Check CORS settings in Railway

### 2. **404 Errors**
- Verify the API endpoint URLs are correct
- Check if Railway backend is deployed successfully

### 3. **CORS Errors**
- Railway backend needs to allow your Vercel domain
- Check `app.js` CORS configuration

### 4. **Environment Variable Issues**
- Make sure variables start with `NEXT_PUBLIC_`
- Redeploy Vercel after adding variables

## Files Modified

- `jobcy-frontend-main/src/app/user/auth/login/page.tsx`
- `jobcy-frontend-main/src/app/user/auth/signup/page.tsx`
- `jobcy-frontend-main/src/app/admin/auth/login/page.tsx`
- `jobcy-frontend-main/src/app/hr/auth/login/page.tsx`
- `jobcy-frontend-main/src/app/company/auth/login/page.tsx`

## Expected Result

After this fix:
- ✅ Login should work for all user types
- ✅ No more "Unable to connect to server" errors
- ✅ Proper API endpoint calls
- ✅ Successful authentication and redirection

## Next Steps

1. **Commit and push these changes**
2. **Redeploy Vercel frontend**
3. **Test login functionality**
4. **Verify all user types can log in**

The login connection issue should now be resolved! 🚀
