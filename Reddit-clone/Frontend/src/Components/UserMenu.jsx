import React from "react";
import {
  Menu,
  MenuItem,
  Avatar,
  IconButton,
  Switch,
} from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DraftsIcon from '@mui/icons-material/Drafts';
import Brightness2Icon from '@mui/icons-material/Brightness2';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../Context/AuthContext"; 

export default function UserMenu({ darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const { logout } = useAuth(); 
  const [anchorEl, setAnchorEl] = React.useState(null);

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
      navigate("/Home"); // redirect to home
    } catch (err) {
      console.error(err.response?.data?.message || "Logout failed");
    }
  };

  return (
    <div>
      <IconButton onClick={handleOpen} size="large">
        <Avatar src="https://i.pravatar.cc/150?img=3" />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem onClick={() => { navigate("/ProfilePage"); handleClose(); }}>
          <AccountCircleIcon sx={{ mr: 1 }} /> View Profile
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <DraftsIcon sx={{ mr: 1 }} /> Notifications
        </MenuItem>
        <MenuItem>
          <Brightness2Icon sx={{ mr: 1 }} />
          Dark Mode
          <Switch
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
            sx={{ ml: "auto" }}
          />
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <LogoutIcon sx={{ mr: 1 }} /> Log Out
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <SettingsIcon sx={{ mr: 1 }} /> Settings
        </MenuItem>
      </Menu>
    </div>
  );
}
