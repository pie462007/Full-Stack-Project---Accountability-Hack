import { useAuthContext } from "../hooks/useAuthContext"
import { useState, useEffect } from "react"
import "../styles/Friends.css"

function Friends() {
  const { user } = useAuthContext()
  const [searchTerm, setSearchTerm] = useState("")
  const [results, setResults]     = useState([])

  // Fetch matching users whenever searchTerm changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([])
      return
    }
    const fetchMatches = async () => {
      try {
        const res = await fetch(
          `/api/users?search=${encodeURIComponent(searchTerm)}`,
          { headers: { Authorization: `Bearer ${user.token}` } }
        )
        const json = await res.json()
        if (res.ok) setResults(json)
      } catch (err) {
        console.error("Search error:", err)
      }
    }
    fetchMatches()
  }, [searchTerm, user])

  return (
    <div className="friends-div">
      {/* Finding Friends Section */}
      <div className="find-friends">
        <h2>Find Friends</h2>
        <input
          className="friends-search-input"
          type="text"
          placeholder="Search for friends by username..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />

        <div className="search-results">
          {results.length
            ? results.map(u => (
                <div key={u._id} className="search-item">
                  <span>{u.username}</span>
                  <button onClick={() => /* call add‑friend API */ null}>
                    Add
                  </button>
                </div>
              ))
            : searchTerm && <p>No users found.</p>
          }
        </div>
      </div>

      {/* Managing Current Friends Section */}
      <div className="manage-friends">
        <h2>Manage Friends</h2>
        <p>View and manage your current friends here.</p>
        {/* …existing management UI… */}
      </div>
    </div>
  )
}

export default Friends

