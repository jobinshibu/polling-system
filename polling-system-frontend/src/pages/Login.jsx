import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please provide a valid email address');
      return false;
    }

    // Don't validate password length on login for security reasons
    // Backend will handle authentication and return appropriate error
    if (!password) {
      setError('Password is required');
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
      const { user } = await login(email, password); // Use returned user
      if (user.role === 'admin') {
        navigate('/admin/polls');
      } else {
        navigate('/polls');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Login</h2>
      <form onSubmit={submit} className="space-y-3">
        <div>
          <label className="block text-sm">Email</label>
          <input className="w-full border p-2 rounded" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm">Password</label>
          <input type="password" className="w-full border p-2 rounded" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        {error && <div className="text-red-600">{error}</div>}
        <div>
          <button disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </form>
    </div>
  );
}