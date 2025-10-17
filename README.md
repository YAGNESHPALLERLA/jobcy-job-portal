# 🚀 Jobcy - Complete Job Portal Platform

A full-stack job portal application with separate dashboards for Job Seekers, HR, Companies, and Admins. Built with Next.js, Node.js, Express, and MongoDB.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)
![Next.js](https://img.shields.io/badge/next.js-15.5.4-black.svg)

## ✨ Features

### 👤 Job Seeker Portal
- **Profile Management** - Complete profile with education, experience, skills, projects, languages
- **Job Search & Apply** - Browse and apply for jobs with filtering (Fresher/Experienced)
- **Application Tracking** - Track application status and deadlines
- **Connections** - Connect with other professionals
- **Real-time Chat** - Chat with connections using Socket.IO
- **Interview Scheduling** - View and manage interview schedules
- **Resume Upload** - Upload and manage resume

### 👔 HR Portal
- **Job Management** - Create, edit, and manage job postings
- **Application Management** - Review and update application statuses
- **Candidate Profiles** - View candidate details and download resumes
- **Dashboard Analytics** - Track job performance and application metrics
- **Status Tracking** - Manage applications through hiring pipeline

### 🏢 Company Portal
- **Company Dashboard** - View all jobs and applications across company
- **HR Team Overview** - See all HR staff members
- **Consolidated Applications** - Manage all applications company-wide
- **Statistics** - Track total jobs, applications, and hiring metrics
- **Application Status Updates** - Update candidate statuses with automatic notifications

### 👨‍💼 Admin Portal
- **User Management** - Manage all users across platform
- **HR Management** - Register HR users and link them to companies
- **Company Management** - Register companies and view their HRs/jobs/applications
- **System Statistics** - Overall platform analytics
- **Application Monitoring** - View all applications system-wide

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 15.5.4 (React 19)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Real-time:** Socket.IO Client

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcrypt
- **Real-time:** Socket.IO
- **File Upload:** Multer

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18.0.0 or higher)
- **npm** (v8.0.0 or higher)
- **MongoDB** (Atlas cloud or local installation)
- **Git**

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/jobcy.git
cd jobcy
```

### 2. Backend Setup

```bash
cd jobcy-backend-main

# Install dependencies
npm install

# Create .env file
# Copy env.example.txt to .env and fill in your values
cp env.example.txt .env

# Edit .env with your actual values:
# - MongoDB URI
# - JWT Secret (generate using: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
# - Other configuration

# Create admin user (optional)
node createAdmin.js

# Start backend server
npm start
```

Backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd jobcy-frontend-main

# Install dependencies
npm install

# Create .env.local file
# Copy env.local.example.txt to .env.local
cp env.local.example.txt .env.local

# Edit .env.local:
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000

# Start development server
npm run dev
```

Frontend will run on `http://localhost:3000`

## 🔧 Environment Variables

### Backend (`.env`)

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<database>
JWT_SECRET=<generate-secure-random-string>
JWT_EXPIRE=30d
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

### Frontend (`.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

## 📁 Project Structure

```
jobcy/
├── jobcy-backend-main/          # Backend API
│   ├── controllers/             # Route controllers
│   ├── models/                  # Mongoose models
│   ├── routes/                  # API routes
│   ├── middleware/              # Auth & role middleware
│   ├── uploads/                 # Uploaded resumes
│   ├── utils/                   # Utility functions
│   ├── server.js                # Server entry point
│   └── app.js                   # Express app configuration
│
├── jobcy-frontend-main/         # Frontend application
│   ├── src/
│   │   ├── app/                 # Next.js app directory
│   │   │   ├── user/           # Job seeker pages
│   │   │   ├── hr/             # HR pages
│   │   │   ├── company/        # Company pages
│   │   │   ├── admin/          # Admin pages
│   │   │   └── types/          # TypeScript interfaces
│   │   └── ...
│   └── public/                  # Static assets
│
└── Documentation Files          # Setup & feature guides
```

## 🎯 User Roles & Access

