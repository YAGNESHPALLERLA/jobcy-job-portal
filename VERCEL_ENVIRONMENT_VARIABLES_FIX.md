# 🔧 Vercel Environment Variables Fix

## ❌ Current Error

**Sign In Failed: Unable to connect to server. Try again later.**

This error occurs because your Vercel deployment doesn't have the required environment variables configured.

---

## 🎯 Root Cause

The frontend is trying to call:
```
undefined/login  ❌ WRONG
```

Instead of:
```
https://your-backend-url.com/api/login  ✅ CORRECT
```

This happens because `NEXT_PUBLIC_API_URL` is not set in Vercel.

---

## ✅ Complete Solution

### **Step 1: Deploy Your Backend First**

You **MUST** deploy the backend before the frontend can work. Choose one option:

#### **Option A: Railway (Recommended - Free & Easy)**

1. **Go to:** https://railway.app
2. **Sign up** with GitHub
3. Click **"New Project"**
4. Select **"Deploy from GitHub repo"**
5. Choose your repository
6. **Important:** Set **Root Directory** to `jobcy-backend-main`
7. Railway will auto-detect Node.js

**Add Environment Variables in Railway:**

Click on your service → **Variables** tab → Add:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/jobcy?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-to-something-random
PORT=5000
NODE_ENV=production
```

8. **Deploy** and wait for it to finish
9. **Copy the deployment URL** (e.g., `https://jobcy-backend-production.up.railway.app`)

---

#### **Option B: Render**

1. **Go to:** https://render.com
2. **Sign up** with GitHub
3. Click **"New +"** → **"Web Service"**
4. Connect your GitHub repository
5. Configure:
   - **Name:** jobcy-backend
   - **Root Directory:** `jobcy-backend-main`
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

**Add Environment Variables:**

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/jobcy?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-to-something-random
PORT=5000
NODE_ENV=production
```

6. Click **"Create Web Service"**
7. Wait for deployment
8. **Copy the URL** (e.g., `https://jobcy-backend.onrender.com`)

---

### **Step 2: Get Your MongoDB Connection String**

If you don't have MongoDB Atlas set up:

1. **Go to:** https://www.mongodb.com/cloud/atlas/register
2. **Create a free account**
3. **Create a cluster** (M0 Free tier)
4. Click **"Connect"** → **"Connect your application"**
5. **Copy the connection string:**
   ```
   mongodb+srv://<username>:<password>@cluster.mongodb.net/jobcy?retryWrites=true&w=majority
   ```
6. **Replace** `<username>` and `<password>` with your database credentials
7. Make sure to **add your IP** to the whitelist (or use `0.0.0.0/0` for all IPs)

---

### **Step 3: Configure Vercel Environment Variables**

Now that your backend is deployed, configure Vercel:

1. **Go to:** https://vercel.com/dashboard
2. **Select your project** (jobcy-frontend or your project name)
3. Click **"Settings"** (top navigation)
4. Click **"Environment Variables"** (left sidebar)
5. **Add the following variables:**

#### **Variable 1: NEXT_PUBLIC_API_URL**
- **Key:** `NEXT_PUBLIC_API_URL`
- **Value:** `https://your-backend-url.com/api`
  - Replace with your Railway/Render URL + `/api`
  - Example: `https://jobcy-backend-production.up.railway.app/api`
- **Environment:** Production, Preview, Development (check all)
- Click **"Save"**

#### **Variable 2: NEXT_PUBLIC_SOCKET_URL**
- **Key:** `NEXT_PUBLIC_SOCKET_URL`
- **Value:** `https://your-backend-url.com`
  - Same URL as above but WITHOUT `/api`
  - Example: `https://jobcy-backend-production.up.railway.app`
- **Environment:** Production, Preview, Development (check all)
- Click **"Save"**

---

### **Step 4: Redeploy Your Vercel Frontend**

After adding environment variables, you MUST redeploy:

**Method 1: Redeploy from Vercel Dashboard**
1. Go to **"Deployments"** tab
2. Find the latest deployment
3. Click the **"..."** menu (three dots)
4. Click **"Redeploy"**
5. Confirm the redeploy

