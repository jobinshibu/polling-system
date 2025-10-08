# Polling System - Frontend

A modern, responsive polling system frontend built with React, Vite, and TailwindCSS. This application provides an intuitive interface for creating, managing, and voting on polls.

## 🚀 Features

### User Authentication
- **Login/Register** with validation
- **Separate Admin Registration** page at `/admin/register`
- **JWT Token Storage** in localStorage
- **Protected Routes** with role-based access
- **Auto-redirect** based on authentication state

### For Regular Users
- **View Polls**
  - See all accessible public polls
  - Access private polls you're assigned to
  - Real-time status (Active/Expired)
  - Human-readable expiry times
- **Vote on Polls**
  - One-click voting on active polls
  - Visual feedback with success messages
  - Automatic result display after voting
- **Voting History**
  - View all polls you've voted on
  - See complete results and statistics
  - Track your participation
- **Profile Management**
  - View username, email, and role
  - Change password securely

### For Admins
- **Poll Management Dashboard**
  - Create new polls with custom options
  - Edit active polls
  - Delete polls (with vote count confirmation)
  - View all results
- **Advanced Poll Creation**
  - Set poll duration (1-120 minutes)
  - Create private polls
  - Multi-select user assignment for private polls
  - Real-time validation
- **View-Only Results**
  - Admins can view but not vote
  - Clear indication: "Admins can only view results"

### User Experience
- **Responsive Design** - Works on all devices
- **Success Messages** - Visual feedback for actions
- **Error Handling** - Clear, helpful error messages
- **Loading States** - Smooth loading indicators
- **Real-time Updates** - Vote counts update immediately
- **Intuitive Navigation** - Clean, organized interface

## 🛠️ Technology Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **State Management**: React Context API
- **Charts**: Recharts (for result visualization)
- **Language**: JavaScript (JSX)

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Running backend server (see backend README)

## 🔧 Installation

1. **Navigate to frontend directory**
   ```bash
   cd polling-system-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:3000
   ```

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```

The app will start on `http://localhost:5173`

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 📁 Project Structure

```
src/
├── components/
│   ├── Loading.jsx            # Loading spinner
│   ├── Navbar.jsx             # Navigation bar
│   ├── PollCard.jsx           # Poll list item
│   ├── PollForm.jsx           # Create/Edit poll form
│   ├── PrivateRoute.jsx       # Route protection
│   ├── ResultChart.jsx        # Vote results chart
│   └── SuccessMessage.jsx     # Success notification
├── pages/
│   ├── Login.jsx              # Login page
│   ├── Register.jsx           # User registration
│   ├── AdminRegister.jsx      # Admin registration
│   ├── Polls.jsx              # Poll listing
│   ├── PollDetails.jsx        # Single poll view
│   ├── AdminDashboard.jsx     # Admin poll management
│   ├── CreatePoll.jsx         # Create poll page
│   ├── EditPoll.jsx           # Edit poll page
│   ├── Profile.jsx            # User profile
│   └── VotingHistory.jsx      # User voting history
├── context/
│   └── AuthContext.jsx        # Authentication context
├── services/
│   └── api.js                 # Axios configuration
├── utils/
│   └── poll.js                # Poll utility functions
├── App.jsx                    # Main app component
└── main.jsx                   # Application entry
```

## 🎨 Key Components

### PollForm
Reusable form for creating and editing polls:
- Title input with validation
- Dynamic option management (add/remove)
- Duration selector (1-120 minutes)
- Private poll toggle
- Multi-select user assignment
- Frontend validation

### PollCard
Displays poll summary in lists:
- Poll title and status
- Expiry countdown
- Vote count
- Quick voting buttons
- Admin-specific UI

### ResultChart
Visual representation of poll results:
- Bar chart using Recharts
- Percentage calculations
- Color-coded options
- Responsive design

### SuccessMessage
Toast notification for user feedback:
- Auto-dismiss after 3 seconds
- Manual close button
- Smooth animations

## 🔒 Authentication Flow

1. **Login/Register** → Receive JWT token
2. **Store token** in localStorage
3. **Set Authorization header** for all API requests
4. **Context provider** manages auth state
5. **PrivateRoute** protects authenticated routes
6. **Role-based redirects** (Admin → `/admin/polls`, User → `/polls`)

## 🎯 Features in Detail

### Poll Expiry Display
Human-readable time format:
- "Expires in 1h 30m" (active)
- "Expired 45m ago" (expired)
- Updates on page load/navigation

### Private Poll Management
- Admin selects users from dropdown
- Shows username and email
- Multi-select with checkboxes
- Selected users highlighted in edit mode
- Only regular users listed (admins excluded)

### Validation
- **Login**: Email format, password required
- **Registration**: Username (3-20 chars, no spaces), email, password (6-50 chars)
- **Poll Creation**: Title required, minimum 2 options, duration 1-120 minutes
- **Password Change**: Old password verification, confirmation match

### Success Messages
Shown for:
- Poll created
- Poll updated
- Poll deleted
- Vote submitted
- Password changed

## 🎨 Styling

### TailwindCSS Classes
- Responsive utilities (`sm:`, `md:`, `lg:`)
- Flexbox and Grid layouts
- Color scheme: Blue (primary), Green (success), Red (danger/errors)
- Shadows and rounded corners
- Hover effects

### Custom Styles
- Green highlight for voted options (Voting History)
- Progress bars for vote percentages
- Loading spinners
- Toast notifications

## 📱 Responsive Design

- **Mobile**: Single column, stacked layout
- **Tablet**: Adaptive spacing and sizing
- **Desktop**: Multi-column where appropriate
- **Navigation**: Hamburger menu (if needed)

## 🔗 API Integration

All API calls go through `services/api.js`:
```javascript
// Axios instance with interceptors
- Base URL from environment
- Authorization header injection
- Error handling
- Token refresh logic (if needed)
```

### Endpoints Used
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /auth/profile` - Get user profile
- `PUT /auth/profile` - Update password
- `GET /auth/users` - List regular users (admin)
- `GET /auth/voted-polls` - Voting history
- `GET /poll` - List polls
- `GET /poll/:id` - Poll details
- `POST /poll` - Create poll (admin)
- `PUT /poll/:id` - Update poll (admin)
- `DELETE /poll/:id` - Delete poll (admin)
- `PUT /poll/:id/vote` - Vote on poll

## 🐛 Error Handling

- **Network errors**: "Failed to connect to server"
- **401 Unauthorized**: Auto-logout and redirect to login
- **400 Bad Request**: Display server error message
- **404 Not Found**: "Resource not found"
- **500 Server Error**: "Internal server error"

## ⚡ Performance Optimizations

- Vite for fast builds and HMR
- Code splitting with React Router
- Lazy loading (if implemented)
- Optimized images
- Minimal dependencies

## 🧪 Testing

```bash
# Run linter
npm run lint

# Fix linting issues
npm run lint:fix
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

Output will be in `dist/` directory.

### Deploy to Vercel/Netlify
1. Connect your Git repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variable: `VITE_API_URL`

## 🔧 Configuration Files

- `vite.config.js` - Vite configuration
- `tailwind.config.cjs` - TailwindCSS configuration
- `postcss.config.cjs` - PostCSS configuration
- `eslint.config.js` - ESLint rules

## 📝 Environment Variables

```env
VITE_API_URL=http://localhost:3000  # Backend API URL
```

Access in code:
```javascript
const apiUrl = import.meta.env.VITE_API_URL;
```

## 🎯 User Roles & Routes

### Public Routes
- `/login` - Login page
- `/register` - User registration
- `/admin/register` - Admin registration (unprotected URL)

### Protected Routes (User)
- `/polls` - View and vote on polls
- `/polls/:id` - Poll details
- `/profile` - User profile
- `/voting-history` - Voting history

### Protected Routes (Admin)
- `/admin/polls` - Poll management dashboard
- `/admin/polls/create` - Create new poll
- `/admin/polls/:id/edit` - Edit poll
- `/admin/polls/:id/results` - View results

## 🤖 AI Usage Disclosure

This frontend was developed with the assistance of AI tools (Claude/ChatGPT) for:
- Initial project scaffolding
- Component structure and boilerplate
- TailwindCSS styling patterns
- Form validation logic
- Best practices implementation
- Bug fixes and optimizations

All code has been reviewed, tested, and customized for this specific application. Please review carefully before production use.

## 📄 License

This project is open source and available for educational purposes.

---

**Built with ⚛️ React + ⚡ Vite + 🎨 TailwindCSS**
