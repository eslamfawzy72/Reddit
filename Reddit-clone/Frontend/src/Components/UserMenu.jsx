import React, { useEffect, useState } from "react";
import {
  Menu,
  MenuItem,
  Avatar,
  IconButton,
  Typography,
  Box,
  Divider,
  Switch,
} from "@mui/material";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import DraftsIcon from "@mui/icons-material/Drafts";
import Brightness2Icon from "@mui/icons-material/Brightness2";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";
import "../styles/userMenu.css";

export default function UserMenu() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [anchorEl, setAnchorEl] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/auth/me`, {
        withCredentials: true,
      })
      .then((res) => setCurrentUser(res.data.user))
      .catch(() => setCurrentUser(null));
  }, []);

  const handleOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/logout`,
        {},
        { withCredentials: true }
      );
      logout();
      handleClose();
      navigate("/Home");
    } catch (err) {
      console.error(err.response?.data?.message || "Logout failed");
    }
  };

  return (
    <div>
      <IconButton onClick={handleOpen} size="large" className="um-avatar-btn">
        <Avatar>
          {currentUser?.userName?.[0]?.toUpperCase() || "U"}
        </Avatar>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        className="um-menu"
      >
        {currentUser && (
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {currentUser.userName}
            </Typography>
            <Typography variant="body2" color="gray">
              {currentUser.email}
            </Typography>
          </Box>
        )}

        {currentUser && <Divider sx={{ my: 1 }} />}

        <MenuItem
          onClick={() => {
navigate("/ProfilePage", {
  state: { fromMenu: true },
});            handleClose();
          }}
          className="um-menu-item"
        >
          <AccountCircleIcon className="um-icon" /> View Profile
        </MenuItem>

       

        

        

        <MenuItem onClick={handleLogout} className="um-menu-item">
          <LogoutIcon className="um-icon" /> Log Out
        </MenuItem>
      </Menu>
    </div>
  );
}
