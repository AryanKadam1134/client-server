# 🚀 Profilo

> A modern, real-time portfolio management platform with public APIs to showcase your professional profile using just your username.

[![License: ISC](https://img.shields.io/badge/License-ISC-yellow.svg)](https://opensource.org/licenses/ISC)
[![Node.js](https://img.shields.io/badge/Node.js-v16+-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-brightgreen)](https://www.mongodb.com/)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Theme System](#theme-system)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

---

## 🎯 Overview

**Profilo** is a comprehensive portfolio management platform that empowers professionals to build and maintain their online presence. The platform provides:

- **Real-time Portfolio Management**: Create and update your portfolio sections instantly
- **Public APIs**: Share your portfolio with others using public endpoints (username-based access)
- **Multi-tenant Architecture**: Each user has complete control over their portfolio
- **Professional Design**: Modern UI with light/dark mode support
- **Secure Authentication**: Email/password and Google OAuth integration

Whether you're a developer, designer, or any professional, Profilo makes it easy to showcase your work and manage your online presence.

---

## ✨ Features

### 🔐 Authentication
- **Email/Password Authentication**: Traditional sign-up and login
- **Google OAuth**: Seamless Google account integration
- **JWT Sessions**: Secure token-based authentication with refresh tokens
- **Multi-Device Support**: Manage active sessions across multiple devices
- **Password Reset**: Secure OTP-based password recovery via email

### 📇 Portfolio Management
Users can manage comprehensive portfolio sections:
- **Profile**: Name, headline, about, location, contact information
- **Social Platforms**: Links to GitHub, LinkedIn, Twitter, and other platforms
- **Skills**: Organize skills by categories
- **Projects**: Showcase completed projects with descriptions and links
- **Experiences**: Document job history and roles
- **Education**: List educational background
- **Certificates**: Display professional certifications
- **Achievements**: Highlight awards and recognitions
- **Media**: Upload profile picture and resume/CV to Cloudinary

### 🌐 Public API
Anyone can fetch public portfolio data using just the username:
- Completely open and accessible (no authentication required)
- Perfect for portfolio websites, portfolios, or third-party integrations
- Read-only access to public portfolio data

### 🎨 Theme System
- **Light Mode**: Clean, professional light theme
- **Dark Mode**: Eye-friendly dark theme with warm neutrals
- **Theme Persistence**: Preference saved to localStorage
- **System Preference**: Respects OS-level theme preference on first load
- **Consistent Design**: Unified color tokens across all components

### 📱 Responsive Design
- Mobile-first approach
- Works seamlessly on all screen sizes
- Touch-friendly interface

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19.2 with Vite (rolldown-vite)
- **Routing**: React Router DOM v7
- **Styling**: TailwindCSS v4.2 with custom theme system
- **UI Components**: Ant Design v6
- **Forms**: React Hook Form v7
- **HTTP Client**: Axios v1.13 with interceptors
- **Authentication**: Google OAuth (@react-oauth/google)
- **Icons**: Lucide React
- **Utilities**: DayJS, UUID, Downshift (autocomplete), Floating UI
- **Build Tool**: Vite with SWC (Fast Refresh)

### Backend
- **Framework**: Express.js v5.2
- **Database**: MongoDB with Mongoose v9
- **Authentication**: JWT + Google Auth Library
- **Password Security**: Bcrypt v6
- **File Uploads**: Multer v2 + Cloudinary
- **Email Service**: Nodemailer v8 + Resend v6
- **Middleware**: CORS, Cookie Parser
- **Environment**: Node.js with ES Modules

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager
- **MongoDB** (local or Atlas cloud)
- **Cloudinary Account** (for file uploads)
- **Google OAuth Credentials** (for Google Sign-In)
- **Email Service** (for password reset notifications)

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/AryanKadam1134/portfolio-saas.git
cd portfolio-saas
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../client
npm install
```

---

## ⚙️ Configuration

### Backend Setup

Create a `.env` file in the `server` directory:

```env
# Server Configuration
PORT=5000
FRONTEND_URL=http://localhost:5173

# Database
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/portfolio-saas

# JWT Secrets
ACCESS_TOKEN_SECRET=your_access_token_secret_key_here
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_SECRET=your_refresh_token_secret_key_here
REFRESH_TOKEN_EXPIRY=7d

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Cloudinary (File Uploads)
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Email Service (Nodemailer)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password_here

# Email Service (Resend - Alternative)
RESEND_API_KEY=your_resend_api_key_here
```

### Frontend Setup

Create a `.env` file in the `client` directory:

```env
# API Configuration
VITE_BASE_URL=http://localhost:5000/api/admin
VITE_PUBLIC_API_URL=http://localhost:5000/api

# Google OAuth
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

---

## 🎮 Usage

### Start the Backend Server

```bash
cd server
npm start
```

The server will run on `http://localhost:5000`

### Start the Frontend Development Server

```bash
cd client
npm run dev
```

The frontend will run on `http://localhost:5173`

### Build for Production

**Backend**: No build step needed (Node.js runs directly)

**Frontend**:
```bash
cd client
npm run build
npm run preview
```

---

## 📚 API Documentation

### Public API Endpoints (No Authentication Required)

All endpoints use the base URL: `http://localhost:5000/api/portfolio/:username`

#### Public API Integration Prompt (Copy/Paste)

If you want to integrate these public APIs in your own portfolio project using an AI assistant, copy **PUBLIC_API_GUIDE.md** into your project and use the following prompt:

```
You are integrating with Profilo's public portfolio API. Use the attached PUBLIC_API_GUIDE.md as the source of truth.

Goal:
- Build a data layer that fetches public portfolio data by username.
- Base URL: https://server-ze3s.onrender.com/api/portfolio/:username

Implement:
- Fetchers for details, social platforms, skills, categories, projects, experiences, educations, certificates, achievements.
- Pagination for projects, experiences, educations, certificates, and achievements (page & limit).
- Featured filter for projects/certificates/achievements where supported.

Requirements:
- Follow the JSON structures exactly as documented.
- Provide types/interfaces for the response shapes.
- Show example usage in a React component (or the framework used in this project).
```

#### Get User Details
```
GET /api/portfolio/:username/details
```
Returns basic user information (name, headline, about, location, etc.)

#### Get Social Platforms
```
GET /api/portfolio/:username/social-platforms
```
Returns all linked social platforms

#### Get Skills
```
GET /api/portfolio/:username/skills
```
Returns skills with category information

#### Get Skills by Category
```
GET /api/portfolio/:username/categories
```
Returns skills organized by categories

#### Get Projects
```
GET /api/portfolio/:username/projects
```
Returns all projects

#### Get Experiences
```
GET /api/portfolio/:username/experiences
```
Returns job experiences and history

#### Get Education
```
GET /api/portfolio/:username/educations
```
Returns educational background

#### Get Certificates
```
GET /api/portfolio/:username/certificates
```
Returns professional certificates

#### Get Achievements
```
GET /api/portfolio/:username/achievements
```
Returns achievements and awards

### Admin API Endpoints (Authentication Required)

All admin endpoints require JWT token in `Authorization` header.

#### Authentication Routes
```
POST   /api/admin/auth/register
POST   /api/admin/auth/login
POST   /api/admin/auth/google
POST   /api/admin/auth/logout
POST   /api/admin/auth/restoreSession
PATCH  /api/admin/auth/password
POST   /api/admin/auth/forgot-password
POST   /api/admin/auth/verify-otp
PATCH  /api/admin/auth/reset-password
```

#### User Management
```
GET    /api/admin/users/
PATCH  /api/admin/users/
DELETE /api/admin/users/
GET    /api/admin/users/check-password
PATCH  /api/admin/users/image
DELETE /api/admin/users/image
PATCH  /api/admin/users/resume
DELETE /api/admin/users/resume
```

#### Resource Management (CRUD Operations)
```
/api/admin/socialPlatforms
/api/admin/skillCategories
/api/admin/skills
/api/admin/projects
/api/admin/experiences
/api/admin/educations
/api/admin/certificates
/api/admin/achievements
```

Each resource supports: `GET`, `POST`, `PATCH`, `DELETE`

---

## 📂 Project Structure

```
portfolio-saas/
├── client/                          # Frontend application
│   ├── src/
│   │   ├── pages/                  # Route pages
│   │   │   ├── authentication/     # Auth pages
│   │   │   └── private/            # Protected pages
│   │   │       ├── Dashboard
│   │   │       ├── social_platforms/
│   │   │       ├── skills/
│   │   │       ├── projects/
│   │   │       ├── experiences/
│   │   │       ├── educations/
│   │   │       ├── certificates/
│   │   │       ├── achievements/
│   │   │       └── Settings
│   │   ├── components/             # Reusable components
│   │   ├── context/                # React contexts
│   │   │   ├── AuthContext.jsx
│   │   │   ├── ThemeContext.jsx
│   │   │   └── NotificationContext.jsx
│   │   ├── layouts/                # Layout components
│   │   ├── hooks/                  # Custom hooks
│   │   ├── utils/                  # Utility functions
│   │   ├── api.jsx                 # API client setup
│   │   ├── App.jsx                 # Main router
│   │   └── main.jsx                # Entry point
│   ├── public/                     # Static assets
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── eslint.config.js
│
├── server/                          # Backend application
│   ├── src/
│   │   ├── routes/
│   │   │   ├── public/             # Public routes
│   │   │   │   └── portfolio.routes.js
│   │   │   └── private/            # Admin routes
│   │   │       ├── auth.routes.js
│   │   │       ├── user.routes.js
│   │   │       ├── socialPlatform.routes.js
│   │   │       ├── skill.routes.js
│   │   │       ├── skillCategory.routes.js
│   │   │       ├── project.routes.js
│   │   │       ├── experience.routes.js
│   │   │       ├── education.routes.js
│   │   │       ├── certificate.routes.js
│   │   │       ├── achievement.routes.js
│   │   │       └── filter.routes.js
│   │   ├── controllers/            # Business logic
│   │   │   ├── public/
│   │   │   └── private/
│   │   ├── models/                 # MongoDB schemas
│   │   │   ├── user.model.js
│   │   │   ├── socialPlatform.model.js
│   │   │   ├── skill.model.js
│   │   │   ├── skillCategory.model.js
│   │   │   ├── project.model.js
│   │   │   ├── experience.model.js
│   │   │   ├── education.model.js
│   │   │   ├── certificate.model.js
│   │   │   └── achievement.model.js
│   │   ├── middlewares/            # Express middlewares
│   │   │   ├── auth.middleware.js
│   │   │   ├── user.middleware.js
│   │   │   └── multer.middleware.js
│   │   ├── db/                     # Database connection
│   │   ├── app.js                  # Express app setup
│   │   └── index.js                # Server entry point
│   ├── package.json
│   └── .env.example
│
├── THEME_SYSTEM.md                 # Theme documentation
├── UI_ENHANCEMENTS.md              # UI improvements documentation
├── README.md                        # This file
└── .gitignore
```

---

## 🎨 Theme System

The project includes a comprehensive theme system with professional light and dark modes.

### Color Palette

**Light Mode**:
- Primary Background: `#ffffff`
- Secondary Background: `#f8f9fa`
- Text Primary: `#1a1a1a`

**Dark Mode**:
- Primary Background: `#0f0f0f`
- Secondary Background: `#1a1a1a`
- Text Primary: `#f5f5f5`

### Using Theme Colors

```jsx
// Text color
<p className="text-light-text-primary dark:text-dark-text-primary">
  Content
</p>

// Background
<div className="bg-light-bg-primary dark:bg-dark-bg-primary">
  Content
</div>

// Borders
<div className="border border-light-border-primary dark:border-dark-border-primary">
  Content
</div>
```

### Theme Management

The theme is managed by `ThemeContext`:
- Persists to localStorage
- Respects system preference on first load
- Toggle available in the header

For more details, see [THEME_SYSTEM.md](./THEME_SYSTEM.md)

---

## 🔐 Security Features

- ✅ JWT-based authentication with short-lived access tokens
- ✅ Refresh token rotation with httpOnly cookies
- ✅ Bcrypt password hashing
- ✅ CORS protection
- ✅ Input validation and sanitization
- ✅ Multi-device session management
- ✅ OTP-based password reset
- ✅ Secure file uploads via Cloudinary

---

## 📋 Environment Variables Reference

### Server (`.env`)
| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |
| `MONGODB_URI` | MongoDB connection string | See Prerequisites |
| `ACCESS_TOKEN_SECRET` | JWT access token secret | Random string |
| `ACCESS_TOKEN_EXPIRY` | Access token expiry | `15m` |
| `REFRESH_TOKEN_SECRET` | JWT refresh token secret | Random string |
| `REFRESH_TOKEN_EXPIRY` | Refresh token expiry | `7d` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | From Google Cloud |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | From Google Cloud |
| `CLOUDINARY_NAME` | Cloudinary cloud name | From Cloudinary |
| `CLOUDINARY_API_KEY` | Cloudinary API key | From Cloudinary |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | From Cloudinary |

### Client (`.env`)
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_BASE_URL` | Admin API base URL | `http://localhost:5000/api/admin` |
| `VITE_PUBLIC_API_URL` | Public API base URL | `http://localhost:5000/api` |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID | From Google Cloud |

---

## 🧪 Testing

### Backend
```bash
cd server
npm test
```

### Frontend
```bash
cd client
npm test
```

---

## 📦 Build & Deployment

### Frontend Build
```bash
cd client
npm run build
```
Output: `dist/` folder ready for deployment to Vercel, Netlify, or any static host

### Backend Deployment
Deploy to platforms like:
- Heroku
- Railway
- Render
- AWS
- DigitalOcean

### Example: Deploying to Vercel (Frontend)
```bash
npm install -g vercel
cd client
vercel
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Message Guidelines
- Use clear, descriptive commit messages
- Start with a verb (Add, Fix, Update, Remove, etc.)
- Reference issues when applicable

---

## 📄 License

This project is licensed under the **ISC License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Aryan Kadam**
- GitHub: [@AryanKadam1134](https://github.com/AryanKadam1134)
- Email: aryan@example.com

---

## 🤝 Support

If you have any questions or need help, feel free to:
- Open an [Issue](https://github.com/AryanKadam1134/portfolio-saas/issues)
- Contact the author directly
- Check existing documentation in [THEME_SYSTEM.md](./THEME_SYSTEM.md) and [UI_ENHANCEMENTS.md](./UI_ENHANCEMENTS.md)

---

## 🗺️ Roadmap

- [ ] Portfolio preview/demo page
- [ ] Portfolio export as PDF
- [ ] Analytics dashboard
- [ ] Portfolio templates
- [ ] Collaboration features
- [ ] Portfolio versioning
- [ ] Mobile app
- [ ] AI-powered portfolio suggestions

---

## 🙏 Acknowledgments

- [React](https://react.dev/) - UI framework
- [Express.js](https://expressjs.com/) - Backend framework
- [MongoDB](https://www.mongodb.com/) - Database
- [TailwindCSS](https://tailwindcss.com/) - Styling
- [Ant Design](https://ant.design/) - UI Components
- [Cloudinary](https://cloudinary.com/) - File storage

---

<div align="center">

**Made with ❤️ by Aryan Kadam**

⭐ If you found this project helpful, please consider giving it a star!

</div>
