# Polling System - Backend

A secure polling system backend built with NestJS, MongoDB, and JWT authentication. This application enables users to create, vote on, and manage polls with role-based access control.

## 🚀 Features

### Authentication & Authorization
- **Secure User Registration** with email validation
- **Password Hashing** using bcrypt
- **JWT Token-based Authentication**
- **Role-based Access Control** (Admin/User)
- **Protected Routes** using Guards and Decorators

### Polling System
- **Create Polls** (Admin only)
  - Custom title and multiple options (minimum 2)
  - Duration setting (1-120 minutes)
  - Public or Private visibility
- **Vote on Polls** (Regular users only)
  - One vote per user per poll
  - Real-time vote counting
  - Duplicate vote prevention
- **View Results**
  - Admins can view all poll results
  - Users can view results after voting or when poll expires
- **Poll Management**
  - Edit active polls (Admin only)
  - Delete polls (Admin only)
  - Auto-expiry based on duration
- **Private Polls**
  - Assign specific users who can vote
  - Only visible to assigned users and admins

### User Management
- **Profile Management**
  - View user profile
  - Change password (with old password verification)
- **Voting History**
  - View all polls you've voted on
  - See complete results and statistics
- **Admin User List**
  - Fetch all regular users (for private poll assignment)

## 🛠️ Technology Stack

- **Framework**: NestJS (Node.js)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Security**: bcrypt
- **Validation**: class-validator
- **Language**: TypeScript

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## 🔧 Installation

1. **Clone the repository**
   ```bash
   cd polling-system-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env` file in the root directory:
   ```env
   MONGO_URI=mongodb://localhost:27017/polling-system
   JWT_SECRET=your-super-secret-jwt-key-change-this
   PORT=3000
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

## 🚀 Running the Application

### Development Mode
```bash
npm run start:dev
```

### Production Mode
```bash
npm run start:prod
```

### Watch Mode
```bash
npm run start
```

The server will start on `http://localhost:3000`

## 📡 API Endpoints

### Authentication Routes (`/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login user | No |
| GET | `/auth/profile` | Get user profile | Yes |
| PUT | `/auth/profile` | Update password | Yes |
| GET | `/auth/users` | Get all regular users | Yes (Admin) |
| GET | `/auth/voted-polls` | Get user's voting history | Yes |

### Poll Routes (`/poll`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/poll` | List accessible polls | Yes |
| GET | `/poll/:id` | Get poll details | Yes |
| POST | `/poll` | Create new poll | Yes (Admin) |
| PUT | `/poll/:id` | Update poll | Yes (Admin) |
| DELETE | `/poll/:id` | Delete poll | Yes (Admin) |
| PUT | `/poll/:id/vote` | Vote on a poll | Yes (User) |

## 📊 Data Models

### User Schema
```typescript
{
  username: string (unique, required)
  email: string (unique, required)
  password: string (hashed, required)
  role: 'admin' | 'user' (default: 'user')
  votedPolls: ObjectId[] (references to Poll)
  createdAt: Date
}
```

### Poll Schema
```typescript
{
  title: string (required)
  options: [{ text: string, votes: number }] (min 2)
  votes: ObjectId[] (user IDs who voted)
  createdBy: ObjectId (reference to User)
  expiresAt: Date
  durationMinutes: number (1-120, default: 60)
  isPrivate: boolean (default: false)
  allowedUsers: string[] (usernames for private polls)
  createdAt: Date
  updatedAt: Date
}
```

## 🔒 Security Features

1. **Password Security**
   - Passwords hashed with bcrypt (salt rounds: 10)
   - Minimum 6 characters required
   - Old password verification for password changes

2. **JWT Authentication**
   - Tokens include user ID, email, and role
   - Protected routes validate tokens
   - Stateless authentication

3. **Role-Based Access Control**
   - `@Roles('admin')` decorator for admin-only routes
   - RolesGuard checks user permissions
   - Admins cannot vote (view-only access)

4. **Input Validation**
   - Email format validation
   - Username uniqueness check
   - Poll duration limits (max 120 minutes)
   - Minimum 2 options per poll

5. **Error Handling**
   - Generic login errors (security)
   - Duplicate vote prevention
   - Expired poll checks
   - Private poll access control

## 🎯 Key Features Implementation

### Private Poll Access Control
- Poll creator has full access
- All admins can view all polls
- Regular users see only:
  - Public polls
  - Private polls they created
  - Private polls they're assigned to

### Poll Expiration
- Automatically calculated based on `durationMinutes`
- Expired polls cannot be voted on
- Expired polls cannot be edited
- Results remain accessible

### Voting Rules
- One vote per user per poll
- Admins cannot vote (view-only)
- Users must have access to private polls
- Vote tracking in user's `votedPolls` array

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📝 Validation Rules

### Registration
- **Username**: 3-20 characters, no spaces
- **Email**: Valid email format
- **Password**: 6-50 characters

### Poll Creation
- **Title**: Required
- **Options**: At least 2 options required
- **Duration**: 1-120 minutes (required)

## 🌐 CORS Configuration

Currently configured for frontend at `http://localhost:5173`

To change:
```typescript
// src/main.ts
app.enableCors({
  origin: 'your-frontend-url',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  credentials: true,
});
```

## 📦 Project Structure

```
src/
├── auth/
│   ├── auth.controller.ts      # Authentication endpoints
│   ├── auth.service.ts         # Auth business logic
│   ├── auth.module.ts          # Auth module
│   ├── auth.dto.ts             # DTOs for validation
│   ├── jwt.strategy.ts         # JWT strategy
│   ├── roles.guard.ts          # Role-based guard
│   ├── roles.decorator.ts      # Roles decorator
│   ├── get-user.decorator.ts   # User extractor
│   ├── users.schema.ts         # User model
│   └── poll.schema.ts          # Poll model
├── poll/
│   ├── poll.controller.ts      # Poll endpoints
│   ├── poll.service.ts         # Poll business logic
│   ├── poll.module.ts          # Poll module
│   └── poll.dto.ts             # Poll DTOs
├── app.module.ts               # Root module
└── main.ts                     # Application entry
```

## 🤝 Contributing

This is a learning project. Contributions are welcome!

## ⚠️ Important Notes

1. **Change JWT Secret**: Always use a strong, unique JWT secret in production
2. **Environment Variables**: Never commit `.env` file to version control
3. **Database Security**: Use proper MongoDB authentication in production
4. **HTTPS**: Always use HTTPS in production
5. **Rate Limiting**: Consider adding rate limiting for production

## 📄 License

This project is open source and available for educational purposes.

## 🤖 AI Usage Disclosure

This project was developed with the assistance of AI tools (Claude/ChatGPT) for:
- Code scaffolding and boilerplate generation
- Best practices implementation
- Bug fixing and optimization
- Documentation

All code has been reviewed and tested. Please review carefully before production use.

---

**Built with NestJS** 🐈
