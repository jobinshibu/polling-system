import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function PollForm({ initial = {}, onSubmit }) {
  const [title, setTitle] = useState(initial.title || '');
  const [options, setOptions] = useState(initial.options?.map(o => o.text) || ['', '']);
  const [duration, setDuration] = useState(initial.durationMinutes || 60);
  const [isPrivate, setIsPrivate] = useState(!!initial.isPrivate);
  const [allowedUsers, setAllowedUsers] = useState(initial.allowedUsers || []);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/auth/users');
        setAvailableUsers(res.data || []);
      } catch (err) {
        // Silent fail
      }
    };
    fetchUsers();
  }, []);

  const addOption = () => setOptions([...options, '']);
  const removeOption = (i) => {
    if (options.length > 2) setOptions(options.filter((_, idx) => idx !== i));
    else setError('At least 2 options are required');
  };
  const updateOption = (i, v) => {
    const newOptions = options.map((o, idx) => idx === i ? v : o);
    setOptions(newOptions);
    // Check options count and set error if less than 2
    const filteredOptions = newOptions.map(o => o.trim()).filter(Boolean);
    if (filteredOptions.length < 2) setError('At least 2 options are required');
    else if (!title.trim()) setError('Title is required');
    else if (duration <= 0 || duration > 120) setError('Duration must be between 1 and 120 minutes');
    else setError('');
  };

  const updateTitle = (v) => {
    setTitle(v);
    if (!v.trim()) setError('Title is required');
    else if (options.map(o => o.trim()).filter(Boolean).length < 2) setError('At least 2 options are required');
    else if (duration <= 0 || duration > 120) setError('Duration must be between 1 and 120 minutes');
    else setError('');
  };

  const updateDuration = (v) => {
    const newDuration = Number(v);
    setDuration(newDuration);
    if (newDuration <= 0 || newDuration > 120) setError('Duration must be between 1 and 120 minutes');
    else if (!title.trim()) setError('Title is required');
    else if (options.map(o => o.trim()).filter(Boolean).length < 2) setError('At least 2 options are required');
    else setError('');
  };

  const submit = (e) => {
    e.preventDefault();
    setError('');
    const filteredOptions = options.map(o => o.trim()).filter(Boolean);
    if (!title.trim()) return setError('Title is required');
    if (filteredOptions.length < 2) return setError('At least 2 options are required');
    if (duration <= 0 || duration > 120) return setError('Duration must be between 1 and 120 minutes');

    const payload = {
      title,
      options: filteredOptions.map(text => ({ text })),
      durationMinutes: duration,
      isPrivate,
      allowedUsers,
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={submit} className="bg-white p-4 rounded shadow space-y-3">
      <div>
        <label className="block text-sm">Title</label>
        <input
          className="w-full border p-2 rounded"
          value={title}
          onChange={e => updateTitle(e.target.value)}
          placeholder="Enter poll title"
        />
      </div>

      <div>
        <label className="block text-sm">Options</label>
        <div className="space-y-2">
          {options.map((opt, i) => (
            <div key={i} className="flex gap-2">
              <input
                className="flex-1 border p-2 rounded"
                value={opt}
                onChange={e => updateOption(i, e.target.value)}
                placeholder={`Option ${i + 1}`}
              />
              {options.length > 2 && (
                <button
                  type="button"
                  className="px-2 bg-red-500 text-white rounded"
                  onClick={() => removeOption(i)}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addOption} className="px-3 py-1 bg-gray-200 rounded">Add option</button>
          {options.length < 2 && <div className="text-red-600 text-sm">At least 2 options are required</div>}
        </div>
      </div>

      <div>
        <label className="block text-sm">Duration (minutes, max 120)</label>
        <input
          type="number"
          min="1"
          max="120"
          value={duration}
          onChange={e => updateDuration(e.target.value)}
          className="w-32 border p-2 rounded"
        />
      </div>

      <div>
        <label className="inline-flex items-center">
          <input type="checkbox" checked={isPrivate} onChange={e => setIsPrivate(e.target.checked)} />
          <span className="ml-2">Private poll</span>
        </label>
      </div>

      {isPrivate && (
        <div>
          <label className="block text-sm mb-2">Select Users Who Can Vote</label>
          <div className="border rounded p-3 max-h-48 overflow-y-auto space-y-2">
            {availableUsers.length === 0 ? (
              <div className="text-gray-500 text-sm">No users available</div>
            ) : (
              availableUsers.map((user) => (
                <label key={user._id} className="flex items-center space-x-2 hover:bg-gray-50 p-1 rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allowedUsers.includes(user.username)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setAllowedUsers([...allowedUsers, user.username]);
                      } else {
                        setAllowedUsers(allowedUsers.filter(u => u !== user.username));
                      }
                    }}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">
                    {user.username} <span className="text-gray-500">({user.email})</span>
                  </span>
                </label>
              ))
            )}
          </div>
          {allowedUsers.length > 0 && (
            <div className="text-sm text-gray-600 mt-2">
              Selected: {allowedUsers.join(', ')}
            </div>
          )}
        </div>
      )}

      {error && <div className="text-red-600">{error}</div>}

      <div>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
          Save
        </button>
      </div>
    </form>
  );
}