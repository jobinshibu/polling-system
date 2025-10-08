# Polling System

A full-stack polling application with secure authentication, role-based access control, and real-time voting capabilities. Built with NestJS (backend) and React (frontend).

## 🌟 Overview

This polling system allows administrators to create and manage polls while regular users can vote and view results. The system features JWT authentication, password security, private polls, and comprehensive vote tracking.

## 📁 Project Structure

```
polling-system/
├── polling-system-backend/     # NestJS Backend API
│   ├── src/                    # Source code
│   ├── dist/                   # Compiled output
│   └── README.md              # Backend documentation
│
└── polling-system-frontend/    # React Frontend
    ├── src/                    # Source code
    ├── dist/                   # Build output
    └── README.md              # Frontend documentation
```

## ✨ Key Features

### 🔐 Authentication & Security
- User registration with validation
- Secure login with JWT tokens
- Password hashing using bcrypt
- Role-based access control (Admin/User)
- Protected routes and endpoints
- Old password verification for password changes

### 📊 Poll Management
- **Create Polls** (Admin only)
  - Custom title and multiple options (min 2)
  - Duration setting (1-120 minutes)
  - Public or private visibility
  - Assign specific users to private polls
  
- **Vote on Polls** (Users only)
  - One vote per user per poll
  - Real-time vote counting
  - View results after voting
  
- **Poll Features**
  - Auto-expiry based on duration
  - Edit active polls
  - Delete polls with confirmation
  - Human-readable expiry times

### 👥 User Features
- View accessible polls (public + assigned private)
- Voting history with statistics
- Profile management
- Password change functionality

### 👨‍💼 Admin Features
- Create, edit, and delete polls
- View all results (cannot vote)
- Assign users to private polls
- Poll management dashboard
- Delete confirmation with vote counts

## 🛠️ Technology Stack

### Backend
- **Framework**: NestJS (Node.js, TypeScript)
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: class-validator
- **Security**: bcrypt for password hashing

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Charts**: Recharts
- **State**: React Context API

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB (local or cloud)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd polling-system-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file**
   ```env
   MONGO_URI=mongodb://localhost:27017/polling-system
   JWT_SECRET=your-super-secret-jwt-key-change-this
   PORT=3000
   ```

4. **Start the server**
   ```bash
   # Development mode
   npm run start:dev
   
   # Production mode
   npm run build
   npm run start:prod
   ```

Server runs at: `http://localhost:3000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd polling-system-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file**
   ```env
   VITE_API_URL=http://localhost:3000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

App runs at: `http://localhost:5173`

## 📖 Usage Guide

### Getting Started

1. **Create an Admin Account**
   - Visit: `http://localhost:5173/admin/register`
   - Register with username, email, and password

2. **Create a Regular User Account**
   - Visit: `http://localhost:5173/register`
   - Register as a regular user

3. **Create Your First Poll (Admin)**
   - Login as admin
   - Click "Create Poll"
   - Add title and at least 2 options
   - Set duration (1-120 minutes)
   - Optionally make it private and assign users
   - Submit

4. **Vote on a Poll (User)**
   - Login as regular user
   - Browse available polls
   - Click on a poll to view details
   - Select an option and vote
   - View results immediately

5. **View Voting History**
   - Login as regular user
   - Click "My Votes" in navigation
   - See all polls you've voted on

## 🎯 User Roles

### Admin
- ✅ Create, edit, delete polls
- ✅ View all poll results
- ✅ Assign users to private polls
- ✅ Access admin dashboard
- ❌ Cannot vote (view-only)

### Regular User
- ✅ Vote on accessible polls
- ✅ View results after voting
- ✅ Access voting history
- ✅ View profile
- ❌ Cannot create/edit/delete polls

## 🔒 Security Features

1. **Password Security**
   - Minimum 6 characters
   - Hashed with bcrypt (10 salt rounds)
   - Old password verification for changes

2. **Authentication**
   - JWT tokens with user ID, email, and role
   - Token stored in localStorage
   - Auto-logout on token expiry

3. **Authorization**
   - Role-based guards
   - Protected API endpoints
   - Private poll access control

4. **Validation**
   - Email format validation
   - Username uniqueness
   - Poll duration limits
   - Input sanitization

