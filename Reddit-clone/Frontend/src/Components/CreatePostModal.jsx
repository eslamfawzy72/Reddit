import React, { useState, useEffect } from "react";
import {
    TextField,
    Autocomplete,
    Chip,
    Typography,
    IconButton,
    Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import "../styles/createPostModal.css";

const redditTags = [
    { title: "Programming" },
    { title: "Gaming" },
    { title: "Movies" },
    { title: "Music" },
    { title: "Anime" },
    { title: "Technology" },
    { title: "Memes" },
    { title: "Funny" },
    { title: "ReactJS" },
    { title: "JavaScript" },
    { title: "WebDev" },
    { title: "Tailwind" },
    { title: "NextJS" },
    { title: "TypeScript" },
    { title: "NodeJS" },
    { title: "CSS" },
];

function PostTypeFilter({
    typeChosen,
    setTypeChosen,
    pollOptions,
    pollTitle,
    setPollTitle,
    setPollOptions,
    mediaFiles,
    setMediaFiles,
    description,
    setDescription,
}) {
    const types = ["Text", "Media", "Poll"];

    const handleFileChange = (e) => {
        const newFiles = Array.from(e.target.files);
        if (newFiles.length > 0) {
            setMediaFiles((prev) => [...prev, ...newFiles]);
        }
        e.target.value = "";
    };

    const removeMedia = (indexToRemove) => {
        setMediaFiles((prev) => prev.filter((_, i) => i !== indexToRemove));
    };

    const mediaPreviews = mediaFiles.map((file) => ({
        url: URL.createObjectURL(file),
        type: file.type.startsWith("video") ? "video" : "image",
        name: file.name,
    }));

    useEffect(() => {
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
                        color={typeChosen === type ? "primary" : "default"}
                        onClick={() => {
                            setTypeChosen(type);
                        }}
                        className={`type-chip ${typeChosen === type ? "active" : ""}`}
                    />
                ))}
            </Box>

            <TextField
                placeholder="Text (optional)"
                variant="outlined"
                multiline
                rows={typeChosen === "Text" ? 6 : 3}
                inputProps={{ maxLength: 1000 }}
                className="text-post-field"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />

            {typeChosen === "Media" && (
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

                                    {media.type === "image" ? (
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

            {typeChosen === "Poll" && (
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
                        onClick={() => setPollOptions([...pollOptions, ""])}
                        className="add-poll-option"
                    />
                </Box>
            )}
        </>
    );
}

function FixedTags({ value, onChange }) {
    return (
        <Autocomplete
            multiple
            options={redditTags}
            value={value}
            onChange={(event, newValue) => onChange(newValue)}
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
            getOptionLabel={(option) => option?.commName || option?.title || ""}
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

export default function CreatePostModal({ isOpen, onClose, preSelectedCommunity }) {
    const navigate = useNavigate();
    const auth = useAuth();

    const [typeChosen, setTypeChosen] = useState("Text");
    const [pollOptions, setPollOptions] = useState(["", ""]);
    const [pollTitle, setPollTitle] = useState("");
    const [mediaFiles, setMediaFiles] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [community, setCommunity] = useState(preSelectedCommunity || null);
    const [communities, setCommunities] = useState([]);
    const [tags, setTags] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (isOpen) {
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

            const fetchCommunities = async () => {
                try {
                    const res = await axios.get(
                        `${import.meta.env.VITE_API_URL}/users/communities`,
                        { withCredentials: true }
                    );
                    setCommunities(res.data || []);
                } catch (err) {
                    console.error("Failed to load communities", err);
                }
            };

            fetchUser();
            fetchCommunities();

            // Set pre-selected community if provided
            if (preSelectedCommunity) {
                setCommunity(preSelectedCommunity);
            } else {
                setCommunity(null);
            }
        }
    }, [isOpen, preSelectedCommunity]);

    const resetForm = () => {
        setTypeChosen("Text");
        setPollOptions(["", ""]);
        setPollTitle("");
        setMediaFiles([]);
        setTitle("");
        setDescription("");
        setCommunity(preSelectedCommunity || null);
        setError("");
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleSubmit = async () => {
        if (!community) {
            setError("Please select a community");
            return;
        }

        if (!currentUser) {
            setError("You must be logged in to post");
            return;
        }

        if (!title.trim()) {
            setError("Title is required");
            return;
        }

        const fileToDataUrl = (file) =>
            new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });

        try {
            setLoading(true);
            setError("");

            let imgs = [];
            if (mediaFiles && mediaFiles.length > 0) {
                const imageFiles = mediaFiles.filter(
                    (f) => f.type && f.type.startsWith("image")
                );
                imgs = await Promise.all(imageFiles.map((f) => fileToDataUrl(f)));
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
                cat: tags.map((t) => t.title || t),
                description: description,
            };

            if (typeChosen === "Poll") {
                const cleanedOptions = pollOptions
                    .filter((o) => o && o.trim())
                    .map((o) => ({ text: o.trim(), votes: 0 }));
                if (cleanedOptions.length < 2) {
                    setError("Please provide at least two poll options.");
                    return;
                }
                payload.poll = {
                    isPoll: true,
                    question: pollTitle || "Poll",
                    options: cleanedOptions,
                };
            }

            await axios.post(`${import.meta.env.VITE_API_URL}/posts`, payload, {
                withCredentials: true,
            });

            handleClose();
            navigate("/");
        } catch (err) {
            console.error("Create post failed", err);
            setError(
                "Failed to create post: " + (err.response?.data?.message || err.message)
            );
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="post-modal-overlay" onClick={handleClose}>
            <div className="post-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="post-modal-close" onClick={handleClose}>
                    ✕
                </button>

                <h1>Create a post</h1>
                <p className="post-modal-subtitle">Share something with the community</p>

                {error && <div className="post-modal-error">{error}</div>}

                <div className="post-modal-body">
                   {!community && <ComboBox
                        value={community}
                        onChange={setCommunity}
                        options={communities}
                    />
                   }
                    <TextField
                        placeholder="Title"
                        variant="outlined"
                        size="small"
                        inputProps={{ maxLength: 300 }}
                        className="title-field post-modal-input"
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


                    <div className="post-modal-actions">
                        <button
                            className="post-modal-submit"
                            onClick={handleSubmit}
                            disabled={loading || !community}
                        >
                            {loading ? "Posting..." : "Post"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
