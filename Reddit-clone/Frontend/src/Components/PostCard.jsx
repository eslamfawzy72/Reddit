import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import "../styles/PostCard.css";
import axios from "axios";
import ActionBar from "./ActionBar";
import CommentSection from "../Components/CommentSection";

// Expand animation
const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  marginLeft: "auto",
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function PostCard({
  id,
  user_name,
  user_avatar,
  title,
  description,
  images = [],
  comments = [],
  upvoteCount = 0,
  downvoteCount = 0,
  commentCount = 0,
  date,
  community_name,
  edited = false,
  onVote,
  poll: pollProp,
}) {
  const [expanded, setExpanded] = React.useState(false);
  const [index, setIndex] = React.useState(0);
  const [isHidden, setIsHidden] = React.useState(false);
  const [poll, setPoll] = React.useState(pollProp || { isPoll: false });
  const [loadingOption, setLoadingOption] = React.useState(null);

  const handleExpandClick = () => setExpanded(!expanded);

  const nextImage = () => setIndex((prev) => (prev + 1) % images.length);
  const prevImage = () =>
    setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  if (isHidden) {
    return (
      <div className="hidden-post">
        <Typography fontWeight="bold">Post hidden</Typography>
        <button className="undo-btn" onClick={() => setIsHidden(false)}>
          Undo
        </button>
      </div>
    );
  }

  return (
    <Card
      className="post-card"
      sx={{
        backgroundColor: "#0b0f17",                 // black card
        borderRadius: "20px",                       // rounded
        border: "1px solid rgba(29,155,240,0.15)",  // blue border
        color: "#ffffff",                           // default text color
        overflow: "hidden"
      }}
    >
      {/* AI CHECK BUTTON */}
      <div className="ai-check-button">
        <button>Check for AI</button>
      </div>

      <CardHeader
        sx={{
          "& .MuiCardHeader-title": {
            color: "#ffffff",
            fontWeight: 600,
            fontSize: "15px"
          },
          "& .MuiCardHeader-subheader": {
            color: "#9ca3af",
            fontSize: "13px"
          }
        }}
        avatar={
          <Avatar sx={{ bgcolor: "#1d9bf0" }}>
            <img src={user_avatar} alt="" style={{ width: "100%" }} />
          </Avatar>
        }
        title={user_name}
        subheader={`${community_name} • ${date}${edited ? " • edited" : ""}`}
      />


      {/* TITLE AREA (dedicated) */}
      {title && (
        <CardContent className="post-title-area">
          <Typography className="post-title">{title}</Typography>
        </CardContent>
      )}

      {/* DESCRIPTION */}
      {description && (
        <CardContent>
          <Typography
            className="post-description"
            variant="body1"
          >
            {description}
          </Typography>
        </CardContent>
      )}

      {/* IMAGE SLIDER */}
      {/* IMAGE SLIDER */}
      {images.length > 0 && (
        <div className="image-slider">
          <CardMedia
            component="img"
            image={images[index]}
            className="post-image"
          />

          {images.length > 1 && (
            <>
              <IconButton className="nav-arrow prev-btn" onClick={prevImage}>

                <ArrowBackIosNewIcon sx={{ color: "#fff", fontSize: 22 }} />

              </IconButton>

              <IconButton className="nav-arrow next-btn" onClick={nextImage}>
                <ArrowForwardIosIcon sx={{ color: "#fff", fontSize: 22 }} />


              </IconButton>
            </>
          )}
        </div>
      )}




      {/* ACTION BAR */}
      {/* Poll UI — placed before actions so it lines up with description/title */}
      {poll?.isPoll && (
        <CardContent className="poll-cardcontent">
          <div className="poll-container">
            <div className="poll-question">{poll.question}</div>
            <div className="poll-options">
              {poll.options.map((opt) => (
                <button
                  key={opt._id}
                  className="poll-option-btn"
                  onClick={async () => {
                    if (loadingOption) return;
                    setLoadingOption(opt._id);
                    try {
                      const res = await axios.patch(
                        `${import.meta.env.VITE_API_URL}/posts/${id}`,
                        { action: 'pollVote', optionId: opt._id },
                        { withCredentials: true }
                      );
                      setPoll(res.data.poll || res.data);
                    } catch (err) {
                      console.error('Poll vote failed', err);
                      alert('Failed to register vote');
                    } finally {
                      setLoadingOption(null);
                    }
                  }}
                  disabled={!!loadingOption}
                >
                  <span className="poll-btn-text">{opt.text}</span>
                  <span className="poll-vote-count">{opt.votes || 0}</span>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      )}

      <CardActions disableSpacing>
        <ActionBar
          postId={id}
          upvoteCount={upvoteCount}
          downvoteCount={downvoteCount}
          commentCount={commentCount}
          onHide={() => setIsHidden(true)}
          onVote={onVote}
        />
        <ExpandMore expand={expanded} onClick={handleExpandClick}>
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>

      {/* COMMENTS */}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <CommentSection comments={comments} />
        </CardContent>
      </Collapse>
    </Card>
  );
}
