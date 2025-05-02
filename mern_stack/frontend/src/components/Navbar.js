import { Link } from 'react-router-dom'
import '../styles/Navbar.css'
import { useLogout } from '../hooks/useLogout'
import { useAuthContext } from '../hooks/useAuthContext'

const Navbar = () => {
  const { logout } = useLogout()
  const { user } = useAuthContext()

  const handleClick = () => {
    logout()
  }

  return (
    <header>
      <nav className="container">
        <div className="nav-title">
          <h1>Accountability Hack</h1>
        </div>
        <div className="header-div"> {/* 👈 changed back to retain green border */}
          <Link to="/">
            <h3>home</h3>
          </Link>
          <Link to="/friends">
            <h3>friends</h3>
          </Link>
          <Link to="/leaderboard">
            <h3>leaderboard</h3>
          </Link>

          {!user && (
            <>
              <Link to="/login">
                <h3>login</h3>
              </Link>
              <Link to="/signup">
                <h3>signup</h3>
              </Link>
            </>
          )}

          {user && (
            <div className="auth-links">
              <span>{user.email}</span>
              <button onClick={handleClick}>Log out</button>
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Navbar
