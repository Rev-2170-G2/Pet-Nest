import React, { useState } from "react";
import "./Register.css";

interface RegisterProps {
  onClose: () => void;
  onSubmit?: () => void;
}

function Register({onClose, onSubmit}: RegisterProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.();

    try {
      const response = await fetch("http://localhost:3000/api/users/register", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({username, password, email}),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Registration successful!");
        setTimeout(() => onClose(), 1000);
      } else {
        setMessage(data.message || "Registration failed");
      }
    } catch (err) {
      setMessage("Error connecting to server");
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <button className="close-btn" onClick={onClose}>X</button>
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