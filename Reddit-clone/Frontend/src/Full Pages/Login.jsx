import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";
import { Box, Button, Typography, TextField, CssBaseline } from "@mui/material";

import "../styles/Login.css";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        { email, password },
        { withCredentials: true } 
      );

      //toast welcom esm el user
      login();  
      navigate("/Home");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    }
  };

  return (
    <>
      <CssBaseline />
      <Box className="login-bg" />

      <Box className="login-wrapper">
        <Box className="login-container">
          <Typography variant="h4" className="login-title">
            Welcome Back
          </Typography>

          <Typography className="login-subtitle">
            Log in to your RedditClone account
          </Typography>

          {error && <Typography className="login-error">{error}</Typography>}

          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
          />

          <Button
            fullWidth
            variant="contained"
            onClick={handleLogin}
            className="login-button"
          >
            Log In
          </Button>

          <Typography className="login-signup">
            Don’t have an account?{" "}
            <Link to="/Signup" className="signup-link">
              Sign Up
            </Link>
          </Typography>
        </Box>
      </Box>
    </>
  );
}
