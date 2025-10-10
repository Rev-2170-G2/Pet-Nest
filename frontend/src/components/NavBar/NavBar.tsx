import "./NavBar.css";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Login from "../Login/Login";
import Register from "../Register/Register";

function NavBar() {
  const { user, logout } = useContext(AuthContext);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <div className="navbar-logo">PetNest</div>
        </div>

        <div className="navbar-right">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/pets-events" className="nav-link">Pets & Events</Link>

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