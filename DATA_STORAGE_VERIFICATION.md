# Data Storage Verification Guide

## Overview

This document explains how ALL user data is stored in the MongoDB database and how to verify that data is being saved correctly.

## User Model Schema - Complete Field List

### Basic Information
```javascript
{
  name: String (required),
  email: String (required, unique),
  mobile: Number,
  password: String (required, hashed),
  role: String (enum: "user", "hr", "admin"),
  professionalRole: String, // e.g., "UI Developer"
  title: String,
  bio: String,
  currentLocation: String,
  currentCTC: Number,
  careerStatus: String (enum: "fresher", "experienced"),
}
```

### Company Information (for HR users)
```javascript
{
  company: {
    name: String,
    location: String,
    description: String,
    website: String,
  },
  companyId: ObjectId (ref: "Company"), // Links HR to Company model
}
```

### Skills (Array of Strings)
```javascript
{
  skills: [
    "JavaScript",
    "React",
    "Node.js",
    ...
  ]
}
```

### Languages (Array of Objects)
```javascript
{
  languages: [
    {
      name: "English",
      proficiency: "Fluent"
    },
    {
      name: "Hindi",
      proficiency: "Native"
    }
  ]
}
```

### Education (Array of Objects)
```javascript
{
  education: [
    {
      id: String, // Unique identifier
      institution: "MIT",
      degree: "Bachelor's",
      fieldOfStudy: "Computer Science",
      startDate: "2018-08",
      endDate: "2022-05",
      grade: "3.8 GPA"
    }
  ]
}
```

### Experience List (Array of Objects)
```javascript
{
  experienceList: [
    {
      id: String, // Unique identifier
      position: "Senior Developer",
      company: "TechCorp",
      location: "New York",
      startDate: "2022-06",
      endDate: "2024-01",
      current: false,
      description: "Led development of key features..."
    }
  ]
}
```

### Projects (Array of Objects)
```javascript
{
  projects: [
    {
      title: "E-commerce Platform",
      description: "Built a full-stack e-commerce solution",
      link: "https://github.com/user/project",
      technologies: ["React", "Node.js", "MongoDB"]
    }
  ]
}
```

### Personal Details (Array with single object)
```javascript
{
  personalDetails: [
    {
      dob: Date, // Date of Birth
      gender: "Male" | "Female" | "Other" | "Prefer not to say",
      category: "General" | "OBC" | "SC" | "ST" | "Other",
      maritalStatus: "Single" | "Married" | "Divorced" | "Widowed",
      nationality: "Indian"
    }
  ]
}
```

### Additional Fields
```javascript
{
  resume: String, // File path to uploaded resume
  profileCompletion: Number (0-100),
  connections: Number,
  notifications: [
    {
      type: String (enum: "application_status", "interview_scheduled", "job_update"),
      title: String,
      message: String,
      relatedJob: ObjectId (ref: "Job"),
      isRead: Boolean,
      createdAt: Date
    }
  ],
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

## How Data Flows to Database

### 1. Profile Edit Modal Flow

```
User fills form → handleSave() called → onSave prop triggered →
updateProfile() in useDashboardData → 
PUT /api/user/me → userController.updateUserProfile() → 
MongoDB User.save()
```

### 2. Experience Management (Separate API)

```
User adds experience → addExperience() → 
POST /api/experience → experienceController.addExperience() →
Creates Experience model + Updates User.experienceList
```

### 3. Education Management (Embedded in Profile)

```
User adds education → Stored in local state → 
handleSave() → education array sent in profile update →
Saved to User.education field
```

## Data Storage Validation

### Backend Logging

The backend now logs when profile is updated:

```javascript
📝 Updating user profile with data: {
  name: "John Doe",
  skills: 5,
  languages: 2,
  education: 3,
  experienceList: 2,
  projects: 1,
  personalDetails: 1
}

✅ User profile saved successfully
📊 Saved data counts: {
  skills: 5,
  languages: 2,
  education: 3,
  experienceList: 2,
  projects: 1,
  personalDetails: 1
}
```

### Verify Data in MongoDB

You can verify data storage using MongoDB Compass or shell:

```javascript
// Find a specific user
db.users.findOne({ email: "user@example.com" })

