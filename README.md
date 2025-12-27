# ResuMatch - AI-Powered Job Matching Platform

ResuMatch is a modern job search and matching platform that uses AI to parse resumes and recommend personalized job opportunities.

## 🚀 Features

### Core Functionalities
- **User Authentication**: Sign-up, login, password reset, profile management
- **Profile Management**: Complete CRUD operations for user information
- **Resume Upload & Parsing**: AI-powered resume analysis to extract skills and keywords
- **Job Recommendations**: Smart job matching based on parsed resume data
- **Job Search**: Browse and search jobs from The Muse API with advanced filters
- **Filters**: Salary range, location, job type, experience level
- **Job Applications**: Apply to jobs, track application status
- **User Dashboard**: Comprehensive dashboard with stats and insights
- **Admin Panel**: User and application management (optional)

### API Integrations
- **The Muse API**: Real-time job search and postings
- **Google Maps API**: Display company/job locations (optional for extra credit)

## 📁 Project Structure

```
src/
├── assets/                  # Static assets
│   ├── images/             # Image files
│   └── styles/             # Global styles
├── components/             # Reusable UI components
│   ├── common/             # Generic components
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Loader.jsx
│   │   └── Modal.jsx
│   ├── layout/             # Layout components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   └── ProtectedRoute.jsx
│   └── ui/                 # Specific UI widgets
├── context/                # Global State Management
│   ├── AuthContext.jsx     # Authentication state
│   └── JobContext.jsx      # Jobs and applications state
├── hooks/                  # Custom React Hooks
│   ├── useAuth.js          # Authentication hook
│   ├── useDebounce.js      # Debounce for search
│   └── useMuseAPI.js       # Muse API integration
├── pages/                  # Application Screens
│   ├── auth/               # Authentication pages
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── ForgotPassword.jsx
│   │   └── ResetPassword.jsx
│   ├── dashboard/          # User dashboard pages
│   │   ├── Dashboard.jsx
│   │   ├── Profile.jsx
│   │   ├── EditProfile.jsx
│   │   ├── Resume.jsx
│   │   └── Applications.jsx
│   ├── jobs/               # Job-related pages
│   │   ├── JobSearch.jsx
│   │   ├── JobDetails.jsx
│   │   └── SavedJobs.jsx
│   ├── admin/              # Admin pages
│   │   ├── AdminDashboard.jsx
│   │   └── UserManagement.jsx
│   ├── Home.jsx            # Landing page
│   └── NotFound.jsx        # 404 page
├── services/               # API Services
│   ├── api.js              # Backend API (axios instance)
│   └── museApi.js          # The Muse API integration
├── utils/                  # Helper Functions
│   ├── parsers.js          # Resume parsing helpers
│   └── validators.js       # Form validation
├── App.jsx                 # Main routing setup
└── main.jsx                # Entry point
```

## 🎨 Application Screens

### Public Pages
1. **Landing Page** (`/`) - Introduction and features
2. **Login** (`/login`) - User authentication
3. **Sign Up** (`/register`) - New user registration
4. **Forgot Password** (`/forgot-password`) - Password reset request
5. **Reset Password** (`/reset-password`) - Set new password

### User Dashboard
6. **Dashboard** (`/dashboard`) - Overview with stats and recommendations
7. **My Profile** (`/profile`) - View user information
8. **Edit Profile** (`/profile/edit`) - Update personal info and preferences
9. **Resume Manager** (`/resume`) - Upload and manage resume

### Jobs & Applications
10. **Job Search** (`/jobs`) - Browse and search jobs with filters
11. **Job Details** (`/jobs/:id`) - Detailed job information
12. **Saved Jobs** (`/jobs/saved`) - Bookmarked jobs
13. **Application Tracker** (`/applications`) - Track job applications

### Admin (Optional)
14. **Admin Dashboard** (`/admin`) - System overview
15. **User Management** (`/admin/users`) - Manage users

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation Steps

1. **Clone the repository**
   ```bash
   cd resumatch
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your configuration:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 📦 Dependencies

### Core Dependencies
- **React** - UI library
- **React Router DOM** - Routing
- **Axios** - HTTP client for API calls

### Dev Dependencies
- **Vite** - Build tool
- **ESLint** - Code linting

## 🔌 API Integration

### Backend API
The application expects a backend API at `VITE_API_URL` with the following endpoints:

#### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password
- `GET /auth/me` - Get current user

#### Profile
- `GET /profile` - Get user profile
- `PUT /profile` - Update profile

#### Resume
- `GET /resume` - Get user resume
- `POST /resume/upload` - Upload resume
- `POST /resume/:id/parse` - Parse resume with AI
- `DELETE /resume/:id` - Delete resume

#### Jobs
- `GET /jobs/saved` - Get saved jobs
- `POST /jobs/:id/save` - Save a job
- `DELETE /jobs/:id/save` - Unsave a job
- `GET /jobs/recommendations` - Get job recommendations

#### Applications
- `GET /applications` - Get user applications
- `POST /applications` - Create application
- `PUT /applications/:id` - Update application
- `DELETE /applications/:id` - Delete application

#### Admin
- `GET /admin/stats` - Get system stats
- `GET /admin/users` - Get all users
- `PUT /admin/users/:id` - Update user
- `DELETE /admin/users/:id` - Delete user

### The Muse API
Jobs are fetched from The Muse API:
- Base URL: `https://www.themuse.com/api/public`
- No API key required for basic usage

## 🎯 Key Features Implementation

### Authentication Flow
- JWT-based authentication
- Token stored in localStorage
- Automatic token refresh
- Protected routes with ProtectedRoute component

### Resume Parsing
- File upload (PDF, DOC, DOCX)
- AI/NLP parsing to extract:
  - Skills
  - Experience level
  - Education
  - Keywords

### Job Matching
- Match jobs based on resume keywords
- Filter by location, salary, experience
- Save jobs for later
- Track application status

## 🚧 Future Enhancements
- Google Maps integration for job locations
- Real-time notifications
- Advanced analytics dashboard
- Company reviews and ratings
- Interview preparation tools

## 📝 License
MIT License

## 👥 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support
For support, email support@resumatch.com or create an issue in the repository.
