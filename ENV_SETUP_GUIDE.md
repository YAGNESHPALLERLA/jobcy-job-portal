# Environment Variables Setup Guide

## 🔧 Backend Configuration

Create a file named `.env` in the `jobcy-backend-main` directory with the following content:

```env
# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/jobcy_db

# JWT Secret Key (Change this in production!)
JWT_SECRET=your_jwt_secret_key_here_change_this_in_production_12345

# Server Port
PORT=5000

# Node Environment
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Socket.IO Settings
SOCKET_IO_PORT=5000
```

### Steps to Create Backend .env File:

1. Navigate to the backend directory:
   ```bash
   cd jobcy-backend-main
   ```

2. Create the .env file:
   ```bash
   # On Windows (PowerShell):
   New-Item -Path ".env" -ItemType File -Force
   
   # Or use any text editor:
   notepad .env
   ```

3. Copy the environment variables above into the file

4. Save and close the file

---

## 🌐 Frontend Configuration

Create a file named `.env.local` in the `jobcy-frontend-main` directory with the following content:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Backend Socket.IO URL (without /api path)
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000

# Node Environment
NODE_ENV=development
```

### Steps to Create Frontend .env.local File:

1. Navigate to the frontend directory:
   ```bash
   cd jobcy-frontend-main
   ```

2. Create the .env.local file:
   ```bash
   # On Windows (PowerShell):
   New-Item -Path ".env.local" -ItemType File -Force
   
   # Or use any text editor:
   notepad .env.local
   ```

3. Copy the environment variables above into the file

4. Save and close the file

---

## 🚀 Quick Setup Commands

Run these commands in PowerShell to create both files quickly:

### Backend .env:
```powershell
cd jobcy-backend-main
@"
MONGO_URI=mongodb://localhost:27017/jobcy_db
JWT_SECRET=your_jwt_secret_key_here_change_this_in_production_12345
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
SOCKET_IO_PORT=5000
"@ | Out-File -FilePath ".env" -Encoding UTF8
```

### Frontend .env.local:
```powershell
cd ..\jobcy-frontend-main
@"
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
NODE_ENV=development
"@ | Out-File -FilePath ".env.local" -Encoding UTF8
```

---

## ✅ Verification

After creating both files, verify they exist:

```bash
# Check backend .env
cd jobcy-backend-main
Get-Content .env

# Check frontend .env.local
cd ..\jobcy-frontend-main
Get-Content .env.local
```

---

## 🔄 Restart Servers

After creating the environment files, restart both servers:

### Backend:
```bash
cd jobcy-backend-main
npm run dev
```

### Frontend:
```bash
cd jobcy-frontend-main
npm run dev
```

---

## 📝 Important Notes

1. **Never commit .env files to Git** - They contain sensitive information
2. **Different environments need different values** - Update URLs for production
3. **NEXT_PUBLIC_ prefix** - Required for Next.js to expose variables to the browser
4. **Restart required** - Changes to .env files require server restart
5. **CORS settings** - Make sure FRONTEND_URL matches your frontend URL

---

## 🐛 Troubleshooting

### If backend can't connect to MongoDB:
- Make sure MongoDB is running
- Check if MONGO_URI is correct
- Try: `mongodb://127.0.0.1:27017/jobcy_db` instead

### If frontend can't connect to backend:
- Verify backend is running on port 5000
- Check if NEXT_PUBLIC_API_URL is correct
- Clear browser cache and restart frontend

### If Socket.IO doesn't connect:
- Verify NEXT_PUBLIC_SOCKET_URL is set correctly
- Check browser console for connection errors
- Make sure backend Socket.IO server is running