5. **Security Best Practices**
   - Generic error messages for login (no user enumeration)
   - CORS configuration
   - Environment variable protection

## 📊 Data Models

### User
```javascript
{
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  role: 'admin' | 'user',
  votedPolls: [ObjectId],
  createdAt: Date
}
```

### Poll
```javascript
{
  title: String,
  options: [{ text: String, votes: Number }],
  votes: [ObjectId],  // Users who voted
  createdBy: ObjectId,
  expiresAt: Date,
  durationMinutes: Number (1-120),
  isPrivate: Boolean,
  allowedUsers: [String],  // Usernames
  createdAt: Date,
  updatedAt: Date
}
```

## 🎨 UI Features

- **Responsive Design** - Mobile, tablet, desktop
- **Real-time Updates** - Vote counts update immediately
- **Success Messages** - Toast notifications for actions
- **Loading States** - Smooth loading indicators
- **Error Handling** - Clear, helpful error messages
- **Intuitive Navigation** - Clean, organized interface
- **Visual Feedback** - Hover effects, active states

## 📝 Validation Rules

### Registration
- **Username**: 3-20 characters, no spaces, unique
- **Email**: Valid format, unique
- **Password**: 6-50 characters

### Poll Creation
- **Title**: Required, non-empty
- **Options**: Minimum 2, non-empty
- **Duration**: 1-120 minutes, required

## 🔍 API Documentation

For detailed API endpoints, request/response formats, and examples, see:
- Backend README: `polling-system-backend/README.md`
- Frontend README: `polling-system-frontend/README.md`

## 🐛 Known Limitations

1. **Vote Tracking**: Currently doesn't track which specific option each user voted for (shows only that user voted)
2. **Real-time Updates**: Requires page refresh to see new votes
3. **Admin Registration**: URL is unprotected (consider securing in production)
4. **Poll Editing**: Editing resets the expiry timer
5. **Delete Protection**: No soft delete (permanent deletion)

## 🚀 Deployment

### Backend Deployment
1. Set production environment variables
2. Build: `npm run build`
3. Deploy to: Heroku, AWS, DigitalOcean, etc.
4. Ensure MongoDB is accessible
5. Enable HTTPS

### Frontend Deployment
1. Update `VITE_API_URL` to production backend URL
2. Build: `npm run build`
3. Deploy `dist/` folder to: Vercel, Netlify, etc.
4. Configure redirects for SPA

## 🧪 Testing

```bash
# Backend tests
cd polling-system-backend
npm run test

# Frontend linting
cd polling-system-frontend
npm run lint
```

## 📦 Production Checklist

- [ ] Change JWT secret to strong random string
- [ ] Use production MongoDB instance
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Add rate limiting
- [ ] Enable request logging
- [ ] Set up error monitoring
- [ ] Add database backups
- [ ] Review and audit code
- [ ] Test all features thoroughly

## 🤝 Contributing

This is an educational project. Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## ⚠️ Important Notes

1. **Security**: This is a learning project. Review security practices before production use.
2. **JWT Secret**: Always use a strong, unique secret in production.
3. **Database**: Implement proper backups and security.
4. **Environment Variables**: Never commit `.env` files.
5. **Testing**: Add comprehensive tests before production.

## 📄 License

This project is open source and available for educational purposes.

## 🤖 AI Usage Disclosure

This project was developed with the assistance of AI tools (Claude/ChatGPT) for:
- Project architecture and structure
- Code scaffolding and boilerplate
- Best practices implementation
- Bug fixing and optimization
- Documentation and README files
- Feature enhancements

**All code has been reviewed, tested, and customized for this application.**

The AI assistance was used to:
- Speed up development
- Ensure best practices
- Provide comprehensive documentation
- Implement security features
- Create a production-ready structure

**Please review all code carefully before production use.**

## 👨‍💻 Development

- Backend runs on: `http://localhost:3000`
- Frontend runs on: `http://localhost:5173`
- MongoDB: `mongodb://localhost:27017/polling-system`

## 📞 Support

For issues, questions, or contributions:
- Check existing documentation
- Review code comments
- Test in development environment first

---

**Built with using NestJS, React, MongoDB, and modern web technologies**