// Check if all fields are present
db.users.findOne(
  { email: "user@example.com" },
  {
    name: 1,
    email: 1,
    skills: 1,
    languages: 1,
    education: 1,
    experienceList: 1,
    projects: 1,
    personalDetails: 1,
    professionalRole: 1,
    currentLocation: 1,
    currentCTC: 1,
    bio: 1
  }
)
```

## What Gets Saved From Each Section

### Personal Information Section
- ✅ `name` - User's full name
- ✅ `email` - Email address
- ✅ `mobile` - Phone number
- ✅ `professionalRole` - Job title/role
- ✅ `currentLocation` - City/location
- ✅ `currentCTC` - Current salary
- ✅ `bio` - Professional bio

### Education Section
- ✅ `education` array with:
  - `id` - Unique identifier
  - `institution` - College/university name
  - `degree` - Degree type (Bachelor's, Master's, etc.)
  - `fieldOfStudy` - Major/field
  - `startDate` - Start date
  - `endDate` - End date (or empty if current)
  - `grade` - GPA/percentage

### Experience Section
- ✅ `experienceList` array with:
  - `id` - Unique identifier
  - `position` - Job title
  - `company` - Company name
  - `location` - Work location
  - `startDate` - Start date
  - `endDate` - End date
  - `current` - Boolean (still working there)
  - `description` - Job description

**Note:** Experience also saved via separate Experience model (MongoDB collection)

### Projects Section
- ✅ `projects` array with:
  - `title` - Project name
  - `description` - Project description
  - `link` - GitHub/demo link
  - `technologies` - Array of technologies used

### Skills Section
- ✅ `skills` - Array of skill names (strings)

### Languages Section
- ✅ `languages` array with:
  - `name` - Language name
  - `proficiency` - Proficiency level

### Details Section
- ✅ `personalDetails` array (first element) with:
  - `dob` - Date of birth
  - `gender` - Gender
  - `category` - Social category
  - `maritalStatus` - Marital status
  - `nationality` - Nationality

## Important Notes

### ✅ Array Fields Use `!== undefined` Check

Changed from `if (field)` to `if (field !== undefined)` to allow empty arrays to be saved:

```javascript
// Before (Wrong - empty arrays wouldn't be saved)
if (skills) user.skills = skills;

