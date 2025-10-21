# Railway Service Unavailable Fix

## Problem
Railway deployment shows "service unavailable" during healthcheck, indicating the server isn't starting properly or isn't accessible.

## Root Causes Identified

### 1. Database Connection Issues
- **Issue**: Using `MONGO_URI` instead of `MONGODB_URI` (Railway standard)
- **Fix**: Updated to support both environment variables

### 2. Server Binding Issues
- **Issue**: Server might not be binding to correct interface
- **Fix**: Explicitly bind to `0.0.0.0` for Railway

### 3. Startup Timing Issues
- **Issue**: Healthcheck starts before server is fully ready
- **Fix**: Added startup delays and better logging

## Solutions Applied

### 1. Enhanced Database Connection
```javascript
// Now supports both MONGODB_URI and MONGO_URI
const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

// Added connection options for Railway
await mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
```

### 2. Improved Server Startup
```javascript
// Added comprehensive startup logging
console.log("🚀 Starting server...");
console.log("🌍 Environment:", process.env.NODE_ENV || "development");
console.log("🔗 Connecting to database...");

// Explicit binding to 0.0.0.0
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Server bound to 0.0.0.0:${PORT} (accessible from outside)`);
});
```

### 3. Enhanced Error Handling
```javascript
// Better error messages for debugging
try {
  await connectDB();
  console.log("✅ Database connected successfully");
} catch (error) {
  console.error("❌ Failed to start server:", error.message);
  console.error("🔍 Full error:", error);
  process.exit(1);
}
```

### 4. Updated Railway Configuration
```json
{
  "deploy": {
    "startCommand": "cd jobcy-backend-main && npm start",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 300,
    "healthcheckInterval": 10,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

## Required Environment Variables

### For Railway Deployment:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://your-frontend-url.vercel.app
```

### Alternative (if MONGODB_URI not available):
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
```

## Testing Locally

### 1. Test Database Connection:
```bash
cd jobcy-backend-main
node -e "require('dotenv').config(); require('./config/db')()"
```

### 2. Test Server Startup:
```bash
cd jobcy-backend-main
npm start
```

### 3. Test Health Check:
```bash
# In another terminal
curl http://localhost:3001/health
```

### 4. Use Test Script:
```bash
cd jobcy-backend-main
node test-health.js
```

## Railway Deployment Steps

### 1. Set Environment Variables in Railway:
- Go to your Railway service dashboard
- Navigate to "Variables" tab
- Add all required environment variables
- **Important**: Use `MONGODB_URI` (not `MONGO_URI`)

### 2. Verify Service Configuration:
- Root Directory: `jobcy-backend-main`
- Build Command: `npm install`
- Start Command: `npm start`

### 3. Monitor Deployment:
- Check Railway logs for startup messages
- Look for database connection success
- Verify server binding to 0.0.0.0

## Expected Log Output

### Successful Startup:
```
🚀 Starting server...
🌍 Environment: production
🔗 Connecting to MongoDB...
📍 URI: mongodb+srv://***:***@cluster.mongodb.net/database
✅ MongoDB connected successfully
🌍 Database: jobcy-portal
✅ Database connected successfully
🚀 Server running on port 3001
🔌 Socket.IO server ready
🌍 Environment: production
📊 Health check available at: http://localhost:3001/health
🌐 Server bound to 0.0.0.0:3001 (accessible from outside)
✅ Server is fully ready and accepting connections
```

## Troubleshooting

### If Still Getting "Service Unavailable":

1. **Check Railway Logs**:
   - Look for database connection errors
   - Check for server binding issues
   - Verify environment variables are set

2. **Common Issues**:
   - **Missing MONGODB_URI**: Server exits during startup
   - **Database Connection Failed**: Check MongoDB URI format
   - **Port Binding Issues**: Server not accessible from outside
   - **Environment Variables**: Missing or incorrect values

3. **Debug Steps**:
   ```bash
   # Test locally with Railway environment
   export MONGODB_URI="your-mongodb-uri"
   export NODE_ENV="production"
   export PORT="3001"
   cd jobcy-backend-main
   npm start
   ```

## Files Modified

- `jobcy-backend-main/config/db.js` - Enhanced database connection
- `jobcy-backend-main/server.js` - Improved server startup
- `jobcy-backend-main/test-health.js` - Health check test script
- `railway.json` - Updated Railway configuration
- `jobcy-backend-main/railway.json` - Updated Railway configuration

## Next Steps

1. **Commit and push changes**
2. **Redeploy on Railway**
3. **Check Railway logs for successful startup**
4. **Verify health check endpoint works**
5. **Test API endpoints**

The deployment should now succeed with proper database connection and server startup! 🚀
