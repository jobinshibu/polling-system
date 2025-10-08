---

# 🗳️ Polling System

A **full-stack polling application** designed and developed as part of a technical machine test.
The system enables secure voting, poll management, and real-time result tracking using a **NestJS backend** and a **React frontend**.

---

## 🌟 Overview

This project implements a real-world polling platform where **administrators** can create and manage polls, and **users** can vote and view live results.
It focuses on **authentication, role-based access, and data integrity**, following clean coding and architectural best practices.

Developed by **Jobin Shibu**, this project demonstrates the ability to build a complete and scalable application with secure backend logic and a modern, responsive frontend.

---

## 📁 Project Structure

```
polling-system/
├── polling-system-backend/     # NestJS API
│   ├── src/                    # Source files
│   ├── dist/                   # Compiled output
│   └── README.md               # Backend details
│
└── polling-system-frontend/    # React Application
    ├── src/                    # Source files
    ├── dist/                   # Production build
    └── README.md               # Frontend details
```

---

## ✨ Key Features

### 🔐 Authentication & Security

* User registration and login with JWT
* Password hashing using bcrypt
* Role-based access (Admin/User)
* Validation for email, password, and username
* Protected routes and API endpoints

### 📊 Poll Management

* **Admin**: Create, edit, and delete polls
* **Duration Control**: Polls auto-expire based on time set (1–120 minutes)
* **Visibility Control**: Public and private polls
* **Private Poll Assignment**: Add specific users to limited polls
* **Real-time Results**: Vote counts update dynamically

### 👥 User Experience

* Browse available polls (public + assigned)
* One vote per poll per user
* Instant access to poll results
* View voting history
* Manage personal profile

---

## 🧠 Roles and Permissions

| Role  | Create Poll | Edit Poll | Vote  | View Results | Manage Users |
| ----- | ----------- | --------- | ----- | ------------ | ------------ |
| Admin | ✅ Yes       | ✅ Yes     | ❌ No  | ✅ Yes        | ✅ Yes        |
| User  | ❌ No        | ❌ No      | ✅ Yes | ✅ Yes        | ❌ No         |

---

## 🛠️ Tech Stack

### **Backend (NestJS)**

* Node.js + TypeScript
* NestJS Framework
* MongoDB with Mongoose
* JWT Authentication
* class-validator for input validation
* bcrypt for password encryption
* CORS and Helmet for security

### **Frontend (React)**

* React 18 + Vite
* TailwindCSS for responsive design
* React Router v6 for navigation
* Axios for API communication
* Context API for state management
* Recharts for data visualization

---

## 🚀 Quick Start

### **Prerequisites**

* Node.js v16+
* MongoDB (local or cloud)

---

### 🧩 Backend Setup

```bash
cd polling-system-backend
npm install
```

Create `.env` file:

```env
MONGO_URI=mongodb://localhost:27017/polling-system
JWT_SECRET=your-jwt-secret
PORT=3000
```

Run the server:

```bash
npm run start:dev
```

➡️ Runs on: **[http://localhost:3000](http://localhost:3000)**

---

### 💻 Frontend Setup

```bash
cd polling-system-frontend
npm install
```

Create `.env` file:

```env
VITE_API_URL=http://localhost:3000
```

Run the app:

```bash
npm run dev
```

➡️ Runs on: **[http://localhost:5173](http://localhost:5173)**

---

## 🧭 Functional Flow

1. **Admin** registers → creates polls (public/private)
2. **Users** register → view available polls
3. **Users vote** once per poll → results update immediately
4. **Polls expire** automatically after set duration
5. **Admins** manage results, polls, and access

---

## 📊 Data Models

### User

```js
{
  username: String,
  email: String,
  password: String,
  role: 'admin' | 'user',
  votedPolls: [ObjectId],
  createdAt: Date
}
```

### Poll

```js
{
  title: String,
  options: [{ text: String, votes: Number }],
  createdBy: ObjectId,
  isPrivate: Boolean,
  allowedUsers: [String],
  votes: [ObjectId],
  expiresAt: Date,
  durationMinutes: Number,
  createdAt: Date
}
```

---

## 🎨 Frontend Highlights

* Modern, mobile-first UI with TailwindCSS
* Interactive dashboard for admins and users
* Real-time vote visualization with Recharts
* Clean navigation and visual feedback
* Toast notifications for actions and errors

---

## 🧪 Testing & Quality

```bash
# Backend
cd polling-system-backend
npm run test

# Frontend
cd polling-system-frontend
npm run lint
```

Includes validation, authentication, and functional tests for stability and consistency.

---

## 🔍 Implementation Highlights

* Modular folder structure for scalability
* Centralized API services and reusable components
* Environment-based configuration for easy deployment
* Comprehensive validation and error handling
* Secure password and token management
* RESTful API design following best practices

---

## 🤖 AI-Assisted Development

While the architecture, logic, and implementation were fully handled by me, **AI tools (like ChatGPT)** were used strategically for:

* Refining architectural design ideas
* Speeding up boilerplate generation
* Writing documentation and improving readability
* Debugging specific syntax or configuration issues

AI was used as a **coding assistant**

This approach reflects **modern development workflow**, showcasing the ability to combine engineering skills with AI productivity tools.

---

## 🧠 Key Learnings

* Implementing full authentication and authorization flow
* Managing state securely between frontend and backend
* Structuring a modular NestJS API
* Building scalable components in React
* Integrating real-time and role-based features efficiently

---

## 🎯 Project Goals

* Demonstrate complete full-stack development capability
* Implement clean, secure, and production-level architecture
* Deliver a polished UI/UX
* Showcase problem-solving and rapid development skills

---

## 👨‍💻 Developer

**Developed by:** Jobin Shibu
**Role:** Full-stack Developer
**Technologies:** React, NestJS, MongoDB, TypeScript, TailwindCSS
**Focus:** Scalable, secure, and maintainable full-stack applications

---

**A complete and production-style full-stack polling platform built with modern web technologies and best engineering practices.**

---
