import "./NavBar.css";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Login from "../Auth/Login/Login";
import Register from "../Auth/Register/Register";
import { IconButton } from "@mui/material";
import { DarkMode } from "@mui/icons-material";
import { ColorModeContext } from "../../context/ColorModeContext"


function NavBar() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const colorMode = useContext(ColorModeContext);

  const handleLogout = () => {
    navigate('/', {replace: true});
    logout();
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <Link to="/" className="navbar-logo">PetNest</Link>
        </div>

        <div className="navbar-right">

          <Link to="/" className="nav-link">Home</Link>
          <Link to="/pets-events" className="nav-link">Pets & Events</Link> {/* Separate to Pets/Events page. just filler right now. */}
          {user && <Link to="/offers" className="nav-link">Offers</Link>}

          {/* toggle between light and dark mode */}
          <IconButton className="toggle-button" onClick={colorMode.toggleColorMode} color="inherit" >
            <DarkMode />
          </IconButton>

          {user ? (
            <>
              <span className="welcome-text">
                Hello, {user.username}{user.admin ? " (Admin)" : ""}! 
              </span>
              <button id="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button className="nav-btn login-btn" onClick={() => setShowLogin(true)}>
                Login
              </button>
              <button className="nav-btn register-btn" onClick={() => setShowRegister(true)}>
                Register
              </button>
            </>
          )}
        </div>
      </nav>

      {showLogin && <Login onClose={() => setShowLogin(false)} />}
      {showRegister && <Register onClose={() => setShowRegister(false)} />}
    </>
  );
}

export default NavBar;