# 🚨 Vercel 404: NOT_FOUND Error - Fix Guide

**Error:** `404: NOT_FOUND`  
**Situation:** Build succeeded, but getting 404 when accessing deployment  
**Root Cause:** Root directory not properly configured in Vercel  

---

## 🔍 **THE PROBLEM**

Your build completed successfully (182 files generated), but Vercel is looking for files in the wrong location:

```
Vercel is serving from: /
Your files are actually in: /jobcy-frontend-main/.next/
Result: 404 NOT_FOUND
```

---

## ✅ **SOLUTION: Set Root Directory in Vercel Dashboard**

### **Step-by-Step Fix:**

#### **1. Go to Vercel Dashboard**
- Visit: https://vercel.com/dashboard
- Find your project: `jobcy-job-portal`
- Click on it

#### **2. Go to Settings**
- Click the **"Settings"** tab at the top
- Look for **"General"** section in the left sidebar
- Scroll down to **"Build & Development Settings"**

#### **3. Configure Root Directory**
- Find: **"Root Directory"**
- Click **"Edit"** button
- Enter: `jobcy-frontend-main`
- Click **"Save"**

**Important:** Make sure there are NO leading or trailing slashes!
- ✅ Correct: `jobcy-frontend-main`
- ❌ Wrong: `/jobcy-frontend-main/`
- ❌ Wrong: `jobcy-frontend-main/`

#### **4. Update Other Settings (Should Auto-Fill)**
After setting root directory, verify these:

- **Framework Preset:** Next.js (should auto-detect)
- **Build Command:** `npm run build` OR leave empty for auto-detect
- **Output Directory:** Leave empty (Next.js default: `.next`)
- **Install Command:** `npm install` OR leave empty for auto-detect

#### **5. Remove Root-Level vercel.json**
The root-level `vercel.json` conflicts with dashboard settings. Let's remove it:

```powershell
# In your project directory
git rm vercel.json
git commit -m "chore: remove root vercel.json, using dashboard Root Directory setting instead"
git push origin master
```

#### **6. Redeploy**
- Go back to **"Deployments"** tab
- Click **"Redeploy"** button on the latest deployment
- OR just push the commit from step 5 (triggers auto-deploy)

---

## 🎯 **WHY THIS WORKS**

### **Root Directory Setting:**
- Tells Vercel: "My app is in this subfolder"
- Vercel changes working directory BEFORE building
- All paths resolve correctly
- No need for `cd` commands in vercel.json

### **Dashboard vs. Config File:**
- Dashboard setting is cleaner
- No file conflicts
- Works with Vercel's auto-detection
- Easier to manage and update

---

## 🔧 **ALTERNATIVE: Fix Root vercel.json (If You Prefer Config File)**

If you want to keep using the config file approach, update the root `vercel.json`:

```json
{
  "buildCommand": "cd jobcy-frontend-main && npm run build",
  "installCommand": "cd jobcy-frontend-main && npm install",
  "outputDirectory": "jobcy-frontend-main/.next",
  "cleanUrls": true,
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/$1"
    }
  ]
}
```

But **I strongly recommend using the Dashboard approach** instead.

---

## 📋 **FULL RECOMMENDED STEPS**

### **What to Do Right Now:**

1. **Set Root Directory in Vercel Dashboard**
   ```
   Settings → Root Directory → jobcy-frontend-main → Save
   ```

2. **Remove Root vercel.json**
   ```powershell
   cd C:\Users\PAGADALA KARTHIK\OneDrive\Desktop\ohg_job
   git rm vercel.json
   git commit -m "chore: remove root vercel.json, use dashboard Root Directory"
   git push origin master
   ```

3. **Wait for Auto-Deploy**
   - Vercel detects push and rebuilds
   - Now uses dashboard Root Directory setting
   - Should work correctly

4. **Test Your Deployment**
   - Visit: `https://your-deployment.vercel.app/`
   - Should load homepage
   - Test all routes

---

## ⚙️ **VERIFY SETTINGS**

After configuring, your Vercel settings should show:

```
Project Settings:
├─ Root Directory: jobcy-frontend-main
├─ Framework: Next.js (auto-detected)
├─ Build Command: npm run build
├─ Output Directory: .next
└─ Install Command: npm install
```

---

