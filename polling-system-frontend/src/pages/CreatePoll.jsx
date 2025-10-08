import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import PollForm from '../components/PollForm';
import SuccessMessage from '../components/SuccessMessage';

export default function CreatePoll() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const submit = async (payload) => {
    setLoading(true);
    setError('');
    try {
      const body = { 
        title: payload.title, 
        options: payload.options.map(o => o.text),
        durationMinutes: payload.durationMinutes,
        isPrivate: payload.isPrivate,
        allowedUsers: payload.allowedUsers
      };
      await api.post('/poll', body);
      setSuccess('Poll created successfully!');
      setTimeout(() => navigate('/admin/polls'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Create failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <SuccessMessage message={success} onClose={() => setSuccess('')} />
      <h1 className="text-2xl font-semibold mb-4">Create Poll</h1>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <PollForm onSubmit={submit} loading={loading} />
    </div>
  );
}