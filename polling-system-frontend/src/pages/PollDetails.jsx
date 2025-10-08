import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import Loading from '../components/Loading';
import SuccessMessage from '../components/SuccessMessage';
import { useAuth } from '../context/AuthContext';
import { isActive, getTimeRemaining } from '../utils/poll';
import ResultChart from '../components/ResultChart';

export default function PollDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [voting, setVoting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetch = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/poll/${id}`);
      const data = res.data;
      if (data.votes && !Array.isArray(data.votes)) data.votes = [];
      setPoll(data);
    } catch (err) {
      setError('Failed to load poll: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, [id]);

  if (loading) return <Loading />;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!poll) return <div>Poll not found</div>;

  const active = isActive(poll);
  const hasVoted = user && poll.votes && Array.isArray(poll.votes)
    ? poll.votes.some(v => v && v.toString() === user._id?.toString())
    : false;
  const isAdmin = user?.role?.toLowerCase() === 'admin';

  const submitVote = async () => {
    if (!selected && selected !== 0) {
      setError('Select an option');
      return;
    }
    if (selected < 0 || selected >= (poll.options?.length || 0)) {
      setError('Invalid option selected');
      return;
    }
    setVoting(true);
    setError('');
    try {
      await api.put(`/poll/${id}/vote`, { optionIndex: selected });
      setSuccess('Vote submitted successfully!');
      await fetch();
    } catch (err) {
      setError('Vote failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setVoting(false);
    }
  };

  const totalVotes = (poll.options || []).reduce((s, o) => s + (o?.votes || 0), 0);
  const results = poll.options?.map((o, i) => ({
    label: o?.text || 'Unknown',
    value: o?.votes || 0,
    percentage: totalVotes > 0 ? Math.round((o?.votes / totalVotes) * 100) : 0,
  })) || [];

  return (
    <div className="max-w-2xl mx-auto">
      <SuccessMessage message={success} onClose={() => setSuccess('')} />
      <h2 className="text-2xl font-semibold mb-2">{poll.title || 'Untitled Poll'}</h2>
      <div className="text-sm text-gray-500 mb-4">Created by: {poll.createdBy?.username || poll.createdBy || 'Unknown'} • {getTimeRemaining(poll.expiresAt)}</div>

      {isAdmin || !active || hasVoted ? (
        // Show results for admins, expired polls, or after voting
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Results</h3>
          <div className="mb-4">Total votes: {totalVotes}</div>
          {results.length > 0 ? (
            <ResultChart data={results} />
          ) : (
            <div className="text-red-600">No data to display</div>
          )}
        </div>
      ) : (
        // Show voting form for regular users on active polls
        <div className="bg-white p-4 rounded shadow">
          <div className="space-y-2">
            {(poll.options || []).map((opt, idx) => (
              <label key={idx} className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="opt"
                  value={idx}
                  onChange={() => setSelected(idx)}
                />
                <span>{opt?.text || 'No option'}</span>
              </label>
            ))}
          </div>
          <div className="mt-4">
            <button
              disabled={voting}
              onClick={submitVote}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              {voting ? 'Voting...' : 'Vote'}
            </button>
            {error && <div className="text-red-600 mt-2">{error}</div>}
          </div>
        </div>
      )}
    </div>
  );
}