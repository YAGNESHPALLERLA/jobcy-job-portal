# 🚨 Vercel "No Framework Detected" - Root Directory Fix

**Error:** "No framework detected"  
**Cause:** Next.js app is in subdirectory `jobcy-frontend-main/`, not at root  
**Status:** ✅ SOLUTION BELOW

---

## 🔍 **THE PROBLEM**

Your repository structure:
```
📁 ohg_job/                    ← Vercel is looking here
  ├── 📁 jobcy-frontend-main/  ← Next.js is actually HERE
  │   ├── package.json         ← Framework detected if Vercel looks here
  │   ├── next.config.ts
  │   └── src/
  ├── 📁 jobcy-backend-main/
  └── 📄 *.md files
```

**Issue:** Vercel scans the root and finds no `package.json` or Next.js files.

---

## ✅ **SOLUTION A: Configure in Vercel Dashboard (Easiest)**

### **Step-by-Step:**

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Select your project: `jobcy-job-portal`

2. **Go to Settings**
   - Click **Settings** tab
   - Scroll to **"Build & Development Settings"**

3. **Set Root Directory**
   - Find: **"Root Directory"**
   - Click **"Edit"**
   - Enter: `jobcy-frontend-main`
   - Click **"Save"**

4. **Verify Other Settings:**
   - **Framework Preset:** Should auto-detect as "Next.js" now
   - **Build Command:** `npm run build` (auto-filled)
   - **Output Directory:** `.next` (auto-filled)
   - **Install Command:** `npm install` (auto-filled)

5. **Redeploy**
   - Go back to **Deployments** tab
   - Click **"Redeploy"** on latest deployment
   - Or push a new commit to trigger auto-deploy

### **Visual Guide:**

```
Vercel Dashboard → Your Project → Settings
  ↓
Build & Development Settings
  ↓
Root Directory: [Edit] → jobcy-frontend-main [Save]
  ↓
Redeploy
  ↓
✅ Framework Detected: Next.js
```

---

## ✅ **SOLUTION B: Vercel CLI (Alternative)**

If you prefer command line:

```powershell
cd jobcy-frontend-main

# Login to Vercel
vercel login

# Deploy with configuration
vercel --prod

# When prompted:
# - Root directory: . (current directory is already jobcy-frontend-main)
# - Framework: Next.js (should auto-detect)
```

---

## ✅ **SOLUTION C: Update vercel.json (If You Want Automation)**

Create/update `vercel.json` at the **ROOT** of your repository:

```json
{
  "buildCommand": "cd jobcy-frontend-main && npm run build",
  "installCommand": "cd jobcy-frontend-main && npm install",
  "outputDirectory": "jobcy-frontend-main/.next"
}
```

**Location:** `C:\Users\PAGADALA KARTHIK\OneDrive\Desktop\ohg_job\vercel.json`

This tells Vercel:
- Install dependencies in `jobcy-frontend-main/`
- Build in `jobcy-frontend-main/`
- Look for output in `jobcy-frontend-main/.next`

---

## 📋 **RECOMMENDED APPROACH**

**Best Practice:** Use **Solution A** (Dashboard configuration)

**Why?**
- ✅ Cleaner - No extra config files
- ✅ Easier to manage - Visual interface
- ✅ Less error-prone - Vercel validates settings
- ✅ Framework auto-detection works perfectly

**Solution C** (root-level vercel.json) works but can conflict with the existing `jobcy-frontend-main/vercel.json`.

---

## 🔧 **AFTER CONFIGURING ROOT DIRECTORY**

Once you set the root directory to `jobcy-frontend-main`, Vercel will:

1. ✅ Detect Next.js framework automatically
2. ✅ Find `package.json`
3. ✅ Use the `vercel.json` we already fixed
4. ✅ Run build commands in correct directory
5. ✅ Deploy successfully!

---

## 🎯 **VERIFICATION STEPS**

After setting root directory:

### **1. Check Framework Detection**
- Settings → Build & Development Settings
- Should show: **Framework Preset: Next.js**

### **2. Trigger New Deployment**
- Push a commit OR
- Click "Redeploy" in dashboard

### **3. Watch Build Logs**
Should see:
```
✓ Detected Next.js
✓ Installing dependencies...
✓ Building...
✓ Deployment Ready
```