| Role | Login URL | Capabilities |
|------|-----------|--------------|
| **Job Seeker** | `/user/auth/login` | Browse jobs, apply, manage profile, connect & chat |
| **HR** | `/hr/auth/login` | Post jobs, manage applications, review candidates |
| **Company** | `/company/auth/login` | View all company jobs & applications |
| **Admin** | `/admin/auth/login` | Manage users, HRs, companies, system-wide control |

## 🔐 Default Admin Credentials

After running `createAdmin.js`:
- **Email:** admin@jobcy.com
- **Password:** admin123

**⚠️ Change these credentials immediately in production!**

## 📖 Documentation

Comprehensive guides included:
- `COMPANY_PORTAL_GUIDE.md` - Complete company portal system guide
- `DATA_STORAGE_VERIFICATION.md` - Database schema and data flow
- `ENV_SETUP_GUIDE.md` - Detailed environment setup instructions
- `QUICK_START_MONGODB_ATLAS.md` - MongoDB Atlas setup guide
- `START_MONGODB_GUIDE.md` - MongoDB setup options
- `COMPANY_PORTAL_IMPLEMENTATION_SUMMARY.md` - Feature implementation reference

## 🚀 Quick Start Guide

### For Development

1. **Start MongoDB** (if using local)
2. **Start Backend:**
   ```bash
   cd jobcy-backend-main && npm start
   ```
3. **Start Frontend:**
   ```bash
   cd jobcy-frontend-main && npm run dev
   ```
4. **Access Application:** `http://localhost:3000`

### First Time Setup

1. **Create Admin Account:**
   ```bash
   cd jobcy-backend-main
   node createAdmin.js
   ```

2. **Login as Admin** → Register Companies → Create HR Users

3. **HR Users** → Post Jobs

4. **Job Seekers** → Register → Apply for Jobs

## 🌟 Key Features

### Connection & Chat System
- Send/receive connection requests
- Accept/reject connections
- Real-time chat with Socket.IO
- Connection status tracking

### Job Management
- Career level filtering (Fresher/Experienced)
- Application deadlines
- Status tracking (Applied, Under Review, Interview, Accepted, Rejected)
- Automatic notifications on status changes

### Company System
- HR users linked to companies via `companyId`
- Companies see all jobs from their HR staff
- Consolidated application management
- Company-wide statistics

### Application Pipeline
```
Applied → Under Review → Interview → Accepted/Rejected
```

## 📡 API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - Unified login (user/hr/admin)
- `POST /api/auth/login-company` - Company login
- `POST /api/admin/create-hr` - Admin creates HR user

### Jobs
- `GET /api/jobs` - Get all jobs (admin)
- `GET /api/jobs/browse` - Browse jobs (users)
- `GET /api/hr/jobs` - HR's jobs
- `POST /api/hr/jobs` - Create job
- `PUT /api/hr/jobs/:id` - Update job
- `DELETE /api/hr/jobs/:id` - Delete job

### Applications
- `POST /api/jobs/apply/:jobId` - Apply for job
- `GET /api/jobs/my-applications` - User's applications
- `GET /api/hr/applications` - HR's applications
- `PUT /api/hr/applications/:id/status` - Update status

### Company Portal
- `GET /api/company/dashboard` - Company statistics
- `GET /api/company/jobs` - All company jobs
- `GET /api/company/applications` - All company applications
- `PUT /api/company/applications/:id/status` - Update application status

### Connections & Chat
- `POST /api/connections/send` - Send connection request
- `GET /api/connections/received` - Get received requests
- `POST /api/connections/accept/:id` - Accept request
- `POST /api/connections/reject/:id` - Reject request
- `POST /api/chat/create` - Create/get chat
- `GET /api/chat/:chatId/messages` - Get messages

## 🔌 Socket.IO Events

### Chat Events
- `join-chat` - Join a chat room
- `send-message` - Send a message
- `receive-message` - Receive a message
- `typing` - User is typing
- `stop-typing` - User stopped typing

## 🗄️ Database Models

