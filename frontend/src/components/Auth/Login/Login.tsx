import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import "./Login.css";
import { AuthContext, User } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

interface LoginProps {
  onClose: () => void;
  onSubmit?: () => void;
  message?: string;
  redirectTo?: string;
}

function Login({ onClose, onSubmit, message, redirectTo }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [localMessage, setLocalMessage] = useState(message || "");
  const URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";


  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const root = document.getElementById("root");
    if (root) root.style.pointerEvents = "none";

    return () => {
      document.body.style.overflow = "auto";
      if (root) root.style.pointerEvents = "auto";
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.();

    try {
      const response = await axios.post(`${URL}/api/users/login`, {
        username,
        password,
      });

      const data = response.data;

      const user: User = {
        id: data.id,
        username: data.username,
        token: data.token,
        admin: data.admin,
      };

      login(user);
      setLocalMessage("Login successful!");

      onClose();

      if (redirectTo) {
        navigate(redirectTo);
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        setLocalMessage(error.response?.data?.message || "Login failed");
      } else {
        setLocalMessage("Error connecting to server");
      }
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-box" style={{ pointerEvents: "auto" }}>
        <button className="close-btn" onClick={onClose}>X</button>
        <h2>Login</h2>

        {localMessage && (
          <div className="login-alert">
            {localMessage}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <label htmlFor="username" className="visually-hidden">Username</label>
          <input
            id="username"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label htmlFor="password" className="visually-hidden">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;