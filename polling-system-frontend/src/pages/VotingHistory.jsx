import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Loading from '../components/Loading';
import { getTimeRemaining } from '../utils/poll';

export default function VotingHistory() {
  const [votedPolls, setVotedPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVotedPolls = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/auth/voted-polls');
        setVotedPolls(res.data || []);
      } catch (err) {
        setError('Failed to load voting history');
      } finally {
        setLoading(false);
      }
    };
    fetchVotedPolls();
  }, []);

  if (loading) return <Loading />;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">My Voting History</h1>
      
      {votedPolls.length === 0 ? (
        <div className="bg-white p-6 rounded shadow text-center text-gray-500">
          You haven't voted on any polls yet.
        </div>
      ) : (
        <div className="space-y-4">
          {votedPolls.map((poll) => {
            const totalVotes = (poll.options || []).reduce((sum, o) => sum + (o.votes || 0), 0);
            const isExpired = poll.expiresAt && new Date(poll.expiresAt) < new Date();

            return (
              <div key={poll._id} className="bg-white p-4 rounded shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{poll.title}</h3>
                    <div className="text-sm text-gray-500 mt-1">
                      Status: {isExpired ? 'Expired' : 'Active'} • {getTimeRemaining(poll.expiresAt)}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Total votes: {totalVotes}
                    </div>
                    
                    <div className="mt-3">
                      <div className="text-sm font-medium mb-2">Results:</div>
                      {(poll.options || []).map((option, idx) => {
                        const percentage = totalVotes > 0 ? ((option.votes / totalVotes) * 100).toFixed(1) : 0;
                        return (
                          <div key={idx} className="mb-2">
                            <div className="flex justify-between text-sm mb-1">
                              <span>{option.text}</span>
                              <span className="font-medium">{option.votes} votes ({percentage}%)</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div className="ml-4">
                    <Link
                      to={`/polls/${poll._id}`}
                      className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

