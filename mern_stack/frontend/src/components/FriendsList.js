import React, { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import '../styles/FriendsList.css';

const FriendsList = () => {
  const { user } = useAuthContext();
  const [friends, setFriends] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFriends = async () => {
      if (!user) return;

      try {
        const response = await fetch(`/api/user/${user._id}/friends`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch friends");
        }
        const data = await response.json();
        setFriends(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchFriends();
  }, [user]);

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="friends-list">
      <h2>Your Friends</h2>
      <ul>
        {friends.length > 0 ? (
          friends.map((friend) => (
            <li key={friend._id}>{friend.username || friend.email}</li>
          ))
        ) : (
          <p>No friends yet.</p>
        )}
      </ul>
    </div>
  );
};

export default FriendsList;