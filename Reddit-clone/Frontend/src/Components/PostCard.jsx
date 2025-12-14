import React, { useState } from "react";
import { Card, CardHeader, CardMedia, CardContent, CardActions, Collapse, Avatar, IconButton, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { styled } from "@mui/material/styles";

import ActionBar from "./ActionBar";
import CommentSection from "./CommentSection";
import "../styles/PostCard.css";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  marginLeft: "auto",
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  transition: theme.transitions.create("transform", { duration: theme.transitions.duration.shortest }),
}));

export default function PostCard({ id, user_name, user_avatar, description, images = [], comments = [], upvoteCount = 0, downvoteCount = 0, commentCount = 0, date, community_name, edited = false, onVote, currentUser }) {
  const [expanded, setExpanded] = useState(false);
  const [index, setIndex] = useState(0);
  const [isHidden, setIsHidden] = useState(false);

  const handleExpandClick = () => setExpanded(!expanded);
  const nextImage = () => setIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  if (isHidden) {
    return (
      <div className="hidden-post">
        <Typography fontWeight="bold">Post hidden</Typography>
        <button className="undo-btn" onClick={() => setIsHidden(false)}>Undo</button>
      </div>
    );
  }

  return (
    <Card className="post-card" sx={{ backgroundColor: "#0b0f17", borderRadius: "20px", border: "1px solid rgba(29,155,240,0.15)", color: "#fff", overflow: "hidden" }}>
      <CardHeader
        avatar={<Avatar sx={{ bgcolor: "#1d9bf0" }}><img src={user_avatar} alt="" style={{ width: "100%" }} /></Avatar>}
        title={user_name}
        subheader={`${community_name} • ${date}${edited ? " • edited" : ""}`}
        sx={{ "& .MuiCardHeader-title": { color: "#fff", fontWeight: 600, fontSize: "15px" }, "& .MuiCardHeader-subheader": { color: "#9ca3af", fontSize: "13px" } }}
      />

      {description && (
        <CardContent>
          <Typography variant="body1" sx={{ color: "#fff", lineHeight: 1.6 }}>{description}</Typography>
        </CardContent>
      )}

      {images.length > 0 && (
        <div className="image-slider">
          <CardMedia component="img" image={images[index]} className="post-image" />
          {images.length > 1 && (
            <>
              <IconButton className="nav-arrow prev-btn" onClick={prevImage}><ArrowBackIosNewIcon sx={{ color: "#fff", fontSize: 22 }} /></IconButton>
              <IconButton className="nav-arrow next-btn" onClick={nextImage}><ArrowForwardIosIcon sx={{ color: "#fff", fontSize: 22 }} /></IconButton>
            </>
          )}
        </div>
      )}

      <CardActions disableSpacing>
        <ActionBar
          postId={id}
          upvoteCount={upvoteCount}
          downvoteCount={downvoteCount}
          commentCount={commentCount}
          onHide={() => setIsHidden(true)}
          onVote={(voteData) => onVote(id, voteData)}
          currentUser={currentUser}
        />
        <ExpandMore expand={expanded} onClick={handleExpandClick}><ExpandMoreIcon /></ExpandMore>
      </CardActions>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <CommentSection comments={comments} />
        </CardContent>
      </Collapse>
    </Card>
  );
}
