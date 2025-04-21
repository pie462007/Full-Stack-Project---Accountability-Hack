import { useAuthContext } from "../hooks/useAuthContext";
import { useState, useEffect, useCallback } from "react";
import "../styles/Friends.css";

function Friends() {
  const { user } = useAuthContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [message, setMessage] = useState("");

  // 1) Fetch pending requests for the CURRENT user
  const loadPending = useCallback(async () => {
    if (!user || !user._id) return;
    try {
      const res = await fetch(`/api/user/${user._id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (!res.ok) throw new Error("Failed to load pending");
      const json = await res.json();
      setPendingRequests(json.friendship.pending || []);
    } catch (err) {
      console.error("Error loading pending requests:", err);
    }
  }, [user]);

  // Run loadPending whenever user._id changes (e.g. you switch accounts)
  useEffect(() => {
    loadPending();
  }, [loadPending]);

  // 2) Search for users by username or email
  useEffect(() => {
    if (!user || !user._id || !searchTerm.trim()) {
      setResults([]);
      return;
    }
    const fetchMatches = async () => {
      try {
        const res = await fetch(
          `/api/user?search=${encodeURIComponent(searchTerm)}&currentUserId=${user._id}`,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        if (!res.ok) throw new Error("Search failed");
        const json = await res.json();
        setResults(json);
      } catch (err) {
        console.error("Search error:", err);
      }
    };
    fetchMatches();
  }, [searchTerm, user]);

  // 3) Send a friend request
  const handleAddFriend = async (targetUserId) => {
    if (!user || !user._id) return;
    try {
      const res = await fetch("/api/user/send-friend-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          userId: user._id,
          targetUserId,
        }),
      });
      const data = await res.json();
      setMessage(data.message || "Friend request sent.");
    } catch (err) {
      console.error("Friend request error:", err);
      setMessage("Failed to send friend request.");
    }
  };

  // 4) Accept a friend request — then reload from server
  const handleAcceptFriend = async (incomingUserId) => {
    if (!user || !user._id) return;
    try {
      const res = await fetch("/api/user/accept-friend-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          userId: user._id,
          incomingUserId,
        }),
      });
      const data = await res.json();
      setMessage(data.message || "Friend request accepted.");
    } catch (err) {
      console.error("Accept request error:", err);
      setMessage("Failed to accept friend request.");
    } finally {
      // ALWAYS re‑load from the server so the UI reflects the DB
      await loadPending();
    }
  };

  return (
    <div className="friends-div">
      {/* Find Friends */}
      <div className="find-friends">
        <h2>Find Friends</h2>
        <input
          className="friends-search-input"
          type="text"
          placeholder="Search by username or email..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <div className="search-results">
          {results.length ? (
            results.map(u => (
              <div key={u._id} className="search-item">
                <span>{u.username || u.email}</span>
                <button onClick={() => handleAddFriend(u._id)}>Add</button>
              </div>
            ))
          ) : (
            searchTerm && <p>No users found.</p>
          )}
          {message && <p className="friend-message">{message}</p>}
        </div>
      </div>

      {/* Pending Friend Requests */}
      <div className="manage-friends">
        <h2>Pending Friend Requests</h2>
        {pendingRequests.length ? (
          pendingRequests.map(u => (
            <div key={u._id} className="search-item">
              <span>{u.username || u.email}</span>
              <button onClick={() => handleAcceptFriend(u._id)}>
                Accept
              </button>
            </div>
          ))
        ) : (
          <p>No pending requests.</p>
        )}
      </div>
    </div>
  );
}

export default Friends;

