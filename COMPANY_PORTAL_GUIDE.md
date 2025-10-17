# Company Portal System - Complete Guide

## Overview

The Company Portal is a complete system that allows companies to:
- View all jobs posted by their HR staff
- See all applications received for those jobs
- Manage application statuses (Under Review, Interview, Accepted, Rejected)
- Track recruitment statistics and analytics

## System Architecture

### Database Models

1. **Company Model** (`jobcy-backend-main/models/Company.js`)
   - Stores company credentials and profile information
   - Companies can log in to access their dedicated dashboard
   - Fields: name, email, password, industry, location, website, description, size, status

2. **User Model** (`jobcy-backend-main/models/User.js`)
   - HR users can be linked to companies via `companyId` field
   - When HR posts jobs, those jobs are associated with their company
   - Fields: name, email, password, role, company (legacy), companyId (new)

3. **Job Model** (`jobcy-backend-main/models/Job.js`)
   - Jobs are posted by HR users
   - Each job has a `postedBy` field linking to the HR user
   - Through the HR's `companyId`, we can trace which company a job belongs to

4. **Application Model** (`jobcy-backend-main/models/Application.js`)
   - Applications are linked to jobs via `jobId`
   - Through the job → HR → company chain, we can find all applications for a company

### Backend Components

1. **Company Dashboard Controller** (`jobcy-backend-main/controllers/companyDashboardController.js`)
   - `getCompanyDashboard`: Returns statistics (total HRs, jobs, applications, etc.)
   - `getCompanyJobs`: Returns all jobs posted by the company's HR staff
   - `getCompanyApplications`: Returns all applications for the company's jobs
   - `updateCompanyApplicationStatus`: Allows companies to update application statuses

2. **Company Dashboard Routes** (`jobcy-backend-main/routes/companyDashboardRoutes.js`)
   - `/api/company/dashboard` - GET company statistics
   - `/api/company/jobs` - GET all company jobs
   - `/api/company/applications` - GET all applications
   - `/api/company/applications/:id/status` - PUT update application status

3. **Auth Controller Updates** (`jobcy-backend-main/controllers/authController.js`)
   - `registerHR`: Now accepts `companyId` to link HR users to companies
   - `loginCompany`: Allows companies to log in with their credentials

4. **Auth Middleware Updates** (`jobcy-backend-main/middleware/authMiddleware.js`)
   - `protect`: Now checks both User and Company models for authentication
   - Enables companies to use protected routes

### Frontend Components

1. **Company Dashboard** (`jobcy-frontend-main/src/app/company/dashboard/page.tsx`)
   - Three main tabs:
     - **Overview**: Shows statistics and HR team members
     - **Jobs**: Lists all jobs posted by company's HR staff
     - **Applications**: Shows all applications with status management

2. **Company Login** (`jobcy-frontend-main/src/app/company/auth/login/page.tsx`)
   - Dedicated login page for companies
   - Uses `/api/auth/login-company` endpoint

3. **Admin HR Management** (`jobcy-frontend-main/src/app/admin/hr-management/page.tsx`)
   - Updated to include company selection dropdown
   - When creating HR users, admins can link them to registered companies
   - HR users can be linked to companies via `companyId`

## User Workflow

### For Admins

1. **Register a Company**
   - Navigate to Admin Dashboard → Company Management
   - Click "Register New Company"
   - Fill in company details (name, email, password, etc.)
   - Company is created and can now log in

2. **Create HR Users and Link to Company**
   - Navigate to Admin Dashboard → HR Management
   - Click "Create New HR User"
   - Fill in HR details
   - Select a registered company from the dropdown (or enter manually)
   - HR user is created and linked to the company via `companyId`

### For Companies

1. **Login**
   - Navigate to `/company/auth/login`
   - Enter company email and password
   - Access company dashboard

2. **View Dashboard**
   - See statistics: Total HRs, Total Jobs, Applications, etc.
   - View list of HR team members

3. **Manage Jobs**
   - Navigate to "Jobs" tab
   - See all jobs posted by company's HR staff
   - View job details, applicant counts, and posting dates

4. **Manage Applications**
   - Navigate to "Applications" tab
   - See all applications for company's jobs
   - View candidate details: name, email, phone, location, skills
   - Download resumes
   - Update application status:
     - Applied → Under Review
     - Under Review → Interview
     - Interview → Accepted/Rejected
   - Candidates receive notifications when status changes

### For HR Users

1. **Post Jobs**
   - HR users post jobs as usual through HR Dashboard
   - Jobs are automatically associated with their company (via `companyId`)

2. **Company Visibility**
   - All jobs posted by HR users are visible to their company
   - Company can see applications for these jobs

## Data Flow

### Job Posting Flow
```
HR User (with companyId) → Posts Job → Job.postedBy = HR User ID
                                      ↓
                            Company can query:
                            Jobs where postedBy.companyId = Company ID
```

### Application Flow
```
User applies to Job → Application.jobId = Job ID
                                      ↓
                            Company can query:
                            1. Find all HR users with companyId = Company ID
                            2. Find all jobs where postedBy = HR User IDs
                            3. Find all applications where jobId = Job IDs
```

