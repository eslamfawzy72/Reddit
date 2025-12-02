import * as React from 'react';
import {
  TextField,
  Autocomplete,
  CssBaseline,
  Box,
  Chip,
  Typography,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const redditTags = [
  { title: 'Programming' }, { title: 'Gaming' }, { title: 'Movies' }, { title: 'Music' },
  { title: 'Anime' }, { title: 'Technology' }, { title: 'Memes' }, { title: 'Funny' },
  { title: 'ReactJS' }, { title: 'JavaScript' }, { title: 'WebDev' }, { title: 'Tailwind' },
  { title: 'NextJS' }, { title: 'TypeScript' }, { title: 'NodeJS' }, { title: 'CSS' },
];

const BLUE = "#0066ff";
const BLUE_HOVER = "#0055cc";

function PostTypeFilter({ typeChosen, setTypeChosen, pollOptions, setPollOptions, mediaFiles, setMediaFiles }) {
  const types = ['Text', 'Media', 'Poll'];

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    if (newFiles.length > 0) {
      setMediaFiles((prev) => [...prev, ...newFiles]);
    }
    e.target.value = '';
  };

  const removeMedia = (indexToRemove) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  const mediaPreviews = mediaFiles.map((file) => ({
    url: URL.createObjectURL(file),
    type: file.type.startsWith('video') ? 'video' : 'image',
    name: file.name,
  }));

  React.useEffect(() => {
    return () => mediaPreviews.forEach((p) => URL.revokeObjectURL(p.url));
  }, [mediaFiles]);

  return (
    <>
      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
        {types.map((type) => (
          <Chip
            key={type}
            label={type}
            clickable
            color={typeChosen === type ? 'primary' : 'default'}
            onClick={() => {
              setTypeChosen(type);
              if (type !== 'Media') setMediaFiles([]);
            }}
            sx={{
              fontWeight: 500,
              px: 2,
              py: 1,
              cursor: 'pointer',
              transition: '0.2s',
              backgroundColor: typeChosen === type ? BLUE : '#272729',
              color: '#fff',
              '&:hover': { 
                bgcolor: typeChosen === type ? BLUE_HOVER : '#343536',
                transform: 'scale(1.05)'
              },
            }}
          />
        ))}
      </Box>

      {/* Text Post */}
      {typeChosen === 'Text' && (
        <TextField
          placeholder="Text (optional)"
          variant="outlined"
          multiline
          rows={8}
          inputProps={{ maxLength: 1000 }}
          sx={{
            width: '100%',
            '& .MuiOutlinedInput-root': {
              bgcolor: '#1a1a1b',
              color: '#EDEFF1',
              '& fieldset': { borderColor: '#343536' },
              '&:hover fieldset': { borderColor: '#565656' },
              '&.Mui-focused fieldset': { borderColor: BLUE },
            },
          }}
        />
      )}

      {/* Media Post */}
      {typeChosen === 'Media' && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleFileChange}
            style={{ padding: '10px 0', fontSize: '14px', color: '#EDEFF1' }}
          />

          {mediaPreviews.length > 0 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {mediaPreviews.map((media, index) => (
                <Box key={index} sx={{ position: 'relative', borderRadius: 2, overflow: 'hidden', border: '2px solid #343536' }}>
                  <IconButton
                    onClick={() => removeMedia(index)}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      bgcolor: 'rgba(0,0,0,0.7)',
                      color: 'white',
                      zIndex: 10,
                      '&:hover': { bgcolor: 'rgba(0,0,0,0.9)' },
                    }}
                  >
                    <CloseIcon />
                  </IconButton>

                  {media.type === 'image' ? (
                    <img src={media.url} alt={media.name} style={{ width: '100%', maxHeight: '500px', objectFit: 'contain', display: 'block' }} />
                  ) : (
                    <video src={media.url} controls style={{ width: '100%', maxHeight: '500px', objectFit: 'contain', display: 'block' }} />
                  )}

                  <Typography variant="caption" sx={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    bgcolor: 'rgba(0,0,0,0.8)', color: 'white', textAlign: 'center', py: 0.5, fontSize: '12px'
                  }}>
                    {media.name}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      )}

      {/* Poll Post */}
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
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: '#1a1a1b',
                  color: '#EDEFF1',
                  '& fieldset': { borderColor: '#343536' },
                  '&:hover fieldset': { borderColor: '#565656' },
                  '&.Mui-focused fieldset': { borderColor: BLUE },
                },
              }}
            />
          ))}
          <Chip
            label="Add Option"
            clickable
            onClick={() => setPollOptions([...pollOptions, ''])}
            sx={{
              width: 'fit-content',
              mt: 1,
              bgcolor: BLUE,
              color: '#fff',
              '&:hover': { bgcolor: BLUE_HOVER }
            }}
          />
        </Box>
      )}
    </>
  );
}

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
            sx={{ bgcolor: BLUE, color: '#fff', fontWeight: 600 }}
          />
        ))
      }
      sx={{ width: '100%', mt: 1 }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Tags"
          placeholder={value.length === 0 ? "Add Tags" : ""}
          variant="outlined"
          size="small"
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: '#1a1a1b',
              color: '#EDEFF1',
              '& fieldset': { borderColor: '#343536' },
              '&:hover fieldset': { borderColor: '#565656' },
              '&.Mui-focused fieldset': { borderColor: BLUE },
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
      options={['adhams', 'Movie Lovers', 'ReactJS', 'Memes', 'Funny', 'Bluedit', 'WebDev']}
      sx={{ width: '100%', mb: 2 }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Community"
          placeholder="Select Community"
          variant="outlined"
          size="small"
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: '#1a1a1b',
              color: '#EDEFF1',
              '& fieldset': { borderColor: '#343536' },
              '&:hover fieldset': { borderColor: '#565656' },
              '&.Mui-focused fieldset': { borderColor: BLUE },
            },
          }}
        />
      )}
    />
  );
}

