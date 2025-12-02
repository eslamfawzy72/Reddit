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

const BLUE = "#0066ff";        // Your main blue
const BLUE_HOVER = "#0055cc";  // Hover state

const mockTopics = [
  { category: "Anime & Cosplay", topics: ["Anime & Manga", "Cosplay", "Otaku Culture", "Japanese Media"] },
  { category: "Art", topics: ["Performing Arts", "Architecture", "Design", "Art", "Filmmaking", "Digital Art", "Photography"] },
  { category: "Business & Finance", topics: ["Personal Finance", "Crypto", "Economics", "Business News & Discussion", "Deals & Marketplace", "Startups & Entrepreneurship", "Real Estate", "Stocks & Investing"] },
  { category: "Technology", topics: ["Programming", "Web Development", "AI & Machine Learning", "Cybersecurity", "Cloud Computing", "Data Science", "Open Source"] },
  { category: "Gaming", topics: ["PC Gaming", "Console Gaming", "Esports", "Game Development", "Retro Games", "Speedrunning"] }
];

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: '999px',
  border: '1px solid #343536',
  backgroundColor: '#1a1a1b',
  marginTop: theme.spacing(3),
  width: '100%',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: '0 16px',
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#818384',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
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
      
      {/* FULL DARK BACKGROUND - FIXED */}
      <Box sx={{ position: 'fixed', inset: 0, bgcolor: '#0A0A0A', zIndex: -1 }} />
      
      {page === 1 && (
        <SelectTopics setTopics={setTopics} topics={topics} setPage={setPage} />
      )}
      {page === 2 && (
        <SelectPrivacy setPage={setPage} page={page} privacy={privacy} setPrivacy={setPrivacy} />
      )}
      {page === 3 && (
        <Commdetails setdesc={setdesc} commname={commname} setname={setname} commdesc={commdesc} setPage={setPage} page={page} />
      )}
      {page === 4 && (
        <CommunityAppearance 
          commname={commname}
          commdesc={commdesc}
          privacy={privacy}
          topics={topics}
          setPage={setPage}
          bannerFile={bannerFile}
          setBannerFile={setBannerFile}
          setAvatarFile={setAvatarFile}
          avatarFile={avatarFile}
        />
      )}
      {page === 5 && (
        alert("Community Created!")
      )}
    </>
  );
}

