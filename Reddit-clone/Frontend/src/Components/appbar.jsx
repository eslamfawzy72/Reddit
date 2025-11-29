// src/components/PrimarySearchAppBar.jsx

import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';

const SearchContainer = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': { backgroundColor: alpha(theme.palette.common.white, 0.25) },
  marginLeft: theme.spacing(3),
  width: '100%',
  [theme.breakpoints.up('sm')]: { width: 'auto' },
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
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '40ch',
      '&:focus': { width: '50ch' },
    },
  },
}));

export default function PrimarySearchAppBar({ 
  loggedin = false,
  searchFunction,           // ← REQUIRED: (query) => { results, renderItem }
  onResultClick,            // ← REQUIRED: (result) => void
  placeholder = "Search Bluedit…",
  fullSearchLabel = "Search for"
}) {
  const [query, setQuery] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [results, setResults] = React.useState([]);
  const [renderItem, setRenderItem] = React.useState(null);

  // Run the search function whenever query changes
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
    setQuery('');
    setOpen(false);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" sx={{ backgroundColor: 'rgba(27, 0, 123, 0.93)' }}>
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            sx={{
              display: { xs: 'none', sm: 'block' },
              fontFamily: '"Poppins", sans-serif',
              fontWeight: 700,
              letterSpacing: '1px',
              mr: 3,
            }}
          >
            Bluedit
          </Typography>

          {/* REUSABLE SEARCH BAR — LOGIC COMES FROM PROPS */}
          <Box sx={{ position: 'relative', flexGrow: 1, maxWidth: 720 }}>
            <SearchContainer>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder={placeholder}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setOpen(true);
                }}
                onFocus={() => setOpen(true)}
              />
            </SearchContainer>

            {/* LIGHT BLUE DROPDOWN — FULLY CONTROLLED BY searchFunction */}
            {open && (
              <Box
                sx={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  backgroundColor: '#e3f2fd',
                  border: '1px solid #bbdefb',
                  borderRadius: 3,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  mt: 1,
                  maxHeight: 500,
                  overflow: 'auto',
                  zIndex: 1300,
                }}
              >
                {results.length === 0 ? (
                  <Box sx={{ p: 3, color: '#1565c0', textAlign: 'center', fontWeight: 500 }}>
                    {query ? 'No results found' : 'Start typing...'}
                  </Box>
                ) : (
                  results.map((item, i) => (
                    <Box
                      key={item.id || i}
                      onClick={() => handleItemClick(item)}
                      sx={{
                        p: 2,
                        cursor: 'pointer',
                        backgroundColor: i % 2 === 0 ? '#e3f2fd' : '#bbdefb',
                        '&:hover': { backgroundColor: '#90caf9' },
                        transition: 'background-color 0.2s',
                      }}
                    >
                      {renderItem && renderItem(item)}
                    </Box>
                  ))
                )}

                {query && results.length > 0 && (
                  <Box
                    onClick={() => handleItemClick({ type: 'full-search', query })}
                    sx={{
                      p: 2.5,
                      borderTop: '2px solid #90caf9',
                      backgroundColor: '#bbdefb',
                      fontWeight: 700,
                      color: '#0d47a1',
                      textAlign: 'center',
                      cursor: 'pointer',
                      '&:hover': { backgroundColor: '#90caf9' },
                    }}
                  >
                    {fullSearchLabel} "{query}"
                  </Box>
                )}
              </Box>
            )}
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          {/* RIGHT BUTTONS */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            {loggedin ? (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                sx={{
                  backgroundColor: '#008cffff',
                  borderRadius: '20px',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3,
                  '&:hover': { backgroundColor: '#00e047' },
                }}
              >
                Create
              </Button>
            ) : (
              <>
                <Button variant="contained" sx={{ backgroundColor: '#ea00ffff', borderRadius: '20px', px: 3 }}>
                  Log In
                </Button>
                <Button variant="contained" sx={{ backgroundColor: '#ff0000ff', borderRadius: '20px', px: 3 }}>
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