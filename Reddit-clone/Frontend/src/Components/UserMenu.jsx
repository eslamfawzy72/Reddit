import React from "react";
import { Menu, MenuItem, Avatar, IconButton } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";
import "../styles/userMenu.css";

export default function UserMenu() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/logout`, {}, {
        withCredentials: true,
      });

      logout(); // 🔥 triggers authVersion increment → rerenders Home/Popular
      handleClose();
      navigate("/Home");
    } catch (err) {
      console.error(err.response?.data?.message || "Logout failed");
    }
  };

  return (
    <div>
      <IconButton onClick={handleOpen} size="large" className="um-avatar-btn">
        <Avatar src="https://i.pravatar.cc/150?img=3" />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        className="um-menu"
      >
        <MenuItem
          onClick={() => {
            navigate("/ProfilePage");
            handleClose();
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