### **4. Test Deployment**
- Visit your Vercel URL
- All routes should work

---

## 🐛 **TROUBLESHOOTING**

### **Still "No Framework Detected"?**

**Check 1:** Root directory is exactly `jobcy-frontend-main` (no typos)

**Check 2:** `package.json` exists at `jobcy-frontend-main/package.json`

**Check 3:** Clear Vercel cache
- Settings → Clear Cache → Redeploy

**Check 4:** Disconnect and reconnect repository
- Settings → Git → Disconnect
- Dashboard → Import → Reconnect with correct settings

---

### **Build Fails After Setting Root?**

**Likely cause:** Environment variables not set

**Fix:** Vercel Dashboard → Settings → Environment Variables

Add these:
```
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
NEXT_PUBLIC_SOCKET_URL=https://your-backend.railway.app
```

For: Production, Preview, Development

---

## 📊 **EXPECTED RESULT**

### **Before Fix:**
```
❌ No framework detected
❌ Build fails
❌ Can't find package.json
```

### **After Fix:**
```
✅ Framework Preset: Next.js
✅ Build succeeds
✅ Deployment ready
```

---

## 🎓 **UNDERSTANDING THE ISSUE**

### **Why This Happens:**

**Monorepo Structure:** You have multiple projects in one repo:
- Frontend: `jobcy-frontend-main/`
- Backend: `jobcy-backend-main/`
- Docs: Various `.md` files

**Vercel's Default:** Looks at repository root
- Expects: `package.json` at root
- Finds: Only documentation files
- Result: "No framework detected"

**The Fix:** Tell Vercel where to look
- Root Directory: `jobcy-frontend-main/`
- Now Vercel finds: `package.json`, `next.config.ts`, etc.
- Result: Framework detected!

### **This is Common:**

Many repos have this structure:
```
📁 my-project/
  ├── 📁 frontend/    ← Deploy this to Vercel
  ├── 📁 backend/     ← Deploy this to Railway
  └── 📄 README.md
```

**Solution is always the same:** Set root directory in deployment platform.

---

## 🔀 **ALTERNATIVE APPROACHES**

### **Approach 1: Monorepo Tools (Advanced)**

Use tools like:
- Turborepo
- Nx
- Lerna

These handle multi-package builds automatically.

**Pros:** Professional setup, scales well  
**Cons:** Complex setup, overkill for this project

### **Approach 2: Move Frontend to Root**

Restructure to:
```
📁 ohg_job/
  ├── src/           ← Frontend files here
  ├── backend/       ← Backend in subdirectory
  └── package.json   ← At root
```

**Pros:** Simpler Vercel setup  
**Cons:** Breaking change, need to move everything

### **Approach 3: Separate Repositories**

Create two repos:
- `jobcy-frontend` → Deploy to Vercel
- `jobcy-backend` → Deploy to Railway

**Pros:** Clean separation, independent versioning  
**Cons:** More repos to manage

### **Recommendation:**

**Stick with current structure + Root Directory setting**

It's the least disruptive and works perfectly!

---

## 📝 **QUICK ACTION CHECKLIST**

- [ ] Go to Vercel Dashboard
- [ ] Select your project
- [ ] Settings → Build & Development Settings
- [ ] Root Directory → Edit → `jobcy-frontend-main` → Save
- [ ] Verify Framework shows "Next.js"
- [ ] Redeploy (or push new commit)
- [ ] Check deployment succeeds
- [ ] Test your site works

**Time needed:** 2-3 minutes  
**Difficulty:** Easy ⭐

---

## 🎉 **SUMMARY**

**Problem:** Vercel looked at root, Next.js is in subdirectory

**Solution:** Set Root Directory to `jobcy-frontend-main` in Vercel Dashboard

**Result:** Framework detected, deployment succeeds!

---

## 🔗 **RELATED DOCS**

- Main fix guide: `DEPLOYMENT_NOT_FOUND_FIX.md`
- Quick reference: `VERCEL_QUICK_FIX_REFERENCE.md`
- Deployment steps: `VERCEL_DEPLOYMENT_STEPS.md`

---

**This is a simple fix! Just set the root directory and you're golden! 🚀**
