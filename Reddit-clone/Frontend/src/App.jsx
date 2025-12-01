import UsersList from "./Components/users"
import Chats from "./Components/chats"
import CreatePost from "./Components/createpost"
import SignUp from "./Pages/Signup"
import { AppBar } from "@mui/material"
import CreateCommunity from "./Components/createcommunity"
import PrimarySearchAppBar from "./Components/appbar"
import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
// src/config/searchConfig.js

// MOCK DATA
export const mockCommunities = [
  { id: 1, type: 'community', name: 'reactjs', display: 'b/reactjs', members: '412k', icon: 'React' },
  { id: 2, type: 'community', name: 'javascript', display: 'b/javascript', members: '1.2M', icon: 'JS' },
  { id: 3, type: 'community', name: 'programming', display: 'b/programming', members: '2.8M', icon: 'Code' },
  { id: 4, type: 'community', name: 'webdev', display: 'b/webdev', members: '892k', icon: 'Web' },
  { id: 5, type: 'community', name: 'bluedit', display: 'b/bluedit', members: '89k', icon: 'Blue' },
  { id: 6, type: 'community', name: 'nextjs', display: 'b/nextjs', members: '298k', icon: 'Next' },
];

export const mockUsers = [
  { id: 101, type: 'user', name: 'john_dev', display: 'u/john_dev', karma: '12.4k', icon: 'J' },
  { id: 102, type: 'user', name: 'react_master', display: 'u/react_master', karma: '45k', icon: 'R' },
  { id: 103, type: 'user', name: 'bluecoder', display: 'u/bluecoder', karma: '8.9k', icon: 'B' },
  { id: 104, type: 'user', name: 'webdev_guru', display: 'u/webdev_guru', karma: '67k', icon: 'W' },
  { id: 105, type: 'user', name: 'js_ninja', display: 'u/js_ninja', karma: '89k', icon: 'Ninja' },
];

// REUSABLE RENDER FUNCTION (shared)
const renderCommunityItem = (item) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
    <Box
      sx={{
        width: 40,
        height: 40,
        borderRadius: 2,
        backgroundColor: '#1b007b',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
      }}
    >
      {item.icon}
    </Box>
    <Box>
      <Typography fontWeight={600} color="#0d47a1">{item.display}</Typography>
      <Typography fontSize="13px" color="#1565c0">{item.members} members</Typography>
    </Box>
  </Box>
);

const renderUserItem = (item) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
    <Box
      sx={{
        width: 40,
        height: 40,
        borderRadius: '50%',
        backgroundColor: '#ff5722',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
      }}
    >
      {item.icon}
    </Box>
    <Box>
      <Typography fontWeight={600} color="#0d47a1">{item.display}</Typography>
      <Typography fontSize="13px" color="#1565c0">• {item.karma} karma</Typography>
    </Box>
  </Box>
);

// 1. SEARCH EVERYTHING (communities + users)
export const searchEverything = (query) => {
  if (!query?.trim()) return { results: [], renderItem: null };
  const q = query.toLowerCase();

  const communities = mockCommunities
    .filter(c => c.name.includes(q))
    .map(c => ({ ...c, score: c.name.startsWith(q) ? 100 : 50 }));

  const users = mockUsers
    .filter(u => u.name.includes(q))
    .map(u => ({ ...u, score: u.name.startsWith(q) ? 90 : 40 }));

  const results = [...communities, ...users]
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);

  const renderItem = (item) => item.type === 'user' ? renderUserItem(item) : renderCommunityItem(item);

  return { results, renderItem };
};

// 2. SEARCH COMMUNITIES ONLY
export const searchCommunitiesOnly = (query) => {
  if (!query?.trim()) return { results: [], renderItem: null };
  const q = query.toLowerCase();

  const results = mockCommunities
    .filter(c => c.name.includes(q))
    .sort((a, b) => b.name.startsWith(q) - a.name.startsWith(q))
    .slice(0, 8);

  return { results, renderItem: renderCommunityItem };
};

// 3. SEARCH USERS ONLY
export const searchUsersOnly = (query) => {
  if (!query?.trim()) return { results: [], renderItem: null };
  const q = query.toLowerCase();

  const results = mockUsers
    .filter(u => u.name.includes(q))
    .sort((a, b) => b.name.startsWith(q) - a.name.startsWith(q))
    .slice(0, 8);

  return { results, renderItem: renderUserItem };
}
function App() {

  return (
    <>
   {/* <PrimarySearchAppBar
      loggedin={true}
      searchFunction={searchEverything}  // ← can be any of the 3
      onResultClick={(result) => {
        if (result.type === 'community') alert(`Go to ${result.display}`);
        if (result.type === 'user') alert(`View ${result.display}`);
        if (result.type === 'full-search') alert(`Searching: ${result.query}`);
      }}
    /> */}
<SignUp />
    </>
  )
}

export default App
