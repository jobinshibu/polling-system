import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { isActive, getTimeRemaining } from '../utils/poll';

export default function PollCard({ poll }) {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [error, setError] = useState('');
  const [voted, setVoted] = useState(poll.votes?.includes(user?._id) || false); // Check if user voted

  const totalVotes = (poll.options || []).reduce((sum, o) => sum + (o.votes || 0), 0);
  const active = isActive(poll);
  const isAdmin = user?.role?.toLowerCase() === 'admin';

  const handleVote = async (optionIndex) => {
    if (!token) {
      setError('Please log in to vote');
      return;
    }
    if (!active) {
      setError('This poll has expired');
      return;
    }
    if (voted) {
      setError('You have already voted');
      return;
    }

    try {
      await api.put(`/poll/${poll._id}/vote`, { optionIndex });
      setVoted(true);
      setError('');
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || 'Voting failed');
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow flex justify-between items-center">
      <div>
        <h3 className="font-semibold">{poll.title}</h3>
        <div className="text-sm text-gray-500">Status: {active ? 'Active' : 'Expired'} • {getTimeRemaining(poll.expiresAt)}</div>
        <div className="text-sm text-gray-600 mt-2">Total votes: {totalVotes}</div>
        {error && <div className="text-red-600 mt-2">{error}</div>}
        {isAdmin && <div className="mt-2 text-blue-600 text-sm">Admins can only view results</div>}
        {!isAdmin && !voted && active && (
          <div className="mt-2">
            {poll.options.map((opt, index) => (
              <button
                key={index}
                onClick={() => handleVote(index)}
                className="mt-1 px-3 py-1 bg-blue-500 text-white rounded mr-2"
              >
                {opt.text} ({opt.votes || 0} votes)
              </button>
            ))}
          </div>
        )}
        {!isAdmin && voted && <div className="mt-2 text-green-600">You have voted!</div>}
      </div>
      <div className="space-x-2">
        <Link to={`/polls/${poll._id}`} className="px-3 py-2 bg-blue-600 text-white rounded">Open</Link>
      </div>
    </div>
  );
}