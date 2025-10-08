import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Loading from '../components/Loading';
import SuccessMessage from '../components/SuccessMessage';
import { getTimeRemaining } from '../utils/poll';

export default function AdminDashboard() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetch = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/poll');
      setPolls(res.data || []);
    } catch (err) {
      setError('Failed to load polls: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const remove = async (pollToDelete) => {
    const totalVotes = (pollToDelete.options || []).reduce((sum, o) => sum + (o.votes || 0), 0);
    const confirmMsg = totalVotes > 0 
      ? `This poll has ${totalVotes} vote${totalVotes > 1 ? 's' : ''}. Are you sure you want to delete it?`
      : 'Are you sure you want to delete this poll?';
    
    if (!confirm(confirmMsg)) return;
    
    try {
      await api.delete(`/poll/${pollToDelete._id}`);
      setSuccess('Poll deleted successfully!');
      fetch();
    } catch (err) {
      setError('Delete failed: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) return <Loading />;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div>
      <SuccessMessage message={success} onClose={() => setSuccess('')} />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">My Polls</h1>
        <Link to="/admin/polls/create" className="px-3 py-2 bg-green-600 text-white rounded">Create Poll</Link>
      </div>
      <div className="space-y-3">
        {polls.length === 0 && !loading && <div>No polls yet.</div>}
        {polls.map(p => (
          <div key={p._id} className="bg-white p-3 rounded shadow flex justify-between items-center">
            <div>
              <div className="font-semibold">{p.title}</div>
              <div className="text-sm text-gray-500">{getTimeRemaining(p.expiresAt)}</div>
            </div>
            <div className="space-x-2">
              <Link to={`/admin/polls/${p._id}/edit`} className="px-3 py-1 bg-yellow-500 text-white rounded">Edit</Link>
              <Link to={`/admin/polls/${p._id}/results`} className="px-3 py-1 bg-blue-500 text-white rounded">View Results</Link>
              <button onClick={() => remove(p)} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}