// After (Correct - empty arrays ARE saved)
if (skills !== undefined) user.skills = skills;
```

This ensures:
- ✅ Empty arrays are saved (user deletes all skills → `skills: []`)
- ✅ Null/undefined means "don't update"
- ✅ Explicit updates always work

### ✅ Personal Details as Array

Personal details is an array with a single object:
```javascript
personalDetails: [
  {
    dob: "1995-05-15",
    gender: "Male",
    category: "General",
    maritalStatus: "Single",
    nationality: "Indian"
  }
]
```

Individual field updates merge into `personalDetails[0]`.

### ✅ ID Fields for List Items

All list items have an `id` field for proper React key handling and updates:
- Education items: `id` field
- Experience items: `id` field  
- Projects: Index-based (consider adding `id`)
- Skills: String values (no ID needed)
- Languages: Index-based (consider adding `id`)

## Testing Data Storage

### Step 1: Fill Out Complete Profile

1. Login as user
2. Go to Profile tab
3. Click "Edit Profile"
4. Fill out ALL sections:
   - Personal Information
   - Education (add 2-3 entries)
   - Experience (add 2-3 entries)
   - Projects (add 1-2)
   - Skills (add 5-10)
   - Languages (add 2-3)
   - Details (gender, dob, etc.)
5. Click "Save Changes"

### Step 2: Check Backend Console

You should see:
```
📝 Updating user profile with data: {
  name: "John Doe",
  skills: 7,
  languages: 2,
  education: 2,
  experienceList: 3,
  projects: 1,
  personalDetails: 1
}
✅ User profile saved successfully
📊 Saved data counts: {
  skills: 7,
  languages: 2,
  education: 2,
  experienceList: 3,
  projects: 1,
  personalDetails: 1
}
```

### Step 3: Verify in MongoDB

Using MongoDB Compass or shell:

```javascript
db.users.findOne(
  { email: "user@example.com" },
  {
    name: 1,
    skills: 1,
    languages: 1,
    education: 1,
    experienceList: 1,
    projects: 1,
    personalDetails: 1
  }
)
```

Expected output:
```json
{
  "_id": "ObjectId(...)",
  "name": "John Doe",
  "skills": ["JavaScript", "React", "Node.js", ...],
  "languages": [
    { "name": "English", "proficiency": "Fluent" },
    { "name": "Hindi", "proficiency": "Native" }
  ],
  "education": [
    {
      "id": "1234567890",
      "institution": "MIT",
      "degree": "Bachelor's",
      "fieldOfStudy": "Computer Science",
      "startDate": "2018-08",
      "endDate": "2022-05",
      "grade": "3.8"
    }
  ],
  "experienceList": [
    {
      "id": "9876543210",
      "position": "Senior Developer",
      "company": "TechCorp",
      "location": "New York",
      "startDate": "2022-06",
      "endDate": "2024-01",
      "current": false,
      "description": "Led development..."
    }
  ],
  "projects": [
    {
      "title": "E-commerce Platform",
      "description": "Built full-stack solution",
      "link": "https://github.com/...",
      "technologies": ["React", "Node.js"]
    }
  ],
  "personalDetails": [
    {
      "dob": "1995-05-15T00:00:00.000Z",
      "gender": "Male",
      "category": "General",
      "maritalStatus": "Single",
      "nationality": "Indian"
    }
  ]
}
```

### Step 4: Logout and Login Again

1. Logout from user dashboard
2. Login again
3. Go to Profile tab
4. Click "Edit Profile"
5. **Verify all data is loaded correctly:**
   - ✅ Personal info populated
   - ✅ Education entries displayed
   - ✅ Experience entries displayed
   - ✅ Projects displayed
   - ✅ Skills displayed
   - ✅ Languages displayed
   - ✅ Personal details populated

## Troubleshooting

### Issue: Data Not Saving

**Check Backend Console:**
```
📝 Updating user profile with data: ...
```

If you don't see this log, the request isn't reaching the backend.

**Check Frontend Console:**
```javascript
// Should see successful response
Profile updated successfully
```

### Issue: Data Saving But Not Loading

**Check getUserProfile Response:**

The `/api/user/me` endpoint should return ALL fields:
- skills
- languages
- education  
- experienceList
- projects
- personalDetails

### Issue: Some Fields Missing

**Verify Field Names Match:**

Frontend sends:
- `education`
- `experienceList`
- `projects`
- `skills`
- `languages`
- `personalDetails`

Backend expects exact same names.

### Issue: Arrays Appear Empty

**Check if arrays are being sent:**

```javascript
// In browser console before saving
console.log(JSON.stringify(profileData, null, 2))
```

Should show:
```json
{
  "education": [{ "id": "...", "institution": "..." }],
  "projects": [{ "title": "...", "description": "..." }],
  "skills": ["JavaScript", "React"],
  ...
}
```

## API Endpoints for Data Storage

### Profile Data
- **PUT** `/api/user/me` - Updates all profile fields including:
  - Personal info, skills, education, projects, languages, personal details

### Experience (Separate Model)
- **POST** `/api/experience` - Create experience
- **GET** `/api/experience` - Get all user experiences
- **PUT** `/api/experience/:id` - Update experience
- **DELETE** `/api/experience/:id` - Delete experience

### Education (Embedded in User)
- Saved via profile update `/api/user/me`
- Stored in `User.education` array

## Data Persistence Guarantees

### ✅ What IS Saved
1. All personal information fields
2. All education entries (with all fields)
3. All experience entries (both in Experience model and User.experienceList)
4. All projects (with title, description, link, technologies)
5. All skills (array of strings)
6. All languages (with name and proficiency)
7. All personal details (dob, gender, category, maritalStatus, nationality)

### ✅ When Data is Saved
- Immediately when user clicks "Save Changes" in ProfileEditModal
- On each individual experience add/update/delete
- Data persists across sessions (stored in MongoDB)
- Data survives server restarts

### ✅ Data Validation
- Required fields are enforced by Mongoose schema
- Empty arrays are allowed and saved
- Individual fields can be updated without affecting others
- All updates are logged in backend console

## Verification Checklist

After filling out and saving profile, verify:

- [ ] Name displayed correctly in profile tab
- [ ] Email shown correctly
- [ ] Skills appear as badges
- [ ] Languages listed with proficiency
- [ ] Education entries show with all details
- [ ] Experience entries show with all details
- [ ] Projects listed with links
- [ ] Personal details (DOB, gender, etc.) populated
- [ ] Bio/description saved
- [ ] Current CTC saved
- [ ] Location saved

## Database Collections

### users Collection
Stores complete user profiles including:
- Personal information
- Skills array
- Languages array
- Education array
- ExperienceList array
- Projects array
- Personal details array

### experiences Collection (Separate)
Also stores experience data in separate collection for:
- Advanced querying
- Reference by other models
- Historical tracking

Both are kept in sync.

## Restart Required

After updating the User model and controllers:

**RESTART BACKEND SERVER:**
```bash
cd jobcy-backend-main
npm start
```

Watch for these logs when you save profile:
```
📝 Updating user profile with data: ...
✅ User profile saved successfully
📊 Saved data counts: { skills: X, languages: Y, ... }
```

## Summary

✅ ALL user data fields are properly defined in User model
✅ ALL fields are saved when profile is updated
✅ Backend logs confirm what's being saved
✅ Data persists in MongoDB
✅ Data loads correctly when user logs in again
✅ Empty arrays are handled correctly
✅ Separate Experience model for advanced features

The system is now fully configured to store ALL user data separately and correctly in the database! 🎉

