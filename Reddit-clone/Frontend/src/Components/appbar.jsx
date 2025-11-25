import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import redditLogo from "./assets/reddit.webp";
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';



const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

export default function PrimarySearchAppBar(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );
  if(props.loggedin===true){
  return (
  <navbar style={{ width: '100%' }}>
    <AppBar 
  position="fixed" 
  sx={{ 
    top: 0,
    width: '100%',
    backgroundColor: 'rgba(27, 0, 123, 0.93)' // <-- your new vibe
  }}
>
      <Toolbar>
     <img 
  src={redditLogo} 
  alt="navbar"
  style={{
    height: '30px',
    objectFit: 'contain',
    cursor: 'pointer'
  }}
/>




      <Typography
  variant="h6"
  noWrap
  component="div"
  sx={{
    display: { xs: 'none', sm: 'block' },
    fontFamily: '"Poppins", sans-serif',
    fontWeight: 700,
    letterSpacing: '1px',
    textTransform: 'uppercase'
  }}
>
  Bluedit
</Typography>


        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search…"
            inputProps={{ 'aria-label': 'search' }}
          />
        </Search>

        <Box sx={{ flexGrow: 1 }} />


        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Button
  variant="contained"
  startIcon={<AddIcon />}
  sx={{
    mr: 2,
    backgroundColor: '#008cffff',
    color: 'white',
    fontWeight: 600,
    textTransform: 'none',
    borderRadius: '20px',
    px: 2,
    '&:hover': {
      backgroundColor: '#00e047ff'
    }
  }}
>
  Create
</Button>
          <IconButton size="large" color="inherit">
            <Badge badgeContent={4} color="error">
              <MailIcon />
            </Badge>
          </IconButton>

          <IconButton size="large" color="inherit">
            <Badge badgeContent={17} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <IconButton
            size="large"
            edge="end"
            aria-controls={menuId}
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
        </Box>

        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <IconButton
            size="large"
            aria-controls={mobileMenuId}
            aria-haspopup="true"
            onClick={handleMobileMenuOpen}
            color="inherit"
          >
            <MoreIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>

    {renderMobileMenu}
    {renderMenu}
  </navbar>
);
  }
  else{
 return (
  <navbar style={{ width: '100%' }}>
    <AppBar 
  position="fixed" 
  sx={{ 
    top: 0,
    width: '100%',
    backgroundColor: 'rgba(27, 0, 123, 0.93)' // <-- your new vibe
  }}
>
      <Toolbar>
     <img 
  src={redditLogo} 
  alt="navbar"
  style={{
    height: '30px',
    objectFit: 'contain',
    cursor: 'pointer'
  }}
/>




      <Typography
  variant="h6"
  noWrap
  component="div"
  sx={{
    display: { xs: 'none', sm: 'block' },
    fontFamily: '"Poppins", sans-serif',
    fontWeight: 700,
    letterSpacing: '1px',
    textTransform: 'uppercase'
  }}
>
  Bluedit
</Typography>


        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search…"
            inputProps={{ 'aria-label': 'search' }}
          />
        </Search>

        <Box sx={{ flexGrow: 1 }} />


        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Button
  variant="contained"
  startIcon={<AddIcon />}
  sx={{
    mr: 2,
    backgroundColor: '#ea00ffff',
    color: 'white',
    fontWeight: 600,
    textTransform: 'none',
    borderRadius: '20px',
    px: 2,
    '&:hover': {
      backgroundColor: '#00e047ff'
    }
  }}
>
  Log in
</Button>
          

          

           <Button
  variant="contained"
  startIcon={<AddIcon />}
  sx={{
    mr: 2,
    backgroundColor: '#ff0000ff',
    color: 'white',
    fontWeight: 600,
    textTransform: 'none',
    borderRadius: '20px',
    px: 2,
    '&:hover': {
      backgroundColor: '#00e047ff'
    }
  }}
>
  Sign Up
</Button>
        </Box>

        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <IconButton
            size="large"
            aria-controls={mobileMenuId}
            aria-haspopup="true"
            onClick={handleMobileMenuOpen}
            color="inherit"
          >
            <MoreIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>

    {renderMobileMenu}
    {renderMenu}
  </navbar>
);
  }

}
