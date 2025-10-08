import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import PollForm from '../components/PollForm';
import Loading from '../components/Loading';
import SuccessMessage from '../components/SuccessMessage';
import { isActive } from '../utils/poll';

export default function EditPoll(){
  const { id } = useParams();
  const navigate = useNavigate();
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetch = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/poll/${id}`);
      setPoll(res.data);
    } catch (err) {
      setError('Failed to fetch poll');
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{ fetch(); }, [id]);

  if (loading) return <Loading />;
  if (error) return <div>{error}</div>;
  if (!poll) return <div>Poll not found</div>;

  if (!isActive(poll)) {
    return <div>Cannot edit expired poll.</div>;
  }

  const submit = async (payload) => {
    setLoading(true);
    setError('');
    try {
      const updateDto = {
        title: payload.title,
        options: payload.options.map(opt => opt.text),
        durationMinutes: payload.durationMinutes,
        isPrivate: payload.isPrivate,
        allowedUsers: payload.allowedUsers,
      };
      await api.put(`/poll/${id}`, updateDto);
      setSuccess('Poll updated successfully!');
      setTimeout(() => navigate('/admin/polls'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update poll');
    } finally {
      setLoading(false);
    }
  };

  // transform poll to initial for PollForm
  const initial = {
    title: poll.title,
    options: poll.options.map(opt => ({ text: opt.text, votes: opt.votes })),
    durationMinutes: poll.durationMinutes || 60,
    isPrivate: poll.isPrivate || false,
    allowedUsers: poll.allowedUsers || [],
  };

  return (
    <div>
      <SuccessMessage message={success} onClose={() => setSuccess('')} />
      <h1 className="text-2xl font-semibold mb-4">Edit Poll</h1>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <PollForm key={poll._id} initial={initial} onSubmit={submit} />
    </div>
  );
}
