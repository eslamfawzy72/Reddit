import * as React from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  InputBase,
  Button,
  IconButton,
  Fade,
  Paper,
  Divider,
  Avatar,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import UserMenu from "../Components/UserMenu";

export default function PrimarySearchAppBar({
  searchFunction,
  onResultClick,
  placeholder = "Search Bluedit…",
  fullSearchLabel = "Search for",
  darkMode,
  setDarkMode,
}) {
  const [query, setQuery] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [results, setResults] = React.useState([]);
  const [renderItem, setRenderItem] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  // Debounced search
  React.useEffect(() => {
    if (!searchFunction || !query.trim()) {
      setResults([]);
      setRenderItem(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timeout = setTimeout(() => {
      searchFunction(query)
        .then((res) => {
          setResults(res.results || []);
          setRenderItem(() => res.renderItem);
          setLoading(false);
        })
        .catch(() => {
          setResults([]);
          setRenderItem(null);
          setLoading(false);
        });
    }, 300);

    return () => clearTimeout(timeout);
  }, [query, searchFunction]);

  const handleItemClick = (item) => {
    onResultClick?.(item);
    setQuery("");
    setOpen(false);
  };

  const handleClickAway = () => setOpen(false);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: "rgba(15, 25, 45, 0.85)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <Toolbar sx={{ minHeight: 64 }}>
          {/* Logo */}
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              fontWeight: 800,
              letterSpacing: "-0.5px",
              color: "#4c6ef5",
              cursor: "pointer",
            }}
            onClick={() => navigate("/")}
          >
            Bluedit
          </Typography>

          {/* Search Bar */}
          <ClickAwayListener onClickAway={handleClickAway}>
            <Box sx={{ position: "relative", ml: 4 }}>
              <Box
                sx={{
                  position: "relative",
                  borderRadius: 3,
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.15)" },
                  transition: "all 0.2s ease",
                  width: { xs: "100%", sm: 400 },
                  maxWidth: 500,
                }}
              >
                <Box sx={{ position: "absolute", display: "flex", alignItems: "center", pl: 2, height: "100%" }}>
                  <SearchIcon sx={{ color: "#aaa" }} />
                </Box>
                <InputBase
                  placeholder={placeholder}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setOpen(true);
                  }}
                  onFocus={() => setOpen(true)}
                  sx={{
                    color: "#fff",
                    pl: 6,
                    pr: 2,
                    py: 1.5,
                    width: "100%",
                    "& .MuiInputBase-input": {
                      "&::placeholder": { color: "#aaa", opacity: 1 },
                    },
                  }}
                />
              </Box>

              {/* Dropdown Results */}
              <Fade in={open}>
                <Paper
                  elevation={8}
                  sx={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    mt: 1,
                    borderRadius: 3,
                    overflow: "hidden",
                    backgroundColor: "#162036",
                    border: "1px solid #2a3a5a",
                    maxHeight: 400,
                    overflowY: "auto",
                    zIndex: 1300,
                  }}
                >
                  {loading ? (
                    <Box sx={{ p: 2, textAlign: "center", color: "#888" }}>
                      <Typography variant="body2">Searching...</Typography>
                    </Box>
                  ) : results.length === 0 ? (
                    <Box sx={{ p: 2.5, textAlign: "center", color: "#888" }}>
                      <Typography variant="body2">
                        {query ? "No results found" : "Type to search communities, posts, or users"}
                      </Typography>
                    </Box>
                  ) : (
                    <>
                      {results.map((item, index) => (
                        <Box
                          key={item.id || index}
                          onClick={() => handleItemClick(item)}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            p: 2,
                            cursor: "pointer",
                            "&:hover": { backgroundColor: "#1e2b46" },
                            transition: "background-color 0.2s",
                          }}
                        >
                          <Avatar
                            sx={{
                              width: 40,
                              height: 40,
                              bgcolor: "#4c6ef5",
                              fontSize: 16,
                              fontWeight: "bold",
                            }}
                          >
                            {item.label[0].toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#fff" }}>
                              {item.label}
                            </Typography>
                            <Typography variant="caption" sx={{ color: "#a0aec0" }}>
                              {item.type}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                      {query && (
                        <>
                          <Divider sx={{ bgcolor: "#2a3a5a" }} />
                          <Box
                            onClick={() => handleItemClick({ type: "full-search", query })}
                            sx={{
                              p: 2,
                              cursor: "pointer",
                              color: "#4c6ef5",
                              fontWeight: 600,
                              textAlign: "center",
                              "&:hover": { backgroundColor: "#1e2b46" },
                            }}
                          >
                            {fullSearchLabel} "{query}"
                          </Box>
                        </>
                      )}
                    </>
                  )}
                </Paper>
              </Fade>
            </Box>
          </ClickAwayListener>

          {/* Spacer */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Right Actions */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {isLoggedIn ? (
              <>
                <IconButton onClick={() => navigate("/Chats")} sx={{ color: "#ccc" }}>
                  <MailIcon />
                </IconButton>
                <IconButton onClick={() => navigate("/Notifications")} sx={{ color: "#ccc" }}>
                  <NotificationsIcon />
                </IconButton>
                <Button
                  onClick={() => navigate("/CreatePost")}
                  startIcon={<AddIcon />}
                  variant="contained"
                  sx={{
                    bgcolor: "#4c6ef5",
                    color: "#fff",
                    borderRadius: "24px",
                    textTransform: "none",
                    fontWeight: 600,
                    px: 3,
                    py: 1,
                    boxShadow: "0 4px 12px rgba(76, 110, 245, 0.3)",
                    "&:hover": {
                      bgcolor: "#3b5bd4",
                      boxShadow: "0 6px 16px rgba(76, 110, 245, 0.4)",
                    },
                  }}
                >
                  Create Post
                </Button>
                <UserMenu darkMode={darkMode} setDarkMode={setDarkMode} />
              </>
            ) : (
              <>
                <Button
                  onClick={() => navigate("/Login")}
                  sx={{
                    color: "#fff",
                    border: "1px solid #4c6ef5",
                    borderRadius: "24px",
                    textTransform: "none",
                    fontWeight: 600,
                    px: 3,
                    py: 1,
                    "&:hover": { bgcolor: "rgba(76, 110, 245, 0.15)" },
                  }}
                >
                  Log In
                </Button>
                <Button
                  onClick={() => navigate("/Signup")}
                  variant="contained"
                  sx={{
                    bgcolor: "#4c6ef5",
                    borderRadius: "24px",
                    textTransform: "none",
                    fontWeight: 600,
                    px: 3,
                    py: 1,
                    ml: 1,
                    boxShadow: "0 4px 12px rgba(76, 110, 245, 0.3)",
                    "&:hover": { bgcolor: "#3b5bd4" },
                  }}
                >
                  Sign Up
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Spacer for fixed app bar */}
      <Toolbar />
    </Box>
  );
}