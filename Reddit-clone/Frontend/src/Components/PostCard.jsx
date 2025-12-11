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
  description,
  images = [],
  comments = [],
  upvoteCount = 0,
  downvoteCount = 0,
  commentCount = 0,
  date,
  community_name,
  edited = false,
}) {
  const [expanded, setExpanded] = React.useState(false);
  const [index, setIndex] = React.useState(0);
  const [isHidden, setIsHidden] = React.useState(false);

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
    <Card className="post-card">
      {/* AI CHECK BUTTON */}
      <div className="ai-check-button">
        <button>Check for AI</button>
      </div>

      {/* HEADER */}
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }}>
            <img src={user_avatar} alt="" style={{ width: "100%" }} />
          </Avatar>
        }
        title={user_name}
        subheader={`${community_name} • ${date}${edited ? " • edited" : ""}`}
      />

      {/* DESCRIPTION */}
      {description && (
        <CardContent>
          <Typography variant="body1">{description}</Typography>
        </CardContent>
      )}

      {/* IMAGE SLIDER */}
      {images.length > 0 && (
        <div className="image-slider">
          <CardMedia component="img" height="300" image={images[index]} />

          <IconButton className="prev-btn" onClick={prevImage}>
            <ArrowBackIosNewIcon />
          </IconButton>

          <IconButton className="next-btn" onClick={nextImage}>
            <ArrowForwardIosIcon />
          </IconButton>
        </div>
      )}

      {/* ACTION BAR */}
      <CardActions disableSpacing>
        <ActionBar
          upvoteCount={upvoteCount}
          downvoteCount={downvoteCount}
          commentCount={commentCount}
          onHide={() => setIsHidden(true)}
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
