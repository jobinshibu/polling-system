---

# 🗳️ Polling System - Backend

A secure and scalable **polling system backend** built with **NestJS**, **MongoDB**, and **JWT authentication**.
This API powers user registration, authentication, poll management, and voting features with **role-based access control**.

---

## 🚀 Key Features

### 🔐 Authentication & Authorization

* Secure **user registration** and **login**
* Passwords hashed with **bcrypt**
* **JWT-based authentication**
* **Role-based access control (RBAC)** for Admin and User
* **Guards and decorators** for protected routes

### 📊 Polling System

* **Admin Capabilities**

  * Create, edit, and delete polls
  * Set duration (1–120 minutes)
  * Choose public/private visibility
  * Assign users for private polls
  * View all poll results
* **User Capabilities**

  * View public and assigned private polls
  * Vote once per poll
  * View results after voting or when polls expire

### 👤 User Management

* View and update profile
* Change password securely
* Track all polls voted on
* Admins can list all regular users (for assigning private polls)

---

## 🧠 Tech Stack

* **Framework**: NestJS (Node.js)
* **Database**: MongoDB (via Mongoose ODM)
* **Authentication**: JWT (JSON Web Tokens)
* **Password Hashing**: bcrypt
* **Validation**: class-validator
* **Language**: TypeScript

---

## ⚙️ Setup Instructions

### Prerequisites

* Node.js (v16 or higher)
* MongoDB (local or cloud instance)

### Installation

```bash
cd polling-system-backend
npm install
```

### Environment Setup

Create a `.env` file in the root directory:

```env
MONGO_URI=mongodb://localhost:27017/polling-system
JWT_SECRET=your-secret-key
PORT=3000
```

### Run the Server

```bash
npm run start:dev
```

Server runs at: **[http://localhost:3000](http://localhost:3000)**

---

## 📡 API Endpoints Overview

### 🔑 Authentication Routes (`/auth`)

| Method | Endpoint            | Description            | Auth      |
| ------ | ------------------- | ---------------------- | --------- |
| POST   | `/auth/register`    | Register new user      | No        |
| POST   | `/auth/login`       | Login user             | No        |
| GET    | `/auth/profile`     | Get user profile       | ✅         |
| PUT    | `/auth/profile`     | Update password        | ✅         |
| GET    | `/auth/users`       | List all regular users | ✅ (Admin) |
| GET    | `/auth/voted-polls` | User voting history    | ✅         |

### 📋 Poll Routes (`/poll`)

| Method | Endpoint         | Description           | Auth      |
| ------ | ---------------- | --------------------- | --------- |
| GET    | `/poll`          | List accessible polls | ✅         |
| GET    | `/poll/:id`      | Get poll details      | ✅         |
| POST   | `/poll`          | Create new poll       | ✅ (Admin) |
| PUT    | `/poll/:id`      | Update poll           | ✅ (Admin) |
| DELETE | `/poll/:id`      | Delete poll           | ✅ (Admin) |
| PUT    | `/poll/:id/vote` | Vote on a poll        | ✅ (User)  |

---

## 🧩 Data Models

### 🧑 User Schema

```typescript
{
  username: string;
  email: string;
  password: string; // hashed
  role: 'admin' | 'user';
  votedPolls: ObjectId[];
  createdAt: Date;
}
```

### 📊 Poll Schema

```typescript
{
  title: string;
  options: [{ text: string; votes: number }];
  createdBy: ObjectId;
  expiresAt: Date;
  durationMinutes: number;
  isPrivate: boolean;
  allowedUsers: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 🛡️ Security Features

* **Password hashing** with bcrypt (salt rounds: 10)
* **JWT authentication** with expiry
* **Role-based access control** (`@Roles('admin')`)
* **Validation** via `class-validator`
* **Protected private polls** (only assigned users can vote)
* **Duplicate vote prevention**
* **Automatic poll expiry** after the set duration

---

## 🧭 Core Logic Highlights

### 🗳️ Voting Rules

* One vote per user per poll
* Admins have **view-only access**
* Users can only vote on accessible polls

### ⏱️ Poll Expiry

* Automatically expires based on `durationMinutes`
* Expired polls are **read-only**
* Results remain viewable

### 🔒 Access Control

* Admins → Full control of all polls
* Regular users → Only see assigned or public polls

---

## 🌐 CORS Configuration

Default:

```typescript
app.enableCors({
  origin: 'http://localhost:5173',
  methods: 'GET,POST,PUT,DELETE',
  credentials: true,
});
```

Change `origin` to your frontend URL as needed.

---

## 📂 Project Structure

```
src/
├── auth/
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.module.ts
│   ├── auth.dto.ts
│   ├── jwt.strategy.ts
│   ├── roles.guard.ts
│   ├── roles.decorator.ts
│   ├── users.schema.ts
│   └── poll.schema.ts
├── poll/
│   ├── poll.controller.ts
│   ├── poll.service.ts
│   ├── poll.module.ts
│   └── poll.dto.ts
├── app.module.ts
└── main.ts
```

---

## 🧠 AI Usage Disclosure

This backend was developed with the assistance of **AI tools (ChatGPT/GPT-5)** to improve:

* Project scaffolding and architecture setup
* DTO, module, and service generation
* Validation and security best practices
* Error handling and optimization
* Documentation and code standardization

All AI-assisted sections were **manually reviewed, tested, and customized** for this project to ensure clarity, maintainability, and production readiness.

---

**Built with 🧱 NestJS + 🍃 MongoDB + 🔐 JWT Authentication**

---
