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

import "../styles/createPost.css";

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
      <Box className="post-type-chips">
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
            className={`type-chip ${typeChosen === type ? 'active' : ''}`}
          />
        ))}
      </Box>

      {typeChosen === 'Text' && (
        <TextField
          placeholder="Text (optional)"
          variant="outlined"
          multiline
          rows={8}
          inputProps={{ maxLength: 1000 }}
          className="text-post-field"
        />
      )}

      {typeChosen === 'Media' && (
        <Box className="media-post-container">
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleFileChange}
            className="media-input"
          />

          {mediaPreviews.length > 0 && (
            <Box className="media-preview-list">
              {mediaPreviews.map((media, index) => (
                <Box key={index} className="media-preview-card">
                  <IconButton
                    onClick={() => removeMedia(index)}
                    className="media-remove-btn"
                  >
                    <CloseIcon />
                  </IconButton>

                  {media.type === 'image' ? (
                    <img src={media.url} alt={media.name} className="media-img" />
                  ) : (
                    <video src={media.url} controls className="media-img" />
                  )}

                  <Typography className="media-caption">{media.name}</Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      )}

      {typeChosen === 'Poll' && (
        <Box className="poll-options-container">
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
              className="poll-option-field"
            />
          ))}
          <Chip
            label="Add Option"
            clickable
            onClick={() => setPollOptions([...pollOptions, ''])}
            className="add-poll-option"
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
            className="tag-chip"
          />
        ))
      }
      className="tags-autocomplete"
      renderInput={(params) => (
        <TextField
          {...params}
          label="Tags"
          placeholder={value.length === 0 ? "Add Tags" : ""}
          variant="outlined"
          size="small"
          className="tags-field"
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
      className="community-autocomplete"
      renderInput={(params) => (
        <TextField
          {...params}
          label="Community"
          placeholder="Select Community"
          variant="outlined"
          size="small"
          className="community-field"
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
      <Box className="full-background" />
      <Box className="create-post-wrapper">
        <Box className="create-post-container">
          <Box className="create-post-header">
            <Typography className="create-post-title">
              Create a post
            </Typography>
          </Box>

          <Box className="create-post-body">
            <ComboBox />
            <TextField placeholder="Title" variant="outlined" size="small" inputProps={{ maxLength: 300 }} className="title-field" />

            <PostTypeFilter
              typeChosen={typeChosen}
              setTypeChosen={setTypeChosen}
              pollOptions={pollOptions}
              setPollOptions={setPollOptions}
              mediaFiles={mediaFiles}
              setMediaFiles={setMediaFiles}
            />

            <FixedTags />

            <Box className="post-button-container">
              <Box component="button" className="post-button">
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
