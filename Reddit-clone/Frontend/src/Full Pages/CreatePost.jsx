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
  { title: 'ReactJS' }, { title: 'JavaScript' }, /* ... rest of your tags */
];

function PostTypeFilter({ typeChosen, setTypeChosen, pollOptions, setPollOptions, mediaFiles, setMediaFiles }) {
  const types = ['Text', 'Media', 'Poll'];

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    if (newFiles.length > 0) {
      setMediaFiles((prev) => [...prev, ...newFiles]);
    }
    // Reset input so same file can be re-selected
    e.target.value = '';
  };

  const removeMedia = (indexToRemove) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  // Generate preview URLs
  const mediaPreviews = mediaFiles.map((file) => ({
    url: URL.createObjectURL(file),
    type: file.type.startsWith('video') ? 'video' : 'image',
    name: file.name,
  }));

  // Cleanup object URLs
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
              if (type !== 'Media') setMediaFiles([]); // clear media when switching
            }}
            sx={{
              fontWeight: 500,
              px: 2,
              py: 1,
              cursor: 'pointer',
              transition: '0.2s',
              '&:hover': { transform: 'scale(1.05)' },
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
          sx={{ width: '100%' }}
        />
      )}

      {/* Media Post - Instant Preview */}
      {typeChosen === 'Media' && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleFileChange}
            style={{ padding: '10px 0', fontSize: '14px' }}
          />

          {/* Instant Preview Area */}
          {mediaPreviews.length > 0 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {mediaPreviews.map((media, index) => (
                <Box
                  key={index}
                  sx={{
                    position: 'relative',
                    borderRadius: 2,
                    overflow: 'hidden',
                    border: '2px solid #eee',
                    bgcolor: '#000',
                  }}
                >
                  {/* Close Button */}
                  <IconButton
                    onClick={() => removeMedia(index)}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      bgcolor: 'rgba(0,0,0,0.6)',
                      color: 'white',
                      zIndex: 10,
                      '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' },
                    }}
                  >
                    <CloseIcon />
                  </IconButton>

                  {/* Image or Video */}
                  {media.type === 'image' ? (
                    <img
                      src={media.url}
                      alt={media.name}
                      style={{
                        width: '100%',
                        maxHeight: '500px',
                        objectFit: 'contain',
                        display: 'block',
                      }}
                    />
                  ) : (
                    <video
                      src={media.url}
                      controls
                      style={{
                        width: '100%',
                        maxHeight: '500px',
                        objectFit: 'contain',
                        display: 'block',
                      }}
                    />
                  )}

                  {/* File name at bottom */}
                  <Typography
                    variant="caption"
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      bgcolor: 'rgba(0,0,0,0.7)',
                      color: 'white',
                      textAlign: 'center',
                      py: 0.5,
                      fontSize: '12px',
                    }}
                  >
                    {media.name}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}

          {mediaFiles.length > 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {mediaFiles.length} file(s) attached — click × to remove
            </Typography>
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
            />
          ))}
          <Chip
            label="Add Option"
            clickable
            color="secondary"
            onClick={() => setPollOptions([...pollOptions, ''])}
            sx={{ width: 'fit-content', mt: 1 }}
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
            sx={{ backgroundColor: '#ffe082', color: '#5d4037', fontWeight: 500 }}
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
        />
      )}
    />
  );
}

function ComboBox() {
  return (
    <Autocomplete
      disablePortal
      options={['adhams', 'Movie Lovers', 'ReactJS', 'Memes', 'Funny']}
      sx={{ width: '100%', mb: 2 }}
      renderInput={(params) => (
        <TextField {...params} label="Community" placeholder="Select Community" variant="outlined" size="small" />
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
      <Box sx={{ display: 'flex', justifyContent: 'center', minHeight: '100vh', bgcolor: '#DAE0E6', py: 4 }}>
        <Box sx={{ width: 740, bgcolor: '#ffffff', borderRadius: '4px', border: '1px solid #EDEFF1', overflow: 'hidden' }}>
          <Box sx={{ bgcolor: '#FFFFFF', padding: '14px 16px', borderBottom: '1px solid #EDEFF1' }}>
            <Typography variant="h6" sx={{ fontWeight: 500, fontSize: '18px' }}>
              Create a post
            </Typography>
          </Box>

          <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <ComboBox />
            <TextField placeholder="Title" variant="outlined" size="small" inputProps={{ maxLength: 300 }} sx={{ width: '100%' }} />

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
                  bgcolor: '#0079D3',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '999px',
                  px: 5,
                  py: 1.2,
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: '#0061a8' },
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