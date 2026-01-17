# Student Gymkhana Management System

A full-stack web application for managing student activities, events, news, and team information at IIT Jodhpur's Student Gymkhana. This platform serves as a central hub for students to stay updated with campus events, read stories, connect with team members, and participate in the blogging community.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [How It Works](#how-it-works)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Setup and Installation](#setup-and-installation)
- [API Endpoints](#api-endpoints)
- [Usage](#usage)

## 🎯 Overview

The Student Gymkhana Management System is designed to streamline communication and engagement within the IIT Jodhpur student community. It provides a platform for:

- **Event Management**: Browse upcoming, ongoing, and completed campus events
- **News & Stories**: Stay updated with the latest campus news and student stories
- **Team Directory**: View team members with their roles and social media links
- **Blogging Platform**: Students can create, share, and comment on blogs
- **User Authentication**: Secure login system with JWT and Google OAuth integration
- **Notice Board**: Important announcements and notices for students
- **Sathi Platform**: Student support and mentorship system

## ✨ Features

### For Students
- **User Registration & Login**: Secure authentication using IIT Jodhpur email (@iitj.ac.in)
- **Google OAuth Integration**: Quick login using Google accounts
- **Blog Creation**: Write and publish blogs with image uploads
- **Comment System**: Engage with blog posts through comments
- **Event Calendar**: View all campus events with details and status
- **Team Directory**: Connect with Gymkhana team members
- **Responsive Design**: Mobile-friendly interface for access on any device

### For Administrators
- **Content Management**: Manage events, stories, and team member information
- **User Management**: Monitor user registrations and activities
- **Request Logging**: Track all API requests for monitoring and debugging

## 🛠 Technology Stack

### Frontend
- **React 18.3.1**: Modern UI library for building interactive interfaces
- **React Router DOM 6.28.0**: Client-side routing for single-page application
- **React Icons 5.3.0**: Icon library for consistent UI elements
- **CSS3**: Custom styling for responsive design

### Backend
- **Node.js**: JavaScript runtime environment
- **Express.js 4.21.1**: Web application framework
- **MySQL 8.4.3**: Relational database management system
- **Sequelize 6.37.5**: ORM for database operations

### Authentication & Security
- **JWT (jsonwebtoken 9.0.2)**: Token-based authentication
- **Passport.js 0.7.0**: Authentication middleware
- **Google OAuth 2.0**: Third-party authentication
- **SHA-512**: Password hashing for security

### Additional Libraries
- **Multer 1.4.5**: File upload handling
- **Nodemailer 6.9.16**: Email sending functionality
- **CORS 2.8.5**: Cross-Origin Resource Sharing
- **Express Session 1.18.1**: Session management
- **Google APIs 144.0.0**: Integration with Google services

## 🏗 Architecture

The application follows a **client-server architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (React)                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Pages   │  │Components│  │  Routing │  │  Styles  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                    HTTP Requests (REST API)
                            │
┌─────────────────────────────────────────────────────────────┐
│                    Backend (Express.js)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Routes  │→ │Controller│→ │ Database │→ │  Utils   │   │
│  │          │  │          │  │Connection│  │          │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                    MySQL Queries
                            │
┌─────────────────────────────────────────────────────────────┐
│                      Database (MySQL)                        │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐         │
│  │ User │  │ Blog │  │Event │  │Story │  │ Team │         │
│  └──────┘  └──────┘  └──────┘  └──────┘  └──────┘         │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 How It Works

### 1. Application Flow

#### User Registration & Authentication
1. **Sign Up Process**:
   - User visits `/signup` page
   - Enters roll number, name, IIT Jodhpur email, and password
   - Frontend sends POST request to `/apis/v1/user/signup`
   - Backend validates email (must be @iitj.ac.in)
   - Password is hashed using SHA-512 algorithm
   - User data is stored in MySQL database
   - Success response is sent back to frontend

2. **Login Process**:
   - User visits `/login` page
   - Enters username/email and password
   - Frontend sends POST request to `/apis/v1/user/login`
   - Backend hashes the password and queries database
   - If credentials match, JWT token is generated
   - Token is sent to frontend and stored for authenticated requests
   - User is redirected to homepage

3. **Google OAuth Flow**:
   - User clicks "Login with Google"
   - Redirected to Google authentication page
   - After approval, Google redirects to `/auth/google/callback`
   - Backend validates Google token and creates/updates user
   - Session is established and user is logged in

### 2. Core Features Workflow

#### Blog System
1. **Creating a Blog**:
   - Authenticated user navigates to blog creation page
   - Uploads an image (handled by Multer middleware)
   - Image is stored via Google Drive API
   - Blog content (title, description, image URL) is saved to database
   - Blog is linked to user via foreign key (u_mail)

2. **Viewing Blogs**:
   - Frontend fetches blogs from `/apis/v1/user/blogs`
   - Backend queries database for all blogs with user information
   - Blogs are displayed with author details, date, and likes

3. **Commenting**:
   - User submits comment on a blog
   - Comment is stored with blog_id and user email
   - Comments are displayed chronologically

#### Event Management
1. **Fetching Events**:
   - Frontend calls `/apis/v1/common/events`
   - Backend queries event table
   - Events are categorized by status (upcoming/ongoing/completed)
   - Frontend displays events with details, dates, and images

2. **Event Display**:
   - Events shown with name, description, caption
   - Start and end dates displayed
   - Location and website links provided
   - Status indicator (upcoming/ongoing/completed)

#### Team Directory
1. **Team Members Display**:
   - Frontend requests `/apis/v1/common/team_members`
   - Backend fetches all team members with their tags
   - Members displayed with profile images
   - Social media links (GitHub, Instagram, LinkedIn) provided
   - Filterable by tags/roles

#### News & Stories
1. **Stories Retrieval**:
   - Frontend calls `/apis/v1/common/stories`
   - Only published stories are fetched
   - Stories displayed with images and "Read More" links
   - Sorted by creation date

### 3. Request Flow Example

Let's trace a complete request when a user logs in:

```
1. User enters credentials on Login Page (LoginPage.js)
   ↓
2. Form submission triggers fetch() to http://localhost:3300/apis/v1/user/login
   ↓
3. Request hits Express server (index.js)
   ↓
4. CORS middleware allows cross-origin request
   ↓
5. Request logged by log.js middleware → logs/transactions.txt
   ↓
6. Routed to /apis/v1/user → routes/user.js
   ↓
7. Further routed to /login → controllers/users/login.js
   ↓
8. connectDB middleware establishes MySQL connection
   ↓
9. Password hashed using SHA-512
   ↓
10. SQL query: SELECT * FROM gymkhana.user WHERE (u_name = ? OR mail = ?) AND pass = ?
   ↓
11. If user found:
    - JWT token generated with user ID
    - Token expires in 1 hour
    - Response: { token, message, user: { id, username, email } }
   ↓
12. Frontend receives response
   ↓
13. Token stored in localStorage/sessionStorage
   ↓
14. User redirected to homepage
   ↓
15. Subsequent requests include token in Authorization header
```

### 4. Database Interactions

#### Connection Management
- Each request creates a new MySQL connection
- Connection established via `connectDB` middleware
- Connection details: host=localhost, user=root, database=gymkhana
- Connection closed after query execution

#### Query Pattern
```javascript
// Example: Fetching events
const query = `SELECT * FROM ${req.db}.event`;
req.conn.query(query, (err, result) => {
    req.conn.end(); // Close connection
    return res.json(result); // Send response
});
```

### 5. Frontend Routing

The React application uses client-side routing:

```javascript
/ → Home Page (events carousel, featured content)
/about → About Us (Gymkhana information)
/news-and-stories → News & Stories listing
/events → Events calendar
/gallery → Photo gallery
/team → Team members directory
/contact → Contact form
/signup → User registration
/login → User authentication
/noticeboard → Announcements
/sathi → Student support platform
```

### 6. Security Measures

1. **Password Security**:
   - Passwords hashed with SHA-512 before storage
   - Never stored in plain text

2. **Email Validation**:
   - Database constraint ensures only @iitj.ac.in emails
   - Prevents unauthorized registrations

3. **JWT Authentication**:
   - Tokens expire after 1 hour
   - Stateless authentication mechanism

4. **SQL Injection Prevention**:
   - Parameterized queries used in login controller
   - Prevents malicious SQL injection attacks

5. **CORS Configuration**:
   - Allows controlled cross-origin requests
   - Can be configured for specific domains

## 📁 Project Structure

```
Student_Gymkhana/
│
├── backend/
│   ├── controllers/           # Request handlers
│   │   ├── users/            # User-related controllers
│   │   │   ├── signup.js     # User registration logic
│   │   │   ├── login.js      # Authentication logic
│   │   │   ├── blog.js       # Blog CRUD operations
│   │   │   └── sathi.js      # Sathi platform logic
│   │   └── common/           # Public controllers
│   │       ├── events.js     # Event management
│   │       ├── stories.js    # News & stories
│   │       ├── team_members.js # Team directory
│   │       └── feedback.js   # User feedback
│   │
│   ├── routes/               # API route definitions
│   │   ├── user.js          # User routes (/apis/v1/user/*)
│   │   └── common.js        # Common routes (/apis/v1/common/*)
│   │
│   ├── database/            # Database configuration
│   │   ├── connection.js   # MySQL connection setup
│   │   └── database.sql    # Database schema & dump
│   │
│   ├── utils/              # Utility functions
│   │   ├── log.js         # Request logging middleware
│   │   ├── mail.js        # Email sending utility
│   │   ├── multer_setup.js # File upload configuration
│   │   └── login_with_google.js # Google OAuth setup
│   │
│   ├── logs/              # Application logs
│   │   └── transactions.txt # Request logs
│   │
│   ├── index.js          # Express server entry point
│   └── package.json      # Backend dependencies
│
├── frontend/
│   ├── public/           # Static files
│   │
│   └── src/
│       ├── components/   # React components
│       │   ├── Home.js          # Homepage
│       │   ├── AboutUs.js       # About page
│       │   ├── Events.js        # Events page
│       │   ├── NewsAndStories.js # News page
│       │   ├── Team.js          # Team directory
│       │   ├── Gallery.js       # Photo gallery
│       │   ├── ContactUs.js     # Contact form
│       │   ├── LoginPage.js     # Login interface
│       │   ├── SignUpPage.js    # Registration form
│       │   ├── noticeboard.js   # Notice board
│       │   ├── sathi.js         # Sathi platform
│       │   ├── headerpage.js    # Navigation header
│       │   └── footer.js        # Footer component
│       │
│       ├── App.js        # Main app component with routing
│       ├── index.js      # React entry point
│       └── package.json  # Frontend dependencies
│
└── README.md            # This file
```

## 🗄 Database Schema

The application uses **6 main tables** in MySQL:

### 1. `user` Table
Stores student user information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| roll_number | VARCHAR(50) | | Student roll number |
| u_name | VARCHAR(150) | | User's full name |
| mail | VARCHAR(100) | PRIMARY KEY | Email (must be @iitj.ac.in) |
| pass | VARCHAR(128) | | SHA-512 hashed password |
| image_url | VARCHAR(200) | | Profile picture URL |

**Constraint**: Email must match pattern `%@iitj.ac.in`

### 2. `blog` Table
Stores blog posts created by users.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| blog_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique blog identifier |
| u_mail | VARCHAR(100) | FOREIGN KEY → user(mail) | Author's email |
| image_url | VARCHAR(200) | | Blog cover image |
| title | VARCHAR(200) | | Blog title |
| description | TEXT | | Blog content |
| likes | INT | | Number of likes |
| date | DATE | | Publication date |

### 3. `comment` Table
Stores comments on blog posts.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| comment_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique comment ID |
| u_mail | VARCHAR(100) | FOREIGN KEY → user(mail) | Commenter's email |
| comment | TEXT | | Comment content |
| blog_id | INT | FOREIGN KEY → blog(blog_id) | Associated blog |
| date | DATE | | Comment date |

### 4. `event` Table
Stores campus events information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| event_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique event ID |
| name | VARCHAR(255) | NOT NULL | Event name |
| description | TEXT | | Event details |
| caption | VARCHAR(255) | | Short caption |
| start_date | DATETIME | NOT NULL | Event start time |
| end_date | DATETIME | NOT NULL | Event end time |
| location | VARCHAR(255) | | Event venue |
| image_url | VARCHAR(255) | | Event poster |
| website_url | VARCHAR(255) | | Event website |
| status | ENUM | DEFAULT 'upcoming' | upcoming/ongoing/completed |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Last update time |

### 5. `story` Table
Stores news and stories.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| story_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique story ID |
| title | VARCHAR(255) | NOT NULL | Story title |
| content | TEXT | NOT NULL | Story content |
| image_url | VARCHAR(255) | | Story image |
| more_info_url | VARCHAR(255) | | External link |
| status | ENUM | DEFAULT 'draft' | draft/published |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Last update time |

### 6. `team_member` Table
Stores Gymkhana team member information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| member_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique member ID |
| name | VARCHAR(255) | NOT NULL | Member name |
| designation | VARCHAR(255) | | Role/Position |
| image_url | VARCHAR(255) | | Profile photo |
| email | VARCHAR(255) | | Contact email |
| git_url | VARCHAR(255) | | GitHub profile |
| insta_url | VARCHAR(255) | | Instagram profile |
| linkedin_url | VARCHAR(255) | | LinkedIn profile |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Last update time |

### 7. `team_member_tags` Table
Links team members with their roles/tags.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| member_id | INT | PRIMARY KEY, FOREIGN KEY | Reference to team_member |
| tag | VARCHAR(255) | PRIMARY KEY | Role/category tag |

**Relationship**: Many-to-many relationship between members and tags.

### Database Relationships

```
user (1) ──────< (many) blog
user (1) ──────< (many) comment
blog (1) ──────< (many) comment
team_member (1) ──────< (many) team_member_tags
```

## 🚀 Setup and Installation

### Prerequisites
- **Node.js** (v14 or higher)
- **MySQL** (v8.0 or higher)
- **npm** or **yarn** package manager
- **Git** (for cloning the repository)

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure MySQL Database**:
   - Start MySQL server
   - Create database:
     ```sql
     CREATE DATABASE gymkhana;
     ```
   - Import schema:
     ```bash
     mysql -u root -p gymkhana < database/database.sql
     ```

4. **Update database credentials**:
   - Edit `database/connection.js`
   - Update `host`, `user`, and `password` to match your MySQL configuration

5. **Create environment variables** (optional):
   - Create `.env` file in backend directory
   - Add:
     ```
     PORT=3300
     JWT_SECRET_KEY=yourSecretKey
     ```

6. **Start the backend server**:
   ```bash
   npm start
   ```
   Server will run on `http://localhost:3300`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure API endpoint** (if needed):
   - Update API base URL in components to match your backend URL
   - Default: `http://localhost:3300`

4. **Start the development server**:
   ```bash
   npm start
   ```
   Application will open at `http://localhost:3000`

### Google OAuth Setup (Optional)

1. **Create Google Cloud Project**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create new project
   - Enable Google+ API

2. **Create OAuth 2.0 Credentials**:
   - Navigate to Credentials
   - Create OAuth 2.0 Client ID
   - Add authorized redirect URI: `http://localhost:3300/auth/google/callback`

3. **Update backend configuration**:
   - Add credentials to `utils/login_with_google.js`
   - Update client ID and secret

### Verification

1. **Check backend**: Visit `http://localhost:3300/apis/v1/common/events`
   - Should return JSON array (empty or with events)

2. **Check frontend**: Visit `http://localhost:3000`
   - Homepage should load with navigation

3. **Test registration**:
   - Go to `/signup`
   - Register with @iitj.ac.in email
   - Check database for new user entry

## 🔌 API Endpoints

### User Routes (`/apis/v1/user`)

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/signup` | Register new user | `{ roll_number, u_name, mail, pass }` | `{ message }` |
| POST | `/login` | Authenticate user | `{ field, pass }` | `{ token, message, user }` |
| GET/POST | `/blogs` | Blog operations | Varies | Blog data |
| GET/POST | `/sathi` | Sathi platform | Varies | Sathi data |

### Common Routes (`/apis/v1/common`)

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| GET | `/events` | Fetch all events | Array of event objects |
| GET | `/stories` | Fetch published stories | Array of story objects |
| GET | `/team_members` | Fetch team members | Array of member objects |
| POST | `/feedback` | Submit feedback | Confirmation message |

### Authentication Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/auth/google/callback` | Google OAuth callback |

### Request/Response Examples

#### Sign Up
```javascript
// Request
POST /apis/v1/user/signup
Content-Type: application/json

{
  "roll_number": "B22CS001",
  "u_name": "John Doe",
  "mail": "b22cs001@iitj.ac.in",
  "pass": "securePassword123"
}

// Response
{
  "message": "User signed up successfully!"
}
```

#### Login
```javascript
// Request
POST /apis/v1/user/login
Content-Type: application/json

{
  "field": "b22cs001@iitj.ac.in",
  "pass": "securePassword123"
}

// Response
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "John Doe",
    "email": "b22cs001@iitj.ac.in"
  }
}
```

#### Get Events
```javascript
// Request
GET /apis/v1/common/events

// Response
[
  {
    "event_id": 1,
    "name": "Tech Fest 2024",
    "description": "Annual technical festival",
    "start_date": "2024-03-15T09:00:00",
    "end_date": "2024-03-17T18:00:00",
    "location": "Main Auditorium",
    "status": "upcoming",
    "image_url": "https://..."
  }
]
```

## 💡 Usage

### For Students

1. **Registration**:
   - Click "Sign Up" in navigation
   - Fill in roll number, name, IIT Jodhpur email, and password
   - Submit form to create account

2. **Login**:
   - Click "Login" in navigation
   - Enter email/username and password
   - Or use "Login with Google" for quick access

3. **Browse Events**:
   - Navigate to "Events" page
   - View upcoming, ongoing, and completed events
   - Click on events for more details

4. **Read Stories**:
   - Go to "News & Stories" section
   - Browse latest campus news and student stories
   - Click "Read More" for full articles

5. **View Team**:
   - Visit "Team" page
   - See all Gymkhana team members
   - Connect via social media links

6. **Create Blog** (when logged in):
   - Access blog creation interface
   - Upload cover image
   - Write title and content
   - Publish to share with community

7. **Check Notice Board**:
   - Visit "Notice Board" for announcements
   - Stay updated with important notices

### For Developers

1. **Adding New Features**:
   - Create controller in `backend/controllers/`
   - Define route in `backend/routes/`
   - Create React component in `frontend/src/components/`
   - Update routing in `App.js`

2. **Database Modifications**:
   - Update `database/database.sql`
   - Modify connection queries in controllers
   - Test with sample data

3. **Debugging**:
   - Check `backend/logs/transactions.txt` for request logs
   - Use browser console for frontend errors
   - Check MySQL logs for database issues

## 🔒 Security Considerations

- **Never commit** `.env` files or database credentials
- **Change** default JWT secret key in production
- **Use HTTPS** in production environment
- **Implement rate limiting** to prevent abuse
- **Validate all inputs** on both frontend and backend
- **Keep dependencies updated** to patch security vulnerabilities

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

This project is developed for IIT Jodhpur Student Gymkhana.

## 👥 Contact

For queries or support, contact the Student Gymkhana team through the Contact Us page.

---

**Built with ❤️ for IIT Jodhpur Student Community**
