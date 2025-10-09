import React, { useState, useContext } from "react";
import "./Login.css";
import { UserContext } from "../../AppContext";

interface LoginProps {
  onClose: () => void;
}

function Login({onClose}: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const {setUser} = useContext(UserContext);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/users/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({username, password}),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Login successful!");
        setUser({username, token: data.token});
        onClose();
      } else {
        setMessage(data.message || "Login failed");
      }
    } catch (err) {
      setMessage("Error connecting to server");
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <button className="close-btn" onClick={onClose}>X</button>
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
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

export default Login