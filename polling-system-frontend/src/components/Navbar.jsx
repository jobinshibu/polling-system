import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdmin = user?.role ? user.role.toLowerCase() === 'admin' : false; 

  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <Link to={isAdmin ? '/admin/polls' : '/polls'} className="mr-4">Polls</Link>
          {user && !isAdmin && <Link to="/voting-history" className="mr-4">My Votes</Link>}
          {user && <Link to="/profile" className="mr-4">Profile</Link>}
        </div>
        <div>
          {user ? (
            <button onClick={handleLogout} className="px-3 py-1 bg-red-600 rounded">Logout</button>
          ) : (
            <>
              <Link to="/login" className="mr-4">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}