## 🐛 **IF STILL GETTING 404**

### **Check 1: Environment Variables**
Make sure these are set in Vercel:
```
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
NEXT_PUBLIC_SOCKET_URL=https://your-backend.railway.app
```

### **Check 2: Deployment URL**
Use the LATEST deployment URL from Vercel dashboard.
Old deployment URLs won't reflect new configuration.

### **Check 3: Clear Browser Cache**
- Hard refresh: `Ctrl + Shift + R` (Windows)
- Or use incognito mode

### **Check 4: Check Build Logs**
Look for:
```
✓ Detected Next.js
✓ Build completed
✓ Output files found at: .next/
```

### **Check 5: Verify Root Directory Saved**
- Go back to Settings
- Confirm Root Directory shows: `jobcy-frontend-main`
- If empty, set it again

---

## 📊 **EXPECTED VS ACTUAL**

### **Before Fix (Current - 404 Error):**
```
1. Vercel looks in: /
2. Next.js files are in: /jobcy-frontend-main/.next/
3. Vercel can't find files
4. Returns: 404 NOT_FOUND
```

### **After Fix (Will Work):**
```
1. Vercel changes to: /jobcy-frontend-main/
2. Builds Next.js from there
3. Files output to: .next/ (relative to root directory)
4. Vercel serves from correct location
5. Returns: Your app! ✅
```

---

## 🎓 **UNDERSTANDING THE ISSUE**

### **Monorepo Challenge:**
```
📁 ohg_job/
  ├── 📁 jobcy-frontend-main/  ← Your Next.js app
  │   ├── package.json
  │   ├── .next/              ← Build output here
  │   └── ...
  └── vercel.json             ← Was trying to handle this
```

### **The Problem:**
- Root `vercel.json` tells Vercel to BUILD in subdirectory
- But it doesn't tell Vercel to SERVE from subdirectory
- Build succeeds ✅
- Serving fails ❌ (404)

### **The Solution:**
- Dashboard Root Directory tells Vercel: "Treat this subfolder as root"
- Vercel works inside that folder for everything
- Build AND serve work correctly ✅

---

## 🔀 **COMPARISON: Config File vs. Dashboard**

| Aspect | Root vercel.json | Dashboard Root Directory |
|--------|-----------------|-------------------------|
| **Build** | ✅ Works | ✅ Works |
| **Serve** | ❌ 404 Error | ✅ Works |
| **Simplicity** | Complex | Simple |
| **Maintenance** | Harder | Easier |
| **Conflicts** | Possible | None |
| **Recommendation** | ❌ Not recommended | ✅ **Use this!** |

---

## ✅ **SUCCESS CHECKLIST**

After applying the fix:

- [ ] Root Directory set to `jobcy-frontend-main` in dashboard
- [ ] Root `vercel.json` removed from repository
- [ ] Pushed changes to GitHub
- [ ] New deployment triggered
- [ ] Build completed successfully
- [ ] Homepage loads without 404
- [ ] All routes accessible
- [ ] No errors in browser console

---

## 🆘 **NEED IMMEDIATE FIX?**

### **Fastest Solution (5 minutes):**

1. Vercel Dashboard → Settings → Root Directory → `jobcy-frontend-main` → Save
2. Deployments → Redeploy
3. Wait 2-3 minutes
4. Test new deployment URL
5. ✅ Should work!

**No code changes needed for immediate fix!**

Then later, clean up by removing root `vercel.json`.

---

## 📞 **TROUBLESHOOTING COMMANDS**

### **Remove Root vercel.json:**
```powershell
cd C:\Users\PAGADALA KARTHIK\OneDrive\Desktop\ohg_job
git rm vercel.json
git commit -m "chore: remove root vercel.json"
git push origin master
```

### **Check Current Files:**
```powershell
ls
```
Should NOT see `vercel.json` at root (only in `jobcy-frontend-main/`)

---

## 🎉 **SUMMARY**

**Problem:** 404 error despite successful build  
**Cause:** Root directory not properly configured  
**Fix:** Set Root Directory to `jobcy-frontend-main` in Vercel Dashboard  
**Time:** 5 minutes  
**Difficulty:** Easy ⭐  

---

**Go set that Root Directory in Vercel Dashboard now! It's the missing piece! 🚀**

