import * as React from "react";
import { Box, AppBar, Toolbar, Typography, InputBase, Button, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import UserMenu from "../Components/UserMenu";
import "../styles/primarySearchAppBar.css";

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
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (query.trim() && searchFunction) {
      const { results, renderItem } = searchFunction(query);
      setResults(results);
      setRenderItem(() => renderItem);
    } else {
      setResults([]);
      setRenderItem(null);
    }
  }, [query, searchFunction]);

  const handleItemClick = (item) => {
    onResultClick?.(item);
    setQuery("");
    setOpen(false);
  };

  const handleClickAway = () => setOpen(false);

  return (
    <Box className="psa-container">
      <AppBar position="fixed" className="psa-appbar">
        <Toolbar>
          <Typography variant="h6" className="psa-logo">
            Bluedit
          </Typography>

          <ClickAwayListener onClickAway={handleClickAway}>
            <Box className="psa-search-wrapper">
              <div className="psa-search-container">
                <div className="psa-search-icon">
                  <SearchIcon />
                </div>
                <InputBase
                  placeholder={placeholder}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setOpen(true);
                  }}
                  onFocus={() => setOpen(true)}
                  className="psa-input"
                />
              </div>

              {open && (
                <Box className="psa-dropdown">
                  {results.length === 0 ? (
                    <Box className="psa-no-results">
                      {query ? "No results found" : "Start typing..."}
                    </Box>
                  ) : (
                    results.map((item, i) => (
                      <Box
                        key={item.id || i}
                        onClick={() => handleItemClick(item)}
                        className={`psa-dropdown-item ${i % 2 === 0 ? "even" : "odd"}`}
                      >
                        {renderItem && renderItem(item)}
                      </Box>
                    ))
                  )}

                  {query && results.length > 0 && (
                    <Box
                      onClick={() => handleItemClick({ type: "full-search", query })}
                      className="psa-full-search"
                    >
                      {fullSearchLabel} "{query}"
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          </ClickAwayListener>

          <Box sx={{ flexGrow: 1 }} />

          <Box className="psa-buttons">
            {isLoggedIn ? (
              <>
                <IconButton onClick={() => navigate("/Chats")} className="psa-icon-button">
                  <MailIcon />
                </IconButton>
                <IconButton onClick={() => navigate("/Notifications")} className="psa-icon-button">
                  <NotificationsIcon />
                </IconButton>
                <Button onClick={() => navigate("/CreatePost")} className="psa-create-btn" startIcon={<AddIcon />}>
                  Create
                </Button>
                <UserMenu darkMode={darkMode} setDarkMode={setDarkMode} />
              </>
            ) : (
              <>
                <Button onClick={() => navigate("/Login")} className="psa-auth-btn">
                  Log In
                </Button>
                <Button onClick={() => navigate("/Signup")} className="psa-auth-btn">
                  Sign Up
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Toolbar />
    </Box>
  );
}