**Method 2: Push a New Commit**
```bash
# Make a small change or add a comment
git commit --allow-empty -m "Trigger redeploy after env vars"
git push origin main
```

---

### **Step 5: Verify Backend is Working**

Before testing the frontend, verify your backend is running:

Open in browser:
```
https://your-backend-url.com/
```

You should see a response (even if it's an error page, it means the backend is online).

Test the API:
```
https://your-backend-url.com/api/
```

---

### **Step 6: Test Your Application**

1. Wait for Vercel to finish redeploying (2-3 minutes)
2. Go to your Vercel URL: `https://your-project.vercel.app`
3. Navigate to the login page
4. Try to sign in

If you still get errors, **open Developer Tools** (F12) and check:
- **Console tab** - Look for the actual API URL being called
- **Network tab** - Check the request to `/login` and see the full URL

---

## 🔍 Troubleshooting

### Issue 1: Still getting "undefined/login"

**Solution:** You didn't redeploy after adding environment variables.
- Go to Vercel → Deployments → Redeploy

---

### Issue 2: CORS Error

If you see: `Access to fetch has been blocked by CORS policy`

**Fix the backend:**

Edit `jobcy-backend-main/app.js` or `server.js` and ensure CORS is configured:

```javascript
const cors = require('cors');

// Allow your Vercel domain
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-project.vercel.app',
    'https://your-project-*.vercel.app'  // For preview deployments
  ],
  credentials: true
}));
```

Then redeploy your backend.

---

### Issue 3: 500 Internal Server Error

**Check backend logs:**

**Railway:**
- Go to your project → Click on service → View Logs

**Render:**
- Go to your service → Logs tab

Common issues:
- MongoDB connection string is wrong
- Database user doesn't have permissions
- IP address not whitelisted in MongoDB Atlas

---

### Issue 4: Cannot read properties of undefined

Make sure your environment variables in Vercel start with `NEXT_PUBLIC_`:
- ✅ `NEXT_PUBLIC_API_URL`
- ❌ `API_URL`

Only variables with `NEXT_PUBLIC_` prefix are accessible in the browser.

---

## 📋 Quick Checklist

- [ ] Backend deployed to Railway/Render
- [ ] Backend URL copied
- [ ] MongoDB Atlas cluster created
- [ ] MongoDB connection string added to backend env vars
- [ ] Backend is running (verified by visiting the URL)
- [ ] `NEXT_PUBLIC_API_URL` added to Vercel (with `/api`)
- [ ] `NEXT_PUBLIC_SOCKET_URL` added to Vercel (without `/api`)
- [ ] Frontend redeployed in Vercel
- [ ] Tested login after redeploy
- [ ] Checked browser console for errors

---

## 🎯 Example Configuration

**Backend (Railway/Render):**
```env
MONGO_URI=mongodb+srv://jobcyuser:SecurePassword123@cluster0.abcde.mongodb.net/jobcy?retryWrites=true&w=majority
JWT_SECRET=my-super-secret-jwt-key-2025-production
PORT=5000
NODE_ENV=production
```

**Backend URL:**
```
https://jobcy-backend-production.up.railway.app
```

**Frontend (Vercel):**
```env
NEXT_PUBLIC_API_URL=https://jobcy-backend-production.up.railway.app/api
NEXT_PUBLIC_SOCKET_URL=https://jobcy-backend-production.up.railway.app
```

---

## 🆘 Still Not Working?

If you're still having issues, check:

1. **Open Browser Console (F12)** and look for the actual URL being called
2. **Check Vercel deployment logs** for build errors
3. **Check backend logs** on Railway/Render
4. **Verify MongoDB Atlas** IP whitelist includes your backend's IP

---

## 📞 Need Help?

Reply with:
1. Your backend deployment platform (Railway/Render/Other)
2. Your backend URL
3. Screenshot of Vercel environment variables page
4. Any error messages from browser console

---

**Next Steps:** Deploy your backend first, then configure Vercel environment variables, then redeploy! 🚀



