# 🔧 MongoDB Connection Issue - Quick Fix Guide

## ❌ Current Issue

```
MongoDB connection failed: connect ECONNREFUSED ::1:27017
```

**This means:** MongoDB is not running on your system.

---

## ✅ Solution: Start MongoDB

### Option 1: Start MongoDB as a Windows Service (Recommended)

```powershell
# Open PowerShell as Administrator and run:
net start MongoDB
```

### Option 2: Start MongoDB Manually

```powershell
# Navigate to MongoDB bin directory (adjust path if different):
cd "C:\Program Files\MongoDB\Server\7.0\bin"

# Start MongoDB:
.\mongod.exe --dbpath "C:\data\db"
```

### Option 3: Check if MongoDB is Installed

```powershell
# Check MongoDB service status:
Get-Service MongoDB

# If MongoDB is not installed, download it from:
# https://www.mongodb.com/try/download/community
```

---

## 🔍 Verify MongoDB is Running

After starting MongoDB, verify it's working:

```powershell
# Check if MongoDB is listening on port 27017:
netstat -an | findstr :27017

# You should see:
# TCP    0.0.0.0:27017          0.0.0.0:0              LISTENING
```

---

## 🚀 Restart Your Backend

After MongoDB is running, restart your backend:

```bash
# In jobcy-backend-main directory:
npm start
```

**You should now see:**
```
✅ MongoDB connected
✅ Server running on port 5000
✅ Socket.IO server ready
```

---

## 🐛 Troubleshooting

### Issue: "MongoDB service not found"

**Solution:** MongoDB is not installed. Install it from:
- https://www.mongodb.com/try/download/community
- Download the Community Edition
- Run the installer
- Choose "Complete" installation
- Install as a Windows Service

### Issue: "Access Denied" when starting service

**Solution:** Open PowerShell as Administrator:
- Right-click PowerShell
- Select "Run as Administrator"
- Then run: `net start MongoDB`

### Issue: MongoDB installed but won't start

**Solution:** Create the data directory:
```powershell
# Create data directory:
mkdir C:\data\db

# Start MongoDB with this path:
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath "C:\data\db"
```

### Issue: Still getting connection errors

**Solution:** Update the MongoDB URI in `.env`:
```env
# Try this instead:
MONGO_URI=mongodb://127.0.0.1:27017/jobcy_db

# Or if that doesn't work:
MONGO_URI=mongodb://localhost:27017/jobcy_db
```

---

## 📱 Alternative: Use MongoDB Atlas (Cloud)

If you don't want to install MongoDB locally, use MongoDB Atlas (free cloud database):

1. **Sign up:** https://www.mongodb.com/cloud/atlas
2. **Create a free cluster**
3. **Get connection string**
4. **Update `.env` in backend:**
   ```env
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/jobcy_db?retryWrites=true&w=majority
   ```

---

## ✅ Quick Setup Commands

### Windows (PowerShell as Administrator):

```powershell
# Start MongoDB service
net start MongoDB

# Check if running
Get-Service MongoDB

# Check port
netstat -an | findstr :27017
```

### Restart Backend After MongoDB Starts:

```bash
cd C:\Users\PAGADALA KARTHIK\OneDrive\Desktop\ohg_job\jobcy-backend-main
npm start
```

---

## 🎯 Expected Output When Working

```
✅ MongoDB connected
✅ Server running on port 5000
✅ Socket.IO server ready
```

**No more connection errors!**

---

## 💡 Pro Tip

To avoid this in the future, set MongoDB to start automatically:

```powershell
# Set MongoDB service to start automatically:
Set-Service -Name MongoDB -StartupType Automatic
```

Now MongoDB will start whenever Windows starts!

