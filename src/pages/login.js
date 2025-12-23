import React, { useState } from "react";
import "./login.css";
import bgImage from "../assets/loginbg.jpg";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:3300/api/users/login",
        { email, password }
      );

      localStorage.setItem("userToken", data.token);
      alert("Login successful!");
      navigate("/admin");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div
      className="login-page"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="login-card">
        <h2 className="title">Welcome back</h2>

        {/* Email */}
        <input
          type="email"
          placeholder="Enter Email"
          className="input-box"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
      <div className="password-wrapper">
        <input
          className="input-box password-input"
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <span
          className="eye-icon"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
        </span>
      </div>



        {/* Login Button */}
        <button className="login-btn" onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
}
