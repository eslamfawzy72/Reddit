// Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";
import {
  Box,
  Button,
  Typography,
  TextField,
} from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";

const BLUE = "#0066ff";
const BLUE_HOVER = "#0055cc";

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

    alert("Login successful!");
    login();  
    navigate("/Home");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    }
  };

  return (
    <>
      <CssBaseline />
      <Box sx={{ position: "fixed", inset: 0, bgcolor: "#0A0A0A", zIndex: -1 }} />

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          px: 2,
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: "480px",
            bgcolor: "#1a1a1b",
            borderRadius: "16px",
            p: 5,
            boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
          }}
        >
          <Typography
            variant="h4"
            sx={{ color: "#EDEFF1", fontWeight: 700, textAlign: "center", mb: 1 }}
          >
            Welcome Back
          </Typography>

          <Typography sx={{ color: "#818384", textAlign: "center", mb: 4 }}>
            Log in to your RedditClone account
          </Typography>

          {error && (
            <Typography sx={{ color: "#ff4444", textAlign: "center", mb: 2 }}>
              {error}
            </Typography>
          )}

          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              mb: 3,
              "& .MuiOutlinedInput-root": {
                borderRadius: "999px",
                bgcolor: "#272729",
                color: "#fff",
              },
              "& label": { color: "#818384" },
            }}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              mb: 4,
              "& .MuiOutlinedInput-root": {
                borderRadius: "999px",
                bgcolor: "#272729",
                color: "#fff",
              },
              "& label": { color: "#818384" },
            }}
          />

          <Button
            fullWidth
            variant="contained"
            onClick={handleLogin}
            sx={{
              bgcolor: BLUE,
              borderRadius: "999px",
              py: 1.8,
              fontWeight: 600,
              textTransform: "none",
              boxShadow: `0 8px 20px rgba(0,102,255,0.4)`,
              "&:hover": { bgcolor: BLUE_HOVER, transform: "translateY(-2px)" },
            }}
          >
            Log In
          </Button>

          <Typography
            sx={{
              textAlign: "center",
              mt: 4,
              color: "#818384",
              fontSize: "14px",
            }}
          >
            Don’t have an account?{" "}
            <Link
              to="/Signup"
              style={{
                color: BLUE,
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Sign Up
            </Link>
          </Typography>
        </Box>
      </Box>
    </>
  );
}
