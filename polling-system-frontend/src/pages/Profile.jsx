import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import SuccessMessage from '../components/SuccessMessage';

export default function Profile() {
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    oldPassword: '',
    password: '',
    confirmPassword: ''
  });

  const fetchProfile = async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/auth/profile');
      setProfile(res.data);
      setFormData({
        oldPassword: '',
        password: '',
        confirmPassword: ''
      });
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [token]);

  const validateForm = () => {
    // Old password is required
    if (!formData.oldPassword) {
      setError('Please enter your current password');
      return false;
    }
    
    // New password is required
    if (!formData.password) {
      setError('Please enter a new password');
      return false;
    }
    
    // Password validation
    if (formData.password.length < 6) {
      setError('New password must be at least 6 characters long');
      return false;
    }
    if (formData.password.length > 50) {
      setError('New password cannot be longer than 50 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);
    try {
      await api.put('/auth/profile', { 
        oldPassword: formData.oldPassword,
        password: formData.password 
      });
      setSuccess('Password changed successfully!');
      setEditing(false);
      setFormData({ oldPassword: '', password: '', confirmPassword: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setError('');
    setFormData({
      oldPassword: '',
      password: '',
      confirmPassword: ''
    });
  };

  if (loading && !profile) return <div>Loading...</div>;
  if (error && !profile) return <div className="text-red-600">{error}</div>;
  if (!profile && !user) return null;

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <SuccessMessage message={success} onClose={() => setSuccess('')} />
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Profile</h2>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Change Password
          </button>
        )}
      </div>

      {!editing ? (
        <div className="space-y-2">
          <div><strong>Username:</strong> {profile?.username || user?.username}</div>
          <div><strong>Email:</strong> {profile?.email || user?.email}</div>
          <div><strong>Role:</strong> {profile?.role || user?.role}</div>
        </div>
      ) : (
        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="mb-4 p-3 bg-gray-100 rounded">
            <div><strong>Username:</strong> {profile?.username}</div>
            <div><strong>Email:</strong> {profile?.email}</div>
            <div className="text-sm text-gray-600 mt-2">Username and email cannot be changed</div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Current Password</label>
            <input
              type="password"
              value={formData.oldPassword}
              onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })}
              className="w-full border p-2 rounded"
              placeholder="Enter current password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">New Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full border p-2 rounded"
              placeholder="Enter new password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Confirm New Password</label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full border p-2 rounded"
              placeholder="Confirm new password"
            />
          </div>

          {error && <div className="text-red-600 text-sm">{error}</div>}

          <div className="flex space-x-2">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              {loading ? 'Changing...' : 'Change Password'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}