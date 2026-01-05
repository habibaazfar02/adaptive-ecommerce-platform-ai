import React, { useEffect, useState } from 'react';
import api from '../services/Api';

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      api.get(`/users/${userId}`).then(response => {
        setUser(response.data);
      }).catch(err => {
        console.error('Error fetching user profile:', err);
      });
    }
  }, []);

  return (
    <div>
      {user ? (
        <div>
          <h2>Welcome, {user.name}</h2>
          <p>Email: {user.email}</p>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
};

export default Profile;