### Application Status Update
```
Company updates status → Application.status = new status
                                      ↓
                            Notification created for candidate
                            User sees status change in their dashboard
```

## API Endpoints

### Company Dashboard Endpoints

```
GET /api/company/dashboard
- Returns: Company stats (HRs, jobs, applications, etc.)
- Auth: Required (Company login)
```

```
GET /api/company/jobs
- Returns: All jobs posted by company's HR staff
- Auth: Required (Company login)
```

```
GET /api/company/applications
- Returns: All applications for company's jobs
- Auth: Required (Company login)
- Includes: Candidate details, job details, application status
```

```
PUT /api/company/applications/:id/status
- Body: { status: "Under Review" | "Interview" | "Accepted" | "Rejected" }
- Returns: Updated application
- Auth: Required (Company login)
- Side Effect: Creates notification for candidate
```

### Auth Endpoints

```
POST /api/auth/login-company
- Body: { email, password }
- Returns: { token, user: { id, name, email, role: "admin" } }
```

```
POST /api/admin/create-hr
- Body: { name, email, password, company: { name, ... }, companyId }
- Returns: { message, hr }
- Auth: Required (Admin)
- Note: companyId links HR to company
```

## Environment Variables

### Backend (`.env`)
```
PORT=5000
MONGO_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
JWT_EXPIRE=30d
FRONTEND_URL=http://localhost:3000
```

### Frontend (`.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

## Security Considerations

1. **Authentication**
   - Companies authenticate via JWT tokens
   - Tokens are validated on every request
   - Middleware checks both User and Company models

2. **Authorization**
   - Companies can only see jobs from their own HR staff
   - Companies can only update applications for their own jobs
   - Company ID is extracted from authenticated token

3. **Data Isolation**
   - Each company sees only their own data
   - HR users are linked to companies via `companyId`
   - Database queries filter by company relationships

## Database Queries

### Finding Company's HR Users
```javascript
const companyHRs = await User.find({ 
  companyId: companyId,
  role: "hr" 
});
```

### Finding Company's Jobs
```javascript
const hrIds = companyHRs.map(hr => hr._id);
const jobs = await Job.find({ 
  postedBy: { $in: hrIds } 
});
```

### Finding Company's Applications
```javascript
const jobIds = jobs.map(job => job._id);
const applications = await Application.find({ 
  jobId: { $in: jobIds } 
})
.populate("userId", "name email mobile currentLocation skills resume")
.populate("jobId", "title company location salary type");
```

## Testing the System

### Step 1: Create a Company (as Admin)
1. Login as admin
2. Go to Company Management
3. Register a new company (e.g., "TechCorp", "techcorp@example.com", "password123")

### Step 2: Create HR User (as Admin)
1. Go to HR Management
2. Create new HR user
3. Select "TechCorp" from company dropdown
4. Fill in HR details
5. HR user is now linked to TechCorp

### Step 3: HR Posts Jobs
1. Login as the HR user
2. Go to Jobs Management
3. Post a few jobs
4. Jobs are automatically associated with TechCorp

### Step 4: Company Views Jobs
1. Logout and login as TechCorp (company@example.com)
2. Navigate to `/company/dashboard`
3. Click "Jobs" tab
4. See all jobs posted by TechCorp's HR staff

### Step 5: Users Apply to Jobs
1. Login as job seekers
2. Apply to TechCorp's jobs

### Step 6: Company Manages Applications
1. Login as TechCorp
2. Click "Applications" tab
3. See all applications
4. Update statuses (Under Review, Interview, Accept, Reject)
5. Download candidate resumes

## Troubleshooting

### Issue: Company can't see any jobs
**Solution**: 
- Verify HR users have `companyId` field set
- Check that jobs were posted by HR users with `companyId`
- Verify company ID in token matches HR's `companyId`

### Issue: Applications not showing
**Solution**:
- Verify applications exist for the jobs
- Check that job's `postedBy` field links to HR with correct `companyId`
- Check console for any query errors

### Issue: Can't update application status
**Solution**:
- Verify company is authenticated
- Check that application belongs to company's jobs
- Verify status value is valid enum

### Issue: HR creation fails when selecting company
**Solution**:
- Verify company dropdown is populated (check browser console)
- Verify backend `/api/admin/companies` endpoint is working
- Check that `companyId` is being sent in request payload

## Future Enhancements

1. **Analytics Dashboard**
   - Hiring pipeline visualization
   - Time-to-hire metrics
   - Application conversion rates
   - HR performance metrics

2. **Interview Scheduling**
   - Built-in calendar for scheduling interviews
   - Automatic email notifications to candidates
   - Interview feedback collection

3. **Candidate Communication**
   - Built-in messaging system
   - Bulk email to applicants
   - Template messages for common scenarios

4. **Advanced Filtering**
   - Filter applications by status, job, date
   - Search candidates by skills, location
   - Save filter presets

5. **Reporting**
   - Export applications to CSV/Excel
   - Generate hiring reports
   - Compliance and diversity tracking

## Support

For issues or questions about the Company Portal system:
1. Check this documentation first
2. Review console logs for errors
3. Verify database relationships (User.companyId → Company._id)
4. Check network requests in browser DevTools
5. Verify environment variables are correctly set

