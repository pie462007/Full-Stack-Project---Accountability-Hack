import { Link } from 'react-router-dom' //npm install react-router-dom
// import Friends from '../pages/Friends';
// import Login from '../pages/Login';
// import Home from '../pages/Home';
import '../styles/Navbar.css'
import { useLogout } from '../hooks/useLogout'
import { useAuthContext } from '../hooks/useAuthContext'

const Navbar = () => {
    const {logout} = useLogout()
    const {user} = useAuthContext()

    const handleClick = () => {
        logout()
    }

    return (
        <header>
            <nav className="container">
                <div className = "nav-title">
                    <h1>Accountability Hack</h1>
                </div>
                <div className = "header-div"> 
                    <Link to="/">
                        <h3>home</h3>
                    </Link>
                    <Link to="/friends">
                        <h3>friends</h3>
                    </Link>
                    
                    {!user && (
                        <div>
                            <Link to="/login">
                                <h3>login</h3>
                            </Link>
                            <Link to="/signup">
                                <h3>signup</h3>
                             </Link>
                        </div>
                    )}
                    
                    {user && (
                        <div>
                        <span>{user.email}</span>
                        <button onClick={handleClick}>Log out</button>
                    </div>
                    )}
                </div>
             
            </nav>
        </header>
    )
}

export default Navbar;