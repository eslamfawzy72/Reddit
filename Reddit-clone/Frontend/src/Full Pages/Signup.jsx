// SignUp.jsx
import { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Typography,
  TextField,
  Chip,
  InputBase,
  CssBaseline,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";

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

const mockTopics = [
  { category: "Anime & Cosplay", topics: ["Anime & Manga", "Cosplay", "Otaku Culture", "Japanese Media"] },
  { category: "Art", topics: ["Performing Arts", "Architecture", "Design", "Art", "Filmmaking", "Digital Art", "Photography"] },
  { category: "Business & Finance", topics: ["Personal Finance", "Crypto", "Economics", "Business News", "Deals", "Startups", "Real Estate", "Stocks"] },
  { category: "Technology", topics: ["Programming", "Web Dev", "AI & ML", "Cybersecurity", "Cloud", "Data Science", "Open Source"] },
  { category: "Gaming", topics: ["PC Gaming", "Console", "Esports", "Game Dev", "Retro", "Speedrunning"] },
  { category: "Lifestyle", topics: ["Fitness", "Cooking", "Travel", "Fashion", "Books", "Movies & TV"] },
  { category: "Memes & Fun", topics: ["Memes", "Funny", "Wholesome", "Dank", "Shitposting"] },
];

export default function SignUp() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [interests, setInterests] = useState([]);
  const [error, setError] = useState("");

  // Email regex to match standard email formats
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleCreateAccount = async () => {
    setError("");

    // Required fields
    if (!username || !email || !password) {
      alert("Username, email, and password are required.");
      return;
    }


    // Validate interests
    if (!Array.isArray(interests) || interests.some(i => typeof i !== "string")) {
      alert("Interests must be a list of strings.");
      return;
    }

    const payload = {
      username,              
      email,
      password,
      interests,
      createdAt: new Date(), 
    };
    
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        payload,
        { withCredentials: true }
      );

      alert("Account created successfully!");
      console.log(res.data);

      // Redirect to login page
      navigate("/login");
    } catch (err) {
      console.error(err.response?.data || err);
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <>
      <CssBaseline />
      <Box sx={{ position: "fixed", inset: 0, bgcolor: "#0A0A0A", zIndex: -1 }} />

      {/* STEP 1 – Username, Email, Password */}
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

            <TextField
              fullWidth
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{ mb: 3, "& .MuiOutlinedInput-root": { borderRadius: "999px", bgcolor: "#272729", color: "#fff" }, "& label": { color: "#818384" } }}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 3, "& .MuiOutlinedInput-root": { borderRadius: "999px", bgcolor: "#272729", color: "#fff" }, "& label": { color: "#818384" } }}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 5, "& .MuiOutlinedInput-root": { borderRadius: "999px", bgcolor: "#272729", color: "#fff" }, "& label": { color: "#818384" } }}
            />

            <Button
              fullWidth
              variant="contained"
              onClick={() => {
                if (!username || !email || !password) {
                  setError("All fields are required");
                  return;
                }
                    // Validate email
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
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
          </Box>
        </Box>
      )}

      {/* STEP 2 – Choose Interests */}
      {page === 2 && (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "flex-start", minHeight: "100vh", pt: 6, pb: 6 }}>
          <Box sx={{ width: "100%", maxWidth: "900px", bgcolor: "#FFFFFF", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.2)", overflow: "hidden" }}>
            <Box sx={{ p: "20px 24px", borderBottom: "1px solid #EDEFF1", background: "linear-gradient(180deg, #1a1a1b, #030303)" }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: "#EDEFF1", fontSize: "20px" }}>
                Pick Your Interests
              </Typography>
              <Typography sx={{ color: "#AEB4B8", fontSize: "14px", mt: 1 }}>
                Select up to 5 topics so we can personalize your feed
              </Typography>
            </Box>

            <Box sx={{ p: "24px", bgcolor: "#030303" }}>
              <Search>
                <SearchIconWrapper><SearchIcon /></SearchIconWrapper>
                <StyledInputBase placeholder="Search topics..." />
              </Search>

              {mockTopics.map((group) => (
                <Box key={group.category} sx={{ mt: 4 }}>
                  <Typography sx={{ color: "#fff", fontWeight: 600, mb: 2 }}>
                    {group.category}
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                    {group.topics.map((topic) => (
                      <Chip
                        key={topic}
                        label={topic}
                        clickable
                        onClick={() => {
                          if (interests.includes(topic)) {
                            setInterests(interests.filter((t) => t !== topic));
                          } else if (interests.length < 5) {
                            setInterests([...interests, topic]);
                          }
                        }}
                        sx={{
                          bgcolor: interests.includes(topic) ? BLUE : "#272729",
                          color: interests.includes(topic) ? "#fff" : "#EDEFF1",
                          border: interests.includes(topic) ? `2px solid ${BLUE}` : "none",
                          fontWeight: interests.includes(topic) ? 600 : 500,
                          boxShadow: interests.includes(topic) ? `0 0 12px rgba(0,102,255,0.5)` : "none",
                          transition: "all 0.2s",
                          "&:hover": {
                            bgcolor: interests.includes(topic) ? BLUE_HOVER : "#343536",
                            transform: "scale(1.05)",
                          },
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              ))}

              <Box sx={{ mt: 6, display: "flex", justifyContent: "space-between" }}>
                <Button
                  variant="outlined"
                  onClick={() => setPage(1)}
                  sx={{
                    borderColor: "#343536",
                    color: "#fff",
                    borderRadius: "999px",
                    px: 4,
                    "&:hover": { borderColor: BLUE },
                  }}
                >
                  Back
                </Button>

                <Button
                  variant="contained"
                  onClick={handleCreateAccount}
                  sx={{
                    bgcolor: BLUE,
                    borderRadius: "999px",
                    px: 5,
                    py: 1.5,
                    fontWeight: 600,
                    boxShadow: `0 8px 20px rgba(0,102,255,0.4)`,
                    "&:hover": { bgcolor: BLUE_HOVER, transform: "scale(1.05)" },
                  }}
                >
                  Create Account
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
}
