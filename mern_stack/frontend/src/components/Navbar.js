import { Link } from 'react-router-dom' //npm install react-router-dom
import Friends from '../pages/Friends';
import Login from '../pages/Login';
import Home from '../pages/Home';

const Navbar = () => {

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
                    <Link to="/login">
                        <h3>login</h3>
                    </Link>
                </div>
             
            </nav>
        </header>
    )
}

export default Navbar;