### User
- Personal information
- Professional details
- Skills, education, experience
- Languages, projects
- Notifications
- Connection to Company (for HRs)

### Company
- Company profile
- Authentication credentials
- Industry, location, size
- Status tracking

### Job
- Job details
- Requirements & qualifications
- Career level (Fresher/Experienced)
- Application deadline
- Posted by HR user

### Application
- Job reference
- User reference
- Status tracking
- Applied date
- Resume attachment

### Experience
- Separate collection for experience tracking
- Also stored in User.experienceList

### Education
- Embedded in User model

### Connection Request
- Sender/receiver references
- Status (pending/accepted/rejected)
- Timestamps

### Chat & Message
- Chat rooms between users
- Message history
- Real-time delivery

## 🎨 UI/UX Features

- **Dark Mode Support** - Toggle between light/dark themes
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Modern Gradients** - Beautiful color schemes
- **Animations** - Smooth transitions and loading states
- **Real-time Updates** - Live chat and notifications
- **Filter & Search** - Advanced filtering for jobs and users
- **Status Badges** - Color-coded status indicators

## 🔒 Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Role-based access control (RBAC)
- ✅ Protected routes and endpoints
- ✅ Input validation
- ✅ CORS configuration
- ✅ Secure file upload handling
- ✅ Token expiration

## 📦 Dependencies

### Backend Main Dependencies
- express - Web framework
- mongoose - MongoDB ODM
- jsonwebtoken - JWT authentication
- bcryptjs - Password hashing
- socket.io - Real-time communication
- multer - File upload handling
- cors - CORS middleware
- dotenv - Environment variables

### Frontend Main Dependencies
- next - React framework
- react - UI library
- typescript - Type safety
- tailwindcss - Utility-first CSS
- lucide-react - Icon library
- socket.io-client - Real-time client

## 🧪 Testing the Application

### Test User Flows

1. **Job Seeker Flow:**
   - Register at `/user/auth/signup`
   - Complete profile
   - Browse and apply for jobs
   - Connect with other users
   - Chat with connections

2. **HR Flow:**
   - Login at `/hr/auth/login` (created by admin)
   - Post jobs with requirements
   - Review applications
   - Update candidate statuses

3. **Company Flow:**
   - Login at `/company/auth/login`
   - View all company jobs
   - Manage applications
   - Track hiring metrics

4. **Admin Flow:**
   - Login at `/admin/auth/login`
   - Register companies
   - Create HR users linked to companies
   - Monitor entire system

## 🐛 Troubleshooting

### Common Issues

**Backend won't start:**
- Check MongoDB connection string in `.env`
- Ensure MongoDB is running
- Verify port 5000 is not in use

**Frontend build errors:**
- Run `npm install` to ensure all dependencies are installed
- Check `.env.local` file exists with correct values
- Clear `.next` folder and rebuild

**403 Forbidden errors:**
- Logout and login again to refresh token
- Verify user role is correct in database
- Check backend console logs for role verification

**Data not saving:**
- Check backend console for save logs
- Verify all required fields are filled
- Check MongoDB connection

**Chat not working:**
- Ensure Socket.IO URL is correct in `.env.local`
- Check if backend Socket.IO server is running
- Verify both users are connected

## 📝 API Documentation

For complete API documentation, see:
- Endpoint definitions in route files
- Controller implementations
- Model schemas

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- **Your Name** - Initial work

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- MongoDB for flexible database solution
- Socket.IO for real-time capabilities

## 📞 Support

For support, email support@jobcy.com or open an issue in the GitHub repository.

## 🗺️ Roadmap

- [ ] Email notifications
- [ ] Advanced analytics dashboard
- [ ] Video interview integration
- [ ] AI-powered candidate matching
- [ ] Mobile app (React Native)
- [ ] Payment gateway for premium features
- [ ] Advanced search with Elasticsearch
- [ ] Microservices architecture

## 🌐 Live Demo

Coming soon...

## 📊 Screenshots

Coming soon...

---

**Built with ❤️ using Next.js and Node.js**

