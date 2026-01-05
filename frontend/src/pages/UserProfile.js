import React, { useEffect, useState } from "react";
import { api } from "../services/Api";

const UserProfile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (userId) {
      api.get(`/users/${userId}`)
        .then(res => setUser(res.data))
        .catch(err => console.error(err));
    }
  }, []);

  return (
    <div>
      {user ? (
        <>
          <h2>Welcome, {user.name}</h2>
          <p>Email: {user.email}</p>
        </>
      ) : (
        <p>Please login</p>
      )}
    </div>
  );
};

export default UserProfile;