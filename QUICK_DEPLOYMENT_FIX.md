# ⚡ Quick Fix for "Unable to Connect to Server" Error

## 🔴 Your Current Problem

**Error:** "Sign In Failed - Unable to connect to server. Try again later."

**Why:** Your Vercel frontend doesn't know where your backend is located.

---

## ✅ 3-Step Solution

### **STEP 1: Deploy Your Backend (15 minutes)**

#### **Using Railway (Recommended):**

1. Go to **https://railway.app** → Sign up with GitHub
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your repository → Choose **root directory: `jobcy-backend-main`**
4. **Add Environment Variables:**

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/jobcy?retryWrites=true&w=majority
JWT_SECRET=change-this-to-random-secret-string-production-2025
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-project.vercel.app
```

5. Click **Deploy**
6. **Copy your Railway URL** (e.g., `https://jobcy-backend-production.up.railway.app`)

💡 **Don't have MongoDB?** 
- Go to **https://mongodb.com/cloud/atlas**
- Create free account → Create M0 cluster (Free)
- Click **Connect** → **Connect your application** → Copy connection string
- Replace `<username>`, `<password>`, and `<database>` with your values

---

### **STEP 2: Configure Vercel Environment Variables (5 minutes)**

1. Go to **https://vercel.com/dashboard**
2. Select your project
3. Click **Settings** → **Environment Variables**
4. **Add these 2 variables:**

**Variable 1:**
```
Key: NEXT_PUBLIC_API_URL
Value: https://your-railway-url.up.railway.app/api
Environment: Production, Preview, Development (check all 3)
```

**Variable 2:**
```
Key: NEXT_PUBLIC_SOCKET_URL
Value: https://your-railway-url.up.railway.app
Environment: Production, Preview, Development (check all 3)
```

⚠️ **Important:**
- Replace `your-railway-url.up.railway.app` with YOUR actual Railway URL
- `NEXT_PUBLIC_API_URL` must end with `/api`
- `NEXT_PUBLIC_SOCKET_URL` does NOT have `/api`

5. Click **Save** for each variable

---

### **STEP 3: Redeploy Vercel (2 minutes)**

Environment variables only apply to NEW deployments, so you must redeploy:

**Option A: From Vercel Dashboard**
1. Go to **Deployments** tab
2. Click **"..."** (three dots) on latest deployment
3. Click **"Redeploy"**
4. Wait 2-3 minutes for deployment to finish

**Option B: Push a commit**
```bash
git commit --allow-empty -m "Add environment variables"
git push
```

---

## ✅ Verify It's Working

### **Test Backend:**
Open in browser:
```
https://your-railway-url.up.railway.app/api
```
You should see something (even an error page means it's working)

### **Test Frontend:**
1. Wait for Vercel to finish deploying
2. Open your Vercel URL: `https://your-project.vercel.app`
3. Try to login

---

## 🔍 Still Getting Errors? Debug Steps

### **Check Browser Console (F12):**

Look for what URL is being called:
- ❌ If you see: `undefined/login` → Environment variables not set or frontend not redeployed
- ✅ Should see: `https://your-railway-url.up.railway.app/api/login`

### **Check Network Tab (F12 → Network):**

Try to login and check the `/login` request:
- **Status 404/405:** Wrong URL or backend routes not configured
- **Status 500:** Backend error - check Railway logs
- **CORS Error:** Add your Vercel URL to backend FRONTEND_URL env var
- **Failed to fetch:** Backend is down or URL is wrong

### **Check Railway Logs:**

1. Go to Railway Dashboard → Your project
2. Click on the service
3. Click **"View Logs"**
4. Look for errors

---

## 📋 Environment Variables Checklist

### **Backend (Railway):**
- [ ] `MONGO_URI` - Your MongoDB Atlas connection string
- [ ] `JWT_SECRET` - Random secret string
- [ ] `PORT` - 5000
- [ ] `NODE_ENV` - production
- [ ] `FRONTEND_URL` - Your Vercel URL (https://your-project.vercel.app)

### **Frontend (Vercel):**
- [ ] `NEXT_PUBLIC_API_URL` - Railway URL + `/api`
- [ ] `NEXT_PUBLIC_SOCKET_URL` - Railway URL (no `/api`)

---

## 🎯 Example Full Configuration

**Your Situation:**
- Frontend on Vercel: `https://jobcy-portal.vercel.app`
- Backend on Railway: `https://jobcy-backend-production.up.railway.app`
- MongoDB Atlas: `mongodb+srv://jobcyuser:SecurePass123@cluster0.abc.mongodb.net/jobcy`

**Railway Environment Variables:**
```env
MONGO_URI=mongodb+srv://jobcyuser:SecurePass123@cluster0.abc.mongodb.net/jobcy?retryWrites=true&w=majority
JWT_SECRET=8a7d9f6e4c2b1a3e5d7f9a2c4e6b8d0f
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://jobcy-portal.vercel.app
```

**Vercel Environment Variables:**
```env
NEXT_PUBLIC_API_URL=https://jobcy-backend-production.up.railway.app/api
NEXT_PUBLIC_SOCKET_URL=https://jobcy-backend-production.up.railway.app
```

---

## 🆘 Common Issues & Solutions

### Issue 1: "undefined/login" still showing
**Solution:** You forgot to redeploy Vercel after adding env vars
- Go to Vercel → Deployments → Redeploy

### Issue 2: CORS error
**Solution:** Update Railway env var:
```env
FRONTEND_URL=https://your-actual-vercel-url.vercel.app
```
Then redeploy backend on Railway

### Issue 3: Can't connect to MongoDB
**Solution:** 
- Check MongoDB Atlas → Network Access → Add IP Address → Allow from anywhere (0.0.0.0/0)
- Verify connection string username/password are correct
- Make sure database user has read/write permissions

### Issue 4: 500 Internal Server Error
**Solution:** Check Railway logs for the actual error
- Usually database connection issue
- Or missing environment variables

---

## 📞 Next Steps

1. **Deploy backend to Railway** (get the URL)
2. **Add environment variables to Vercel** (with your Railway URL)
3. **Redeploy Vercel**
4. **Test login**

If you need help with any specific step, let me know:
- Your Railway URL
- Screenshot of Vercel environment variables
- Any error messages you're seeing

---

**You can do this! Follow the steps in order and it will work! 🚀**


