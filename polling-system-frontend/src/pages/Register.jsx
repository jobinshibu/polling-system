import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [payload, setPayload] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    // Username validation
    if (!payload.name || payload.name.trim().length < 3) {
      setError('Username must be at least 3 characters long');
      return false;
    }
    if (payload.name.length > 20) {
      setError('Username cannot be longer than 20 characters');
      return false;
    }
    if (/\s/.test(payload.name)) {
      setError('Username cannot contain spaces');
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(payload.email)) {
      setError('Please provide a valid email address');
      return false;
    }

    // Password validation
    if (payload.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (payload.password.length > 50) {
      setError('Password cannot be longer than 50 characters');
      return false;
    }

    return true;
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await register(payload);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Register</h2>
      <form onSubmit={submit} className="space-y-3">
        <div>
          <label className="block text-sm">Name</label>
          <input className="w-full border p-2 rounded" value={payload.name} onChange={e => setPayload({ ...payload, name: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm">Email</label>
          <input className="w-full border p-2 rounded" value={payload.email} onChange={e => setPayload({ ...payload, email: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm">Password</label>
          <input type="password" className="w-full border p-2 rounded" value={payload.password} onChange={e => setPayload({ ...payload, password: e.target.value })} />
        </div>
        {error && <div className="text-red-600">{error}</div>}
        <div>
          <button disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded">
            {loading ? 'Creating...' : 'Register'}
          </button>
        </div>
      </form>
    </div>
  );
}