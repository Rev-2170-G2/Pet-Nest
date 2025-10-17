import "./NavBar.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Login from "../Auth/Login/Login";
import Register from "../Auth/Register/Register";
import { IconButton } from "@mui/material";
import { DarkMode } from "@mui/icons-material";
import { ColorModeContext } from "../../context/ColorModeContext"


interface NavBarProps {
  onJoinClick?: () => void;
}

function NavBar({ onJoinClick }: NavBarProps) {
  const { user, logout } = useContext(AuthContext);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const colorMode = useContext(ColorModeContext)
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/', {replace: true});
    logout();
    navigate("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleJoinClick = (e: React.MouseEvent) => {
    e.preventDefault();

    if (location.pathname === "/") {
      onJoinClick?.();
    } else {
      navigate("/");
      setTimeout(() => {
        onJoinClick?.();
      }, 400);
    }
  };

  const handleGoHome = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/");
      setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 300);
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <div
            className="navbar-logo"
            onClick={handleGoHome}
            style={{ cursor: "pointer" }}
          >
            PetNest
          </div>
        </div>

        <div className="navbar-right">
          <Link to="/" className="nav-link" onClick={handleGoHome}>
            Home
          </Link>
          <Link to="/pets-events" className="nav-link">
            Pets & Events
          </Link>
          <a href="#join" className="nav-link" onClick={handleJoinClick}>
            Join
          </a>
          {/* {user && <Link to="/offers" className="nav-link">Offers</Link>} */}
          {user && (<Link to="/profile" className="nav-link">Profile</Link>)}
          {user?.admin && <Link to="/admin" className="nav-link">Admin Dashboard</Link>}

          {user ? (
            <>
              <span className="welcome-text">
                Hello, {user.username}
                {user.admin ? " (Admin)" : ""}!
              </span>
              <button id="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                className="nav-btn login-btn"
                onClick={() => setShowLogin(true)}
              >
                Login
              </button>
              <button
                className="nav-btn register-btn"
                onClick={() => setShowRegister(true)}
              >
                Register
              </button>
            </>
          )}
        </div>
      </nav>

      {showLogin && <Login onClose={() => setShowLogin(false)} />}
      {showRegister && (
        <Register
          onClose={() => setShowRegister(false)}
          onSwitchToLogin={() => {
            setShowRegister(false);
            setShowLogin(true);
          }}
        />
      )}
    </>
  );
}

export default NavBar;