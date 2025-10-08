import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminRegister from './pages/AdminRegister';
import Polls from './pages/Polls';
import PollDetails from './pages/PollDetails';
import AdminDashboard from './pages/AdminDashboard';
import CreatePoll from './pages/CreatePoll';
import EditPoll from './pages/EditPoll';
import Profile from './pages/Profile';
import VotingHistory from './pages/VotingHistory';
import PrivateRoute from './components/PrivateRoute';

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Navigate to="/polls" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/register" element={<AdminRegister />} />

          {/* Authenticated routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/polls" element={<Polls />} />
            <Route path="/polls/:id" element={<PollDetails />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/voting-history" element={<VotingHistory />} />
          </Route>

          {/* Admin-only routes */}
          <Route element={<PrivateRoute roles={['Admin']} />}>
            <Route path="/admin/polls" element={<AdminDashboard />} />
            <Route path="/admin/polls/create" element={<CreatePoll />} />
            <Route path="/admin/polls/:id/edit" element={<EditPoll />} />
            <Route path="/admin/polls/:id/results" element={<PollDetails />} />
          </Route>

          <Route path="*" element={<div>Page not found</div>} />
        </Routes>
      </main>
    </div>
  );
}