function CreatePost() {
  const [typeChosen, setTypeChosen] = React.useState('Text');
  const [pollOptions, setPollOptions] = React.useState(['', '']);
  const [mediaFiles, setMediaFiles] = React.useState([]);

  return (
    <React.Fragment>
      <CssBaseline />

      {/* FULL DARK BACKGROUND */}
      <Box sx={{ position: 'fixed', inset: 0, bgcolor: '#0A0A0A', zIndex: -1 }} />

      <Box sx={{ display: 'flex', justifyContent: 'center', minHeight: '100vh', py: 4 }}>
        <Box sx={{ width: 740, bgcolor: '#1a1a1b', borderRadius: '12px', border: '1px solid #343536', overflow: 'hidden', boxShadow: 3 }}>
          <Box sx={{ bgcolor: '#030303', padding: '14px 16px', borderBottom: '1px solid #343536' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '18px', color: '#EDEFF1' }}>
              Create a post
            </Typography>
          </Box>

          <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <ComboBox />
            <TextField
              placeholder="Title"
              variant="outlined"
              size="small"
              inputProps={{ maxLength: 300 }}
              sx={{
                width: '100%',
                '& .MuiOutlinedInput-root': {
                  bgcolor: '#1a1a1b',
                  color: '#EDEFF1',
                  '& fieldset': { borderColor: '#343536' },
                  '&:hover fieldset': { borderColor: '#565656' },
                  '&.Mui-focused fieldset': { borderColor: BLUE },
                },
              }}
            />

            <PostTypeFilter
              typeChosen={typeChosen}
              setTypeChosen={setTypeChosen}
              pollOptions={pollOptions}
              setPollOptions={setPollOptions}
              mediaFiles={mediaFiles}
              setMediaFiles={setMediaFiles}
            />

            <FixedTags />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Box
                component="button"
                sx={{
                  bgcolor: BLUE,
                  color: '#fff',
                  border: 'none',
                  borderRadius: '999px',
                  px: 6,
                  py: 1.5,
                  fontWeight: 700,
                  fontSize: '15px',
                  cursor: 'pointer',
                  transition: '0.2s',
                  '&:hover': { bgcolor: BLUE_HOVER, transform: 'scale(1.05)' },
                }}
              >
                Post
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </React.Fragment>
  );
}

export default CreatePost;