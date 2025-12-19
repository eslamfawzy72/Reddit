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
  const [searchQuery, setSearchQuery] = useState("");
  const checkAvailability = async () => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/users/check-username-email`,
      { username: username.trim(), email: email.trim() }
    );
    return res.data; // { usernameAvailable: true/false, emailAvailable: true/false }
  } catch (err) {
    console.error(err);
    return { usernameAvailable: false, emailAvailable: false };
  }
};



  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleCreateAccount = async () => {
    setError("");
    if (!username || !email || !password) {
      setError("Username, email, and password are required.");
      return;
    }

    if (interests.length === 0) {
      setError("Select at least 1 interest.");
      return;
    }

    const payload = { username, email, password, interests, createdAt: new Date() };
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, payload, { withCredentials: true });
      navigate("/login");
    } catch (err) {
      console.error(err.response?.data || err);
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  // Filter topics by search
  const filteredTopics = mockTopics.map(group => ({
    ...group,
    topics: group.topics.filter(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  }));

  return (
    <>
      <CssBaseline />
      <Box className="signup-background" />

      {/* Page 1 */}
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
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="signup-input"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="signup-input"
              sx={{ mb: 3 }}
            />

            <Button
  fullWidth
  className="signup-continue-btn"
 onClick={async () => {
  setError("");

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

  const { usernameAvailable, emailAvailable } = await checkAvailability();

  if (!usernameAvailable) {
    setError("Username is already taken");
    return;
  }
  if (!emailAvailable) {
    setError("Email is already registered");
    return;
  }

  setPage(2); // all good
}}

>
  Continue
</Button>

            <Box sx={{ mt: 3, textAlign: "center" }}>
              <Typography variant="body2" sx={{ color: "#9ca3af" }}>
                Already have an account?{" "}
                <Typography
                  component="span"
                  onClick={() => navigate("/login")}
                  sx={{
                    color: "#4c6ef5",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "color 0.2s ease",
                    "&:hover": { color: "#5a78ff" }
                  }}
                >
                  Login
                </Typography>
              </Typography>
            </Box>

          </Box>
        </Box>
      )}

      {/* Page 2 */}
      {page === 2 && (
        <Box className="signup-page2-container">
          <Box className="signup-page2-card">
            <Box className="signup-page2-header">
              <Typography className="signup-page2-title">Pick Your Interests</Typography>
              <Typography className="signup-page2-subtitle">Select up to 5 topics so we can personalize your feed</Typography>
            </Box>

            <Box className="signup-page2-body">
              {/* Search Input */}
              <Box className="signup-search" sx={{ mb: 3 }}>
                <SearchIcon className="signup-search-icon" />
                <InputBase
                  placeholder="Search topics..."
                  className="signup-search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </Box>

              {/* Topics List */}
              {filteredTopics.map(group => (
                <Box key={group.category} className="signup-topic-group">
                  <Typography className="signup-topic-category">{group.category}</Typography>
                  <Box className="signup-topic-list">
                    {group.topics.map(topic => (
                      <Chip
                        key={topic}
                        label={topic}
                        clickable
                        onClick={() => {
                          if (interests.includes(topic)) {
                            setInterests(interests.filter(t => t !== topic));
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

              {/* Actions */}
              <Box className="signup-topic-actions">
                <Button className="signup-back-btn" onClick={() => setPage(1)}>Back</Button>
                <Button
                  className="signup-create-btn"
                  onClick={handleCreateAccount}
                  disabled={interests.length === 0}
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
