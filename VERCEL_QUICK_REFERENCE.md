# Vercel Environment Variables - Quick Reference

## 🚀 Quick Setup for Railway Backend Connection

### Step 1: Get Your Railway Backend URL
1. Go to Railway dashboard → Your backend service → Settings
2. Copy the domain URL (format: `https://your-app.railway.app`)

### Step 2: Set These Variables in Vercel
Go to Vercel Dashboard → Your Project → Settings → Environment Variables

## 📋 Required Environment Variables

| Variable Name | Value | Purpose |
|---------------|-------|---------|
| `NEXT_PUBLIC_API_URL` | `https://your-railway-app.railway.app` | API calls |
| `NEXT_PUBLIC_SOCKET_URL` | `https://your-railway-app.railway.app` | Real-time chat |

## 🔧 Example Configuration

If your Railway URL is: `https://jobcy-job-portal-production.railway.app`

Set in Vercel:
```
NEXT_PUBLIC_API_URL = https://jobcy-job-portal-production.railway.app
NEXT_PUBLIC_SOCKET_URL = https://jobcy-job-portal-production.railway.app
```

## ✅ Test Your Setup

1. **Backend Health Check**: `https://your-railway-app.railway.app/health`
2. **Frontend**: `https://your-vercel-app.vercel.app`
3. **Try registering a user** - should work if connected properly

## 🚨 Common Issues

- **CORS Error**: Check Railway backend CORS settings
- **404 Error**: Verify Railway backend is running
- **Environment Variable Not Working**: Make sure it starts with `NEXT_PUBLIC_`

## 📝 Notes

- Variables must start with `NEXT_PUBLIC_` to be accessible in frontend
- Redeploy Vercel after adding environment variables
- Both URLs should be the same (your Railway backend URL)
