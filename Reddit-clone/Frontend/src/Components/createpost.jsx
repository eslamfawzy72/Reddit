import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';






function PostTypeFilter({ typeChosen, setTypeChosen, pollOptions, setPollOptions, mediaFiles, setMediaFiles }) {
  const types = ['Text', 'Media', 'Poll'];

  return (
    <>
      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
        {types.map((type) => (
          <Chip
            key={type}
            label={type}
            clickable
            color={typeChosen === type ? 'primary' : 'default'}
            onClick={() => setTypeChosen(type)}
            sx={{ fontWeight: 500, px: 2, py: 1, cursor: 'pointer', transition: '0.2s', '&:hover': { transform: 'scale(1.05)' } }}
          />
        ))}
      </Box>

      {typeChosen === 'Text' && (
        <TextField placeholder="Text (optional)" variant="outlined" multiline rows={8} inputProps={{ maxLength: 1000 }} sx={{ width: '100%' }} />
      )}

      {typeChosen === 'Media' && (
        <input
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={(e) => setMediaFiles([...mediaFiles, ...Array.from(e.target.files)])}
        />
      )}

      {typeChosen === 'Poll' && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {pollOptions.map((option, index) => (
            <TextField
              key={index}
              placeholder={`Option ${index + 1}`}
              variant="outlined"
              value={option}
              onChange={(e) => {
                const newOptions = [...pollOptions];
                newOptions[index] = e.target.value;
                setPollOptions(newOptions);
              }}
            />
          ))}

          <Chip label="Add Option" clickable color="secondary" onClick={() => setPollOptions([...pollOptions, ''])} sx={{ width: 'fit-content', mt: 1 }} />
        </Box>
      )}
    </>
  );
}




// Reddit-style tags
const redditTags = [
  { title: 'Programming' },
  { title: 'Gaming' },
  { title: 'Movies' },
  { title: 'Music' },
  { title: 'Sports' },
  { title: 'Anime' },
  { title: 'Manga' },
  { title: 'Technology' },
  { title: 'Science' },
  { title: 'Art' },
  { title: 'Books' },
  { title: 'Food' },
  { title: 'Fitness' },
  { title: 'Travel' },
  { title: 'Memes' },
  { title: 'News' },
  { title: 'Photography' },
  { title: 'DIY' },
  { title: 'History' },
  { title: 'Fashion' },
  { title: 'Finance' },
  { title: 'Crypto' },
  { title: 'Politics' },
  { title: 'Movies & TV' },
  { title: 'Education' },
  { title: 'Animals' },
  { title: 'Health' },
  { title: 'Comics' },
  { title: 'Gaming News' },
  { title: 'Software' },
  { title: 'Web Development' },
  { title: 'AI & Machine Learning' },
  { title: 'ReactJS' },
  { title: 'NodeJS' },
  { title: 'Python' },
  { title: 'C++' },
  { title: 'JavaScript' },
  { title: 'Blockchain' },
  { title: 'Startups' },
  { title: 'Motivation' },
  { title: 'Funny' },
];

function FixedTags() {
  const [value, setValue] = React.useState([]);

  return (
    <Autocomplete
      multiple
      options={redditTags}
      value={value}
      onChange={(event, newValue) => setValue(newValue)}
      getOptionLabel={(option) => option.title}
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((option, index) => (
          <Chip
            key={option.title}
            label={option.title}
            {...getTagProps({ index })}
            sx={{
              backgroundColor: '#ffe082',
              color: '#5d4037',
              fontWeight: 500,
              margin: '2px',
            }}
          />
        ))
      }
      sx={{ width: '100%', marginTop: 1 }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Tags"
          placeholder={value.length === 0 ? "Add Tags" : ""}
          variant="outlined"
          size="small"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              bgcolor: '#fff8e1',
              paddingLeft: '8px',
            },
          }}
        />
      )}
    />
  );
}

function ComboBox() {
  return (
    <Autocomplete
      disablePortal
      options={['adhams','Movie Lovers','hamadas']}
      sx={{ width: '100%', marginBottom: 2 }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Community"
          placeholder="Select Community"
          variant="outlined"
          size="small"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              bgcolor: '#e3f2fd',
              paddingLeft: '8px',
            },
          }}
        />
      )}
    />
  );
}

function SimpleContainer() {
  const [typeChosen, setTypeChosen] = React.useState('Text');
  const [pollOptions, setPollOptions] = React.useState(['', '']); // start with 2 options
  const [mediaFiles, setMediaFiles] = React.useState([]); // store uploaded media

  return (
    <React.Fragment>
      <CssBaseline />
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '100vh', bgcolor: '#DAE0E6', paddingTop: 4, paddingBottom: 4 }}>
        <Box sx={{ width: 740, bgcolor: '#ffffff', padding: 0, borderRadius: '4px', border: '1px solid #EDEFF1', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          
          <Box sx={{ bgcolor: '#FFFFFF', padding: '14px 16px', borderBottom: '1px solid #EDEFF1' }}>
            <Typography variant="h6" sx={{ fontWeight: 500, color: '#1c1c1c', fontSize: '18px' }}>
              Create a post
            </Typography>
          </Box>

          <Box sx={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Community selector */}
            <ComboBox />

            {/* Title field */}
            <TextField placeholder="Title" variant="outlined" size="small" inputProps={{ maxLength: 300 }} sx={{ width: '100%' }} />

            {/* Post Type */}
            <PostTypeFilter
              typeChosen={typeChosen}
              setTypeChosen={setTypeChosen}
              pollOptions={pollOptions}
              setPollOptions={setPollOptions}
              mediaFiles={mediaFiles}
              setMediaFiles={setMediaFiles}
            />

            {/* Tags */}
            <FixedTags />

            {/* Post button */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 1 }}>
              <Box component="button" sx={{ bgcolor: '#0079D3', color: '#FFFFFF', border: 'none', borderRadius: '9999px', padding: '8px 28px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', '&:hover': { bgcolor: '#0060A8' }, '&:active': { bgcolor: '#004C87' } }}>
                Post
              </Box>
            </Box>

          </Box>
        </Box>
      </Box>
    </React.Fragment>
  );
}


function CreatePost() {
  return <SimpleContainer />;
}

export default CreatePost;
