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
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { useLocation } from "react-router-dom";


import "../styles/createPost.css";

const redditTags = [
  { title: 'Programming' }, { title: 'Gaming' }, { title: 'Movies' }, { title: 'Music' },
  { title: 'Anime' }, { title: 'Technology' }, { title: 'Memes' }, { title: 'Funny' },
  { title: 'ReactJS' }, { title: 'JavaScript' }, { title: 'WebDev' }, { title: 'Tailwind' },
  { title: 'NextJS' }, { title: 'TypeScript' }, { title: 'NodeJS' }, { title: 'CSS' },
];

function PostTypeFilter({ typeChosen, setTypeChosen, pollOptions,  pollTitle, setPollTitle,setPollOptions, mediaFiles, setMediaFiles, description, setDescription }) {
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
            }}
            className={`type-chip ${typeChosen === type ? 'active' : ''}`}
          />
        ))}
      </Box>

      {/* Always show description so users can add text together with media or polls. */}
      <TextField
        placeholder="Text (optional)"
        variant="outlined"
        multiline
        rows={typeChosen === 'Text' ? 8 : 4}
        inputProps={{ maxLength: 1000 }}
        className="text-post-field"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

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
          <TextField
  placeholder="Poll question"
  variant="outlined"
  value={pollTitle}
  onChange={(e) => setPollTitle(e.target.value)}
  className="poll-question-field"
  inputProps={{ maxLength: 200 }}
/>

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

function ComboBox({ value, onChange, options = [] }) {
  return (
    <Autocomplete
      disablePortal
      options={options}
      getOptionLabel={(option) => option?.commName || option?.title || ''}
      className="community-autocomplete"
      value={value}
      onChange={(e, v) => onChange(v)}
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
    const location = useLocation();
  const communityFromProps = location.state?.community || null;
  const [typeChosen, setTypeChosen] = React.useState('Text');
  const [pollOptions, setPollOptions] = React.useState(['', '']);
  const [pollTitle, setPollTitle] = React.useState('');
  const [mediaFiles, setMediaFiles] = React.useState([]);
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
const [community, setCommunity] = React.useState(communityFromProps);
  const [communities, setCommunities] = React.useState([]);
  const [tags, setTags] = React.useState([]);
  const [currentUser, setCurrentUser] = React.useState(null);
  const navigate = useNavigate();
  const auth = useAuth();
React.useEffect(() => {
  if (communityFromProps) {
    setCommunity(communityFromProps);
  }
}, [communityFromProps]);

React.useEffect(() => {
  const fetchUser = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/auth/me`,
        { withCredentials: true }
      );
      setCurrentUser(res.data.user);
    } catch (err) {
      setCurrentUser(null);
    }
  };

  fetchUser();

  if (!communityFromProps) {
    (async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/users/communities`,
          { withCredentials: true }
        );
        setCommunities(res.data || []);
      } catch (err) {
        console.error("Failed to load communities", err);
      }
    })();
  }
}, [communityFromProps]);


  const handleSubmit = async () => {
     if (!community) {
    alert("Please select a community");
    return;
  }

    if (!currentUser) {
      alert('You must be logged in to post');
      navigate('/Login');
      return;
    }

    // Keep title and description separate; send description only

    // convert selected media files to data URLs so backend can store them in `images`
    const fileToDataUrl = (file) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    let imgs = [];
    if (mediaFiles && mediaFiles.length > 0) {
      try {
        // only include images (not videos) for now
        const imageFiles = mediaFiles.filter(f => f.type && f.type.startsWith('image'));
        imgs = await Promise.all(imageFiles.map(f => fileToDataUrl(f)));
      } catch (err) {
        console.error('Failed to convert media files', err);
      }
    }

    const payload = {
      userId: currentUser._id,
      title: title,
      images: imgs,
      upvotedCount: 0,
      downvotedCount: 0,
      commentCount: 0,
      date: new Date(),
      cmnts: [],
      commID: community._id,
      cat: tags.map(t => t.title || t),
      description: description,
    };

    if (typeChosen === 'Poll') {
      const cleanedOptions = pollOptions.filter(o => o && o.trim()).map(o => ({ text: o.trim(), votes: 0 }));
      if (cleanedOptions.length < 2) return alert('Please provide at least two poll options.');
      payload.poll = {
        isPoll: true,
        question:  pollTitle || 'Poll',
        options: cleanedOptions,
      };
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/posts`, payload, { withCredentials: true });
      // Success → go back to home
      navigate('/');
    } catch (err) {
      console.error('Create post failed', err);
      alert('Failed to create post: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <Box className="full-background" />
      <Box className="create-post-wrapper">
        <Box className="create-post-container">
          <Box className="create-post-header">
            <Typography className="create-post-title">Create a post</Typography>
          </Box>

          <Box className="create-post-body">
            {!communityFromProps ? (
  <ComboBox
    value={community}
    onChange={setCommunity}
    options={communities}
  />
) : (
  <TextField
    label="Community"
    value={communityFromProps.commName}
    disabled
    size="small"
    className="community-field"
  />
)}

            
            <TextField
              placeholder="Title"
              variant="outlined"
              size="small"
              inputProps={{ maxLength: 300 }}
              className="title-field"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <PostTypeFilter
              typeChosen={typeChosen}
              setTypeChosen={setTypeChosen}
              pollOptions={pollOptions}
             setPollTitle={setPollTitle}
               pollTitle={pollTitle}  
              setPollOptions={setPollOptions}
              mediaFiles={mediaFiles}
              setMediaFiles={setMediaFiles}
              description={description}
              setDescription={setDescription}
            />

            <FixedTags />

            <Box className="post-button-container">
              <Box component="button" onClick={handleSubmit} className="post-button">Post</Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </React.Fragment>
  );
}

export default CreatePost;
