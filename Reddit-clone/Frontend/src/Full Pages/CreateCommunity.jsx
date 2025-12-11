import * as React from 'react';
import { useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import { styled } from '@mui/material/styles';
import { Box, Button } from '@mui/material';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import "../styles/createCommunity.css"; // <-- Import CSS

const BLUE = "#0066ff";        
const BLUE_HOVER = "#0055cc";

const mockTopics = [
  { category: "Anime & Cosplay", topics: ["Anime & Manga", "Cosplay", "Otaku Culture", "Japanese Media"] },
  { category: "Art", topics: ["Performing Arts", "Architecture", "Design", "Art", "Filmmaking", "Digital Art", "Photography"] },
  { category: "Business & Finance", topics: ["Personal Finance", "Crypto", "Economics", "Business News & Discussion", "Deals & Marketplace", "Startups & Entrepreneurship", "Real Estate", "Stocks & Investing"] },
  { category: "Technology", topics: ["Programming", "Web Development", "AI & Machine Learning", "Cybersecurity", "Cloud Computing", "Data Science", "Open Source"] },
  { category: "Gaming", topics: ["PC Gaming", "Console Gaming", "Esports", "Game Development", "Retro Games", "Speedrunning"] }
];

// Styled components
const Search = styled('div')(() => ({
  position: 'relative',
  borderRadius: '999px',
  border: '1px solid #343536',
  backgroundColor: '#1a1a1b',
  marginTop: '24px',
  width: '100%',
}));

const SearchIconWrapper = styled('div')(() => ({
  padding: '0 16px',
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#818384',
}));

const StyledInputBase = styled(InputBase)(() => ({
  color: '#fff',
  width: '100%',
  paddingLeft: '48px',
  paddingTop: '12px',
  paddingBottom: '12px',
  fontSize: '14px',
}));

function CreateCommunity() {
  return <SimpleContainer />;
}

export default CreateCommunity;

// --- Main Container ---
function SimpleContainer() {
  const [topics, setTopics] = useState([]);
  const [privacy, setPrivacy] = useState("Public");
  const [page, setPage] = useState(1);
  const [commname, setname] = useState("");
  const [commdesc, setdesc] = useState("");
  const [bannerFile, setBannerFile] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  return (
    <>
      <CssBaseline />
      <Box className="background" />
      {page === 1 && <SelectTopics setTopics={setTopics} topics={topics} setPage={setPage} />}
      {page === 2 && <SelectPrivacy setPage={setPage} page={page} privacy={privacy} setPrivacy={setPrivacy} />}
      {page === 3 && <Commdetails setdesc={setdesc} commname={commname} setname={setname} commdesc={commdesc} setPage={setPage} page={page} />}
      {page === 4 && <CommunityAppearance commname={commname} commdesc={commdesc} privacy={privacy} topics={topics} setPage={setPage} bannerFile={bannerFile} setBannerFile={setBannerFile} avatarFile={avatarFile} setAvatarFile={setAvatarFile} />}
      {page === 5 && alert("Community Created!")}
    </>
  );
}

// --- Community Appearance ---
function CommunityAppearance(props) {
  const bannerUrl = props.bannerFile ? URL.createObjectURL(props.bannerFile) : null;
  const avatarUrl = props.avatarFile ? URL.createObjectURL(props.avatarFile) : null;

  return (
    <Box className="container">
      <Box className="card">
        <Box className="card-header">
          <Typography variant="h6" className="title">Community Appearance</Typography>
          <Typography className="subtitle">Add a banner and icon to make your community stand out</Typography>
        </Box>
        <Box className="card-body">
          <Box className="preview" style={{ backgroundImage: bannerUrl ? `url(${bannerUrl})` : 'none' }}>
            {!bannerUrl && <Typography className="no-banner">No banner yet</Typography>}
            <Box className="avatar" style={{ backgroundImage: avatarUrl ? `url(${avatarUrl})` : 'none' }}>
              {!avatarUrl && (props.commname?.[0]?.toUpperCase() || 'C')}
            </Box>
          </Box>
          <Typography className="comm-name">r/{props.commname || 'your_community'}</Typography>
          <Typography className="comm-info">{props.privacy} • {props.topics?.length || 0} topics</Typography>
          <Typography className="comm-desc">{props.commdesc || 'No description added.'}</Typography>
        </Box>
      </Box>
    </Box>
  );
}

// --- Other components remain unchanged (SelectTopics, SelectPrivacy, Commdetails) ---
