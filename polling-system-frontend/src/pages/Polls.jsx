import React, { useEffect, useState } from 'react';
import api from '../services/api';
import PollCard from '../components/PollCard';
import Loading from '../components/Loading';

export default function Polls() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetch = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/poll');
      setPolls(res.data);
    } catch (err) {
      setError('Failed to load polls: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  if (loading) return <Loading />;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Available Polls</h1>
      <div className="grid gap-4">
        {polls.length === 0 && <div>No polls found.</div>}
        {polls.map(p => <PollCard key={p._id} poll={p} />)}
      </div>
    </div>
  );
}