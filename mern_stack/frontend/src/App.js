import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthContext } from './hooks/useAuthContext';

// pages and components
import Home from './pages/Home'
import Navbar from './components/Navbar'
import Signup from './pages/Signup';
import Login from './pages/Login';
import Friends from './pages/Friends';
import Leaderboard from './pages/Leaderboard';


function App() {
  const {user} = useAuthContext()

  return (
    <div className="App">
        <BrowserRouter>
          <Navbar />
          <div className="pages">
            <Routes>
              <Route
                path="/"
                element={user ? <Home /> : <Navigate to ="/login" />}
              />
              <Route
                path="/login"
                element={!user ? <Login /> : <Navigate to ="/"/>}
              />
              <Route
                path="/signup"
                element={!user ? <Signup /> : <Navigate to ="/" />}
              />
              <Route
                path="/Friends"
                element={<Friends />}
              />
            <Route
             path="/Leaderboard"
             element={<Leaderboard/>}
             />
             </Routes>
          </div>
        </BrowserRouter>

    </div>
  );
}

export default App;
