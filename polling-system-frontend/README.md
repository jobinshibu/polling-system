---

# 🗳️ Polling System - Frontend

A modern, responsive polling system built with **React**, **Vite**, and **TailwindCSS**, providing an intuitive interface for creating, managing, and voting on polls in real-time.

---

## 🚀 Key Features

### 👤 Authentication

* Secure **Login / Register** flow using JWT
* **Role-based access** (User / Admin)
* **Auto-redirect** based on user type
* Token stored in localStorage with proper validation

### 🧍‍♂️ User Capabilities

* View all **public and private polls**
* **Vote** on active polls (one-click)
* **Real-time result visualization**
* View **voting history** and participation stats
* Manage **profile and password**

### 🧑‍💼 Admin Capabilities

* Create, edit, and delete polls
* Assign users to **private polls**
* Set **poll duration** (1–120 minutes)
* View overall results and statistics
* Manage polls via a dedicated **Admin Dashboard**

### ✨ User Experience

* Fully **responsive** for mobile, tablet, and desktop
* **Smooth UI** with success/error messages
* **Instant updates** after voting
* **Clean, modern interface** with intuitive navigation

---

## 🛠️ Tech Stack

* **React 18** + **Vite** – Fast and modern frontend setup
* **TailwindCSS** – Utility-first responsive styling
* **React Router v6** – Route handling and protection
* **Axios** – API communication
* **Context API** – Auth and global state management
* **Recharts** – Poll result visualization

---

## ⚙️ Setup Instructions

### Prerequisites

* Node.js (v16 or higher)
* npm or yarn
* Backend server running (see backend README)

### Installation

```bash
cd polling-system-frontend
npm install
```

### Environment Setup

Create a `.env` file:

```env
VITE_API_URL=http://localhost:3000
```

### Run the App

```bash
npm run dev
```

The app runs on [http://localhost:5173](http://localhost:5173)

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.jsx
│   ├── PollForm.jsx
│   ├── PollCard.jsx
│   ├── ResultChart.jsx
│   └── SuccessMessage.jsx
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Polls.jsx
│   ├── PollDetails.jsx
│   ├── AdminDashboard.jsx
│   └── Profile.jsx
├── context/
│   └── AuthContext.jsx
├── services/
│   └── api.js
├── App.jsx
└── main.jsx
```

---

## 🔐 Authentication Flow

1. User logs in → Receives JWT token
2. Token stored in `localStorage`
3. Axios injects token into all requests
4. AuthContext manages session state
5. PrivateRoute guards authenticated pages
6. Role-based redirects (User/Admin)

---

## 📊 Core Components

### `PollForm`

* Reusable form for creating/editing polls
* Title, options, duration, and private poll settings
* Real-time validation and dynamic option handling

### `PollCard`

* Displays poll summary and status
* Shows expiry countdown and voting options

### `ResultChart`

* Visual poll result display using Recharts
* Responsive and percentage-based visualization

### `SuccessMessage`

* Clean toast feedback for actions like vote, create, or update

---

## 🔗 API Endpoints (Frontend Integration)

| Action          | Method | Endpoint         |
| --------------- | ------ | ---------------- |
| User Login      | POST   | `/auth/login`    |
| Register User   | POST   | `/auth/register` |
| Get Polls       | GET    | `/poll`          |
| Vote on Poll    | PUT    | `/poll/:id/vote` |
| Create Poll     | POST   | `/poll`          |
| Update Poll     | PUT    | `/poll/:id`      |
| Delete Poll     | DELETE | `/poll/:id`      |
| View Profile    | GET    | `/auth/profile`  |
| Change Password | PUT    | `/auth/profile`  |

---

## ⚡ Highlights

* Responsive UI (TailwindCSS)
* Real-time result updates
* Clean role-based navigation
* Comprehensive error and success handling
* Organized, scalable folder structure

---

## 🤖 AI Usage Disclosure

This frontend was developed with assistance from **AI tools (ChatGPT/GPT-5)** to improve:

* UI/UX design suggestions
* Component structure and modularization
* TailwindCSS styling patterns
* Form validation logic
* API integration and error handling
* Documentation and performance recommendations

All AI-assisted content was **manually reviewed, tested, and customized** for this specific project to ensure quality, reliability, and maintainability.

---

**Built with ⚛️ React + ⚡ Vite + 🎨 TailwindCSS**

---
