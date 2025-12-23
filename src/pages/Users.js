import React, { useEffect, useState } from 'react';
import './Users.css';
import axios from 'axios';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError('');

        // Assuming you stored the admin token in localStorage
        const token = localStorage.getItem('adminToken');

        const { data } = await axios.get('http://localhost:3300/api/users');

        setUsers(data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <p>Loading users...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="page users-page">
      <h2>Users</h2>
      <div className="user-grid">
        {users.map(u => (
          <div key={u._id} className="user-card">
            <div className="avatar">
              {u.name.charAt(0)}
            </div>
            <div className="details">
              <h3>{u.name}</h3>
              <p>{u.email}</p>
              <p>{u.phone || 'N/A'}</p>
              <span className={`status ${u.status?.toLowerCase() || 'active'}`}>
                {u.status || 'Active'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
