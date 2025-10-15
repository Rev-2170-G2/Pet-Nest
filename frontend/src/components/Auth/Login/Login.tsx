import React, { useState, useContext } from "react";
import axios from "axios";
import "./Login.css";
import { AuthContext, User } from "../../../context/AuthContext";

interface LoginProps {
  onClose: () => void;
  onSubmit?: () => void;
}

function Login({ onClose, onSubmit }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const { login } = useContext(AuthContext);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.();

    try {
      const response = await axios.post("http://localhost:3000/api/users/login", {
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
      setMessage("Login successful!");
      onClose();
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        setMessage(error.response?.data?.message || "Login failed");
      } else {
        setMessage("Error connecting to server");
      }
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <button className="close-btn" onClick={onClose}>X</button>
        <h2>Login</h2>

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

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

export default Login;