import { useState } from "react";
import axios from "axios";
import { Box, Button, Typography, TextField, Chip, InputBase, CssBaseline } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import "../styles/SignUp.css";

const BLUE = "#0066ff";
const BLUE_HOVER = "#0055cc";

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

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleCreateAccount = async () => {
    setError("");
    if (!username || !email || !password) {
      alert("Username, email, and password are required.");
      return;
    }

    if (!Array.isArray(interests) || interests.some(i => typeof i !== "string")) {
      alert("Interests must be a list of strings.");
      return;
    }

    const payload = { username, email, password, interests, createdAt: new Date() };
    
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        payload,
        { withCredentials: true }
      );
      alert("Account created successfully!");
      console.log(res.data);
      navigate("/login");
    } catch (err) {
      console.error(err.response?.data || err);
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <>
      <CssBaseline />
      <Box className="signup-background" />

      {page === 1 && (
        <Box className="signup-page1-container">
          <Box className="signup-page1-card">
            <Typography variant="h4" className="signup-title">Join RedditClone</Typography>
            <Typography className="signup-subtitle">Create your account in seconds</Typography>
            {error && <Typography className="signup-error">{error}</Typography>}

            <TextField
              fullWidth
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="signup-input"
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="signup-input"
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="signup-input"
            />

            <Button
              fullWidth
              className="signup-continue-btn"
              onClick={() => {
                if (!username || !email || !password) {
                  setError("All fields are required");
                  return;
                }
                if (!emailRegex.test(email)) {
                  setError("Please enter a valid email address.");
                  return;
                }
                if (password.length < 6) {
                  setError("Password must be at least 6 characters.");
                  return;
                }
                setError("");
                setPage(2);
              }}
            >
              Continue
            </Button>
          </Box>
        </Box>
      )}

      {page === 2 && (
        <Box className="signup-page2-container">
          <Box className="signup-page2-card">
            <Box className="signup-page2-header">
              <Typography className="signup-page2-title">Pick Your Interests</Typography>
              <Typography className="signup-page2-subtitle">Select up to 5 topics so we can personalize your feed</Typography>
            </Box>

            <Box className="signup-page2-body">
              <Box className="signup-search">
                <SearchIcon className="signup-search-icon"/>
                <InputBase placeholder="Search topics..." className="signup-search-input"/>
              </Box>

              {mockTopics.map((group) => (
                <Box key={group.category} className="signup-topic-group">
                  <Typography className="signup-topic-category">{group.category}</Typography>
                  <Box className="signup-topic-list">
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
                        className={`signup-topic-chip ${interests.includes(topic) ? "selected" : ""}`}
                      />
                    ))}
                  </Box>
                </Box>
              ))}

              <Box className="signup-topic-actions">
                <Button className="signup-back-btn" onClick={() => setPage(1)}>Back</Button>
                <Button className="signup-create-btn" onClick={handleCreateAccount}>Create Account</Button>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
}
