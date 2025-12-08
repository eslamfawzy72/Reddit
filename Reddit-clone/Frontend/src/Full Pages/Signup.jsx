// SignUp.jsx
import { useState } from "react";
import { Link } from "react-router-dom"; // Make sure you have react-router-dom installed
import axios from "axios";
import {
  Box,
  Button,
  Typography,
  TextField,
  Chip,
  InputBase,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import CssBaseline from "@mui/material/CssBaseline";

const BLUE = "#0066ff";
const BLUE_HOVER = "#0055cc";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: "999px",
  border: "1px solid #343536",
  backgroundColor: "#1a1a1b",
  marginTop: theme.spacing(3),
  width: "100%",
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: "0 16px",
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#818384",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "#fff",
  width: "100%",
  paddingLeft: "48px",
  paddingTop: "12px",
  paddingBottom: "12px",
  fontSize: "14px",
}));

const mockTopics = [ /* ... same as before ... */ ];

export default function SignUp() {
  const [page, setPage] = useState(1);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [interests, setInterests] = useState([]);
  const [error, setError] = useState("");

  const handleCreateAccount = async () => {
    if (interests.length === 0) {
      setError("Please select at least one interest");
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/users`, {
        userName: username,
        email,
        password,
        interests,
      });
      alert("Account created successfully!");
      // Redirect or go to login
    } catch (err) {
      alert("Error creating account");
    }
  };

  return (
    <>
      <CssBaseline />
      <Box sx={{ position: "fixed", inset: 0, bgcolor: "#0A0A0A", zIndex: -1 }} />

      {/* STEP 1 – Credentials */}
      {page === 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", px: 2 }}>
          <Box sx={{ width: "100%", maxWidth: "480px", bgcolor: "#1a1a1b", borderRadius: "16px", p: 5, boxShadow: "0 10px 40px rgba(0,0,0,0.6)" }}>
            <Typography variant="h4" sx={{ color: "#EDEFF1", fontWeight: 700, textAlign: "center", mb: 1 }}>
              Join RedditClone
            </Typography>
            <Typography sx={{ color: "#818384", textAlign: "center", mb: 4 }}>
              Create your account in seconds
            </Typography>

            {error && <Typography sx={{ color: "#ff4444", textAlign: "center", mb: 2 }}>{error}</Typography>}

            <TextField fullWidth label="Username" value={username} onChange={(e) => setUsername(e.target.value)}
              sx={{ mb: 3, "& .MuiOutlinedInput-root": { borderRadius: "999px", bgcolor: "#272729", color: "#fff" }, "& label": { color: "#818384" } }} />
            <TextField fullWidth label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 3, "& .MuiOutlinedInput-root": { borderRadius: "999px", bgcolor: "#272729", color: "#fff" }, "& label": { color: "#818384" } }} />
            <TextField fullWidth label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 5, "& .MuiOutlinedInput-root": { borderRadius: "999px", bgcolor: "#272729", color: "#fff" }, "& label": { color: "#818384" } }} />

            <Button
              fullWidth
              variant="contained"
              onClick={() => {
                if (!username || !email || !password) {
                  setError("All fields are required");
                  return;
                }
                setError("");
                setPage(2);
              }}
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
              Continue
            </Button>

            {/* ALREADY HAVE AN ACCOUNT */}
            <Typography sx={{ textAlign: "center", mt: 4, color: "#818384", fontSize: "14px" }}>
              Already have an account?{" "}
              <Link
                to="/login"
                style={{
                  color: BLUE,
                  textDecoration: "none",
                  fontWeight: 600,
                }}
                onMouseOver={(e) => (e.target.style.textDecoration = "underline")}
                onMouseOut={(e) => (e.target.style.textDecoration = "none")}
              >
                Log in
              </Link>
            </Typography>
          </Box>
        </Box>
      )}

      {/* STEP 2 – Interests */}
      {page === 2 && (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "flex-start", minHeight: "100vh", pt: 6, pb: 6 }}>
          <Box sx={{ width: "100%", maxWidth: "900px", bgcolor: "#FFFFFF", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.2)", overflow: "hidden" }}>
            {/* ... same interests section as before ... */}

            <Box sx={{ mt: 6, display: "flex", justifyContent: "space-between", px: 3 }}>
              <Button variant="outlined" onClick={() => setPage(1)} sx={{ borderColor: "#343536", color: "#fff", borderRadius: "999px", px: 4 }}>
                Back
              </Button>

              <Button variant="contained" onClick={handleCreateAccount} sx={{
                bgcolor: BLUE,
                borderRadius: "999px",
                px: 5,
                py: 1.5,
                fontWeight: 600,
                boxShadow: `0 8px 20px rgba(0,102,255,0.4)`,
                "&:hover": { bgcolor: BLUE_HOVER, transform: "scale(1.05)" },
              }}>
                Create Account
              </Button>
            </Box>

            {/* ALREADY HAVE AN ACCOUNT – also on step 2 */}
            <Typography sx={{ textAlign: "center", mt: 4, color: "#818384", fontSize: "14px", pb: 3 }}>
              Already a member?{" "}
              <Link to="/login" style={{ color: BLUE, textDecoration: "none", fontWeight: 600 }}>
                Log in
              </Link>
            </Typography>
          </Box>
        </Box>
      )}
    </>
  );
}