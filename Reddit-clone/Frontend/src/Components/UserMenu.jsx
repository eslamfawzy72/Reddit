import React from "react";
import { Menu, MenuItem, Avatar, IconButton, Switch, Typography } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DraftsIcon from '@mui/icons-material/Drafts';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import StarIcon from '@mui/icons-material/Star';
import Brightness2Icon from '@mui/icons-material/Brightness2';
import LogoutIcon from '@mui/icons-material/Logout';
import CampaignIcon from '@mui/icons-material/Campaign';
import TimerIcon from '@mui/icons-material/Timer';
import SettingsIcon from '@mui/icons-material/Settings';

export default function UserMenu({ darkMode, setDarkMode }) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

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
        <MenuItem onClick={handleClose}><AccountCircleIcon sx={{ mr: 1 }} /> View Profile</MenuItem>
        <MenuItem onClick={handleClose}><DraftsIcon sx={{ mr: 1 }} /> Notifications</MenuItem>
        {/*<MenuItem onClick={handleClose}><EmojiEventsIcon sx={{ mr: 1 }} /> Achievements</MenuItem>
        <MenuItem onClick={handleClose}><AttachMoneyIcon sx={{ mr: 1 }} /> Earn</MenuItem>
        <MenuItem onClick={handleClose}><StarIcon sx={{ mr: 1 }} /> Premium</MenuItem>*/}
        <MenuItem>
          <Brightness2Icon sx={{ mr: 1 }} />
          Dark Mode
          <Switch
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
            sx={{ ml: "auto" }}
          />
        </MenuItem>
        <MenuItem onClick={handleClose}><LogoutIcon sx={{ mr: 1 }} /> Log Out</MenuItem>
        {/*<MenuItem onClick={handleClose}><CampaignIcon sx={{ mr: 1 }} /> Advertise on Reddit</MenuItem>
        <MenuItem onClick={handleClose}><TimerIcon sx={{ mr: 1 }} /> Try Reddit Pro</MenuItem>*/}
        <MenuItem onClick={handleClose}><SettingsIcon sx={{ mr: 1 }} /> Settings</MenuItem>
      </Menu>
    </div>
  );
}