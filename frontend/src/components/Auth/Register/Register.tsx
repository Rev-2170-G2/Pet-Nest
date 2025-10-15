import React, { useState } from "react";
import axios from "axios";
import "./Register.css";

interface RegisterProps {
  onClose: () => void;
  onSwitchToLogin?: () => void;
  onSubmit?: () => void;
}

function Register({ onClose, onSwitchToLogin, onSubmit }: RegisterProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.();

    try {
      await axios.post("http://localhost:3000/api/users/register", {
        username,
        password,
        email,
      });

      setMessage("Registration successful! Redirecting to login...");

      setTimeout(() => {
        onClose();
        onSwitchToLogin?.();
      }, 2000);

    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        if (status === 409) {
          setMessage("Username already exists");
        } else if (status === 400) {
          setMessage("Invalid registration data");
        } else {
          setMessage(error.response?.data?.message || "Registration failed");
        }
      } else {
        setMessage("Error connecting to server");
      }
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <button
          className="close-btn"
          onClick={() => {
            onClose();
            onSwitchToLogin?.();
          }}
        >
          X
        </button>
        <h2>Register</h2>

        <form onSubmit={handleRegister}>
          <label htmlFor="username" className="visually-hidden">Username</label>
          <input
            id="username"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label htmlFor="email" className="visually-hidden">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

          <button type="submit">Register</button>
        </form>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

export default Register;