function CommunityAppearance(props) {
  const bannerUrl = props.bannerFile ? URL.createObjectURL(props.bannerFile) : null;
  const avatarUrl = props.avatarFile ? URL.createObjectURL(props.avatarFile) : null;

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '100vh', paddingTop: 6, paddingBottom: 6 }}>
        <Box sx={{ width: '100%', maxWidth: '900px', bgcolor: '#FFFFFF', borderRadius: '12px', boxShadow: '0 4px 14px rgba(0,0,0,0.15)', overflow: 'hidden' }}>
          <Box sx={{ padding: '20px 24px', borderBottom: '1px solid #EDEFF1', background: 'linear-gradient(180deg, #1a1a1b, #030303)' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#EDEFF1', fontSize: '20px' }}>
              Community Appearance
            </Typography>
            <Typography sx={{ color: '#AEB4B8', fontSize: '14px', marginTop: '4px' }}>
              Add a banner and icon to make your community stand out
            </Typography>
          </Box>

          <Box sx={{ padding: '24px', backgroundColor: '#030303' }}>
            {/* Live Preview */}
            <Box sx={{ width: '100%', maxWidth: 460, borderRadius: 3, overflow: 'hidden', bgcolor: '#1a1a1b', border: '1px solid #343536', mb: 5, boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
              <Box sx={{ height: 120, bgcolor: bannerUrl ? 'transparent' : '#272729', backgroundImage: bannerUrl ? `url(${bannerUrl})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                {!bannerUrl && (
                  <Typography sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#666', fontSize: 14 }}>
                    No banner yet
                  </Typography>
                )}
              </Box>
              <Box sx={{ mt: 5 }} />
              <Box sx={{ p: 3, pb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    bgcolor: avatarUrl ? 'transparent' : BLUE,
                    backgroundImage: avatarUrl ? `url(${avatarUrl})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    border: '4px solid #030303',
                    mt: -10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '32px',
                    fontWeight: 700,
                    color: '#fff',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                  }}>
                    {!avatarUrl && (props.commname?.[0]?.toUpperCase() || 'C')}
                  </Box>
                  <Box>
                    <Typography variant="h5" sx={{ color: '#EDEFF1', fontWeight: 700 }}>
                      r/{props.commname || 'your_community'}
                    </Typography>
                    <Typography sx={{ color: '#818384', fontSize: 14 }}>
                      {props.privacy} • {props.topics?.length || 0} topics
                    </Typography>
                  </Box>
                </Box>
                <Typography sx={{ color: '#D7DADC', lineHeight: 1.6 }}>
                  {props.commdesc || 'No description added.'}
                </Typography>
              </Box>
            </Box>

            {/* Upload Buttons - ORANGE → BLUE */}
            <Typography sx={{ color: '#EDEFF1', fontWeight: 600, mb: 2 }}>Community Banner</Typography>
            <Box sx={{ mb: 4 }}>
              <input accept="image/*" type="file" id="banner-upload" style={{ display: 'none' }} onChange={(e) => props.setBannerFile(e.target.files[0])} />
              <label htmlFor="banner-upload">
                <Button variant="outlined" component="span" sx={{
                  borderColor: '#343536', color: '#EDEFF1', borderRadius: '999px', px: 4, py: 1.5, textTransform: 'none',
                  '&:hover': { borderColor: BLUE, bgcolor: 'rgba(0,102,255,0.1)' }
                }}>
                  {props.bannerFile ? 'Change Banner' : 'Upload Banner'}
                </Button>
              </label>
            </Box>

            <Typography sx={{ color: '#EDEFF1', fontWeight: 600, mb: 2 }}>Community Icon</Typography>
            <Box>
              <input accept="image/*" type="file" id="avatar-upload" style={{ display: 'none' }} onChange={(e) => props.setAvatarFile(e.target.files[0])} />
              <label htmlFor="avatar-upload">
                <Button variant="outlined" component="span" sx={{
                  borderColor: '#343536', color: '#EDEFF1', borderRadius: '999px', px: 4, py: 1.5, textTransform: 'none',
                  '&:hover': { borderColor: BLUE, bgcolor: 'rgba(0,102,255,0.1)' }
                }}>
                  {props.avatarFile ? 'Change Icon' : 'Upload Icon'}
                </Button>
              </label>
            </Box>

            {/* Final Buttons - ORANGE → BLUE */}
            <Box display="flex" justifyContent="space-between" mt={6}>
              <Button variant="outlined" onClick={() => props.setPage(3)} sx={{
                borderColor: '#343536', color: '#fff', borderRadius: '999px', padding: '10px 28px', fontWeight: 600, textTransform: 'none',
                '&:hover': { borderColor: BLUE, backgroundColor: 'rgba(0,102,255,0.1)' }
              }}>
                Back
              </Button>

              <Button variant="contained" onClick={() => props.setPage(5)} sx={{
                background: `linear-gradient(135deg, ${BLUE}, #0088ff)`,
                borderRadius: '999px',
                padding: '10px 28px',
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: '0 6px 14px rgba(0,102,255,0.4)',
                transition: 'all 0.3s ease',
                '&:hover': { background: `linear-gradient(135deg, ${BLUE_HOVER}, #0077dd)`, transform: 'scale(1.05)' }
              }}>
                Create Community
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}

/* All other components (SelectTopics, SelectPrivacy, Commdetails) stay EXACTLY the same as your original code,
   only the orange colors inside them are replaced with BLUE and BLUE_HOVER where needed */

function SelectTopics(props) {
  const [filterValue, setFilterValue] = useState('');
  const handleTopicClick = (topic) => {
    if (props.topics.includes(topic)) {
      props.setTopics(props.topics.filter(t => t !== topic));
    } else if (props.topics.length < 3) {
      props.setTopics([...props.topics, topic]);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '100vh', paddingTop: 6, paddingBottom: 6 }}>
      <Box sx={{ width: '100%', maxWidth: '900px', bgcolor: '#FFFFFF', borderRadius: '12px', boxShadow: '0 4px 14px rgba(0,0,0,0.15)', overflow: 'hidden' }}>
        <Box sx={{ padding: '20px 24px', borderBottom: '1px solid #EDEFF1', background: 'linear-gradient(180deg, #1a1a1b, #030303)' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#EDEFF1', fontSize: '20px' }}>Add topics</Typography>
          <Typography sx={{ color: '#AEB4B8', fontSize: '14px', marginTop: '4px' }}>
            Add up to 3 topics to help interested redditors find your community.
          </Typography>
        </Box>

        <Box sx={{ padding: '24px', backgroundColor: '#030303', minHeight: '300px' }}>
          <Search>
            <SearchIconWrapper><SearchIcon /></SearchIconWrapper>
            <StyledInputBase placeholder="Filter topics" value={filterValue} onChange={(e) => setFilterValue(e.target.value)} />
          </Search>

          {mockTopics.map((group, index) => (
            <Box key={index} sx={{ marginTop: '20px' }}>
              <Typography sx={{ color: '#fff', fontWeight: 600, marginBottom: '8px' }}>{group.category}</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {group.topics
                  .filter(topic => topic.toLowerCase().includes(filterValue.toLowerCase()))
                  .map((topic, i) => (
                    <Chip
                      key={i}
                      label={topic}
                      clickable
                      onClick={() => handleTopicClick(topic)}
                      sx={{
                        backgroundColor: props.topics.includes(topic) ? BLUE : '#272729',
                        color: props.topics.includes(topic) ? '#fff' : '#EDEFF1',
                        border: props.topics.includes(topic) ? `2px solid ${BLUE}` : 'none',
                        fontWeight: props.topics.includes(topic) ? 600 : 500,
                        boxShadow: props.topics.includes(topic) ? `0 0 12px rgba(0,102,255,0.5)` : 'none',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: props.topics.includes(topic) ? BLUE_HOVER : '#343536',
                          transform: 'scale(1.05)',
                        },
                      }}
                    />
                  ))}
              </Box>
            </Box>
          ))}

          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button variant="contained" onClick={() => props.setPage(2)} sx={{
              background: `linear-gradient(135deg, ${BLUE}, #0088ff)`,
              borderRadius: '999px',
              padding: '10px 28px',
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: '0 6px 14px rgba(0,102,255,0.4)',
              '&:hover': { background: `linear-gradient(135deg, ${BLUE_HOVER}, #0077dd)`, transform: 'scale(1.05)' }
            }}>
              Next
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function SelectPrivacy(props) {
  const privacyOptions = [
    { type: 'Public', description: 'Anyone can view, post, and comment to this community' },
    { type: 'Restricted', description: 'Anyone can view this community, but only approved users can post' },
    { type: 'Private', description: 'Only approved users can view and submit to this community' }
  ];

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '100vh', paddingTop: 6, paddingBottom: 6 }}>
      <Box sx={{ width: '100%', maxWidth: '900px', bgcolor: '#FFFFFF', borderRadius: '12px', boxShadow: '0 4px 14px rgba(0,0,0,0.15)', overflow: 'hidden' }}>
        <Box sx={{ padding: '20px 24px', borderBottom: '1px solid #EDEFF1', background: 'linear-gradient(180deg, #1a1a1b, #030303)' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#EDEFF1', fontSize: '20px' }}>Select Privacy</Typography>
          <Typography sx={{ color: '#AEB4B8', fontSize: '14px', marginTop: '4px' }}>Decide who can view and contribute to your community</Typography>
        </Box>

        <Box sx={{ padding: '24px', backgroundColor: '#030303', minHeight: '300px' }}>
          {privacyOptions.map((option, index) => (
            <Box key={index} onClick={() => props.setPrivacy(option.type)} sx={{
              padding: '16px', marginBottom: '12px',
              backgroundColor: props.privacy === option.type ? '#1a1a1b' : '#0d0d0d',
              border: props.privacy === option.type ? `2px solid ${BLUE}` : '1px solid #343536',
              borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s ease',
              '&:hover': { backgroundColor: '#1a1a1b', transform: 'translateX(4px)' }
            }}>
              <Typography sx={{ color: '#fff', fontWeight: 600, marginBottom: '4px' }}>{option.type}</Typography>
              <Typography sx={{ color: '#AEB4B8', fontSize: '14px' }}>{option.description}</Typography>
            </Box>
          ))}

          <Box display="flex" justifyContent="space-between" mt={3}>
            <Button variant="outlined" onClick={() => props.setPage(1)} sx={{
              borderColor: '#343536', color: '#fff', borderRadius: '999px', padding: '10px 28px', fontWeight: 600, textTransform: 'none',
              '&:hover': { borderColor: BLUE, backgroundColor: 'rgba(0,102,255,0.1)' }
            }}>Back</Button>
            <Button variant="contained" onClick={() => props.setPage(3)} sx={{
              background: `linear-gradient(135deg, ${BLUE}, #0088ff)`,
              borderRadius: '999px', padding: '10px 28px', fontWeight: 600, textTransform: 'none',
              boxShadow: '0 6px 14px rgba(0,102,255,0.4)',
              '&:hover': { background: `linear-gradient(135deg, ${BLUE_HOVER}, #0077dd)`, transform: 'scale(1.05)' }
            }}>Next</Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function Commdetails(props) {
  const mockTakenNames = ["reactjs", "javascript", "webdev", "programming", "gaming", "anime", "technology", "startups", "crypto", "memes", "funny", "cats"];
  const normalizedName = props.commname.trim().toLowerCase();
  const isTaken = mockTakenNames.includes(normalizedName);
  const isValid = normalizedName.length > 0 && !isTaken;

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '100vh', paddingTop: 6, paddingBottom: 6 }}>
      <Box sx={{ width: '100%', maxWidth: '900px', bgcolor: '#FFFFFF', borderRadius: '12px', boxShadow: '0 4px 14px rgba(0,0,0,0.15)', overflow: 'hidden' }}>
        <Box sx={{ padding: '20px 24px', borderBottom: '1px solid #EDEFF1', background: 'linear-gradient(180deg, #1a1a1b, #030303)' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#EDEFF1', fontSize: '20px' }}>Add Name And Description</Typography>
          <Typography sx={{ color: '#AEB4B8', fontSize: '14px', marginTop: '4px' }}>
            Name And Description to help people understand what the community is about
          </Typography>
        </Box>

        <Box sx={{ padding: '24px', backgroundColor: '#030303', minHeight: '300px' }}>
          {/* Name field - blue focus */}
          <Box sx={{ position: 'relative' }}>
            <TextField
              placeholder="Community Name"
              variant="outlined"
              size="small"
              inputProps={{ maxLength: 21 }}
              value={props.commname}
              onChange={(e) => {
                const value = e.target.value.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase();
                props.setname(value);
              }}
              sx={{
                width: '100%',
                '& .MuiOutlinedInput-root': {
                  color: '#EDEFF1',
                  backgroundColor: '#1a1a1b',
                  borderRadius: '999px',
                  fontSize: '15px',
                  '& fieldset': { borderColor: '#343536' },
                  '&:hover fieldset': { borderColor: '#565656' },
                  '&.Mui-focused fieldset': {
                    borderColor: isTaken ? '#d32f2f' : BLUE,
                    borderWidth: '2px',
                    boxShadow: isTaken ? '0 0 0 3px rgba(211,47,47,0.2)' : `0 0 0 3px rgba(0,102,255,0.2)`,
                  },
                },
                '& .MuiOutlinedInput-input': { padding: '12px 16px' },
              }}
            />
            {normalizedName && (
              <Typography sx={{
                position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
                fontSize: '13px', fontWeight: 600,
                color: isTaken ? '#d32f2f' : '#00c853',
              }}>
                {isTaken ? 'Taken' : 'Available'}
              </Typography>
            )}
          </Box>

          {/* Description */}
          <Box sx={{ mt: 4 }}>
            <TextField
              placeholder="Text (optional)"
              variant="outlined"
              multiline
              rows={8}
              fullWidth
              value={props.commdesc}
              onChange={(e) => props.setdesc(e.target.value)}
              inputProps={{ maxLength: 1000 }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: '#1a1a1b',
                  color: '#EDEFF1',
                  borderRadius: '12px',
                  fontSize: '15px',
                  lineHeight: '1.5',
                  '& fieldset': { borderColor: '#343536', borderWidth: '1px' },
                  '&:hover fieldset': { borderColor: '#565656' },
                  '&.Mui-focused fieldset': { borderColor: BLUE, borderWidth: '2px', boxShadow: `0 0 0 4px rgba(0,102,255,0.2)` },
                },
                '& .MuiOutlinedInput-input': { py: 2, px: 2.5 },
              }}
            />
          </Box>

          {/* Preview & Buttons - blue version */}
          <Box sx={{ width: '100%', maxWidth: 460, p: 3, borderRadius: 3, bgcolor: '#1a1a1b', border: '1px solid #343536', mt: 4,
            '&:hover': { borderColor: BLUE, boxShadow: `0 0 0 1px ${BLUE}`, transform: 'translateY(-2px)' },
          }}>
            <Typography variant="h5" sx={{ color: '#EDEFF1', fontWeight: 700, fontSize: '22px', mb: 1 }}>
              r/{props.commname || 'your_community'}
            </Typography>
            <Typography sx={{ color: '#818384', fontSize: '14px', mb: 2.5, fontWeight: 500 }}>Community Preview</Typography>
            <Typography sx={{ color: '#D7DADC', fontSize: '15px', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
              {props.commdesc || 'No description yet.'}
            </Typography>
          </Box>

          <Box display="flex" justifyContent="space-between" mt={4}>
            <Button variant="outlined" onClick={() => props.setPage(2)} sx={{
              borderColor: '#343536', color: '#fff', borderRadius: '999px', padding: '10px 28px', fontWeight: 600, textTransform: 'none',
              '&:hover': { borderColor: BLUE, backgroundColor: 'rgba(0,102,255,0.1)' }
            }}>Back</Button>

            <Button variant="contained" disabled={!isValid} onClick={() => props.setPage(4)} sx={{
              background: isValid ? `linear-gradient(135deg, ${BLUE}, #0088ff)` : '#444',
              borderRadius: '999px', padding: '10px 28px', fontWeight: 600, textTransform: 'none',
              boxShadow: isValid ? '0 6px 14px rgba(0,102,255,0.4)' : 'none',
              opacity: isValid ? 1 : 0.6,
              '&:hover': { background: isValid ? `linear-gradient(135deg, ${BLUE_HOVER}, #0077dd)` : '#444', transform: isValid ? 'scale(1.05)' : 'none' }
            }}>
              {isTaken ? 'Name Taken' : 'Next ->'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}