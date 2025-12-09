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

  const nextImage = () =>
    setIndex((prev) => (prev + 1) % images.length);

  const prevImage = () =>
    setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  if (isHidden) {
    return (
      <div
        style={{
          height: "120px",
          margin: "10px 0",
          backgroundColor: "#f5f5f5",
          borderRadius: "8px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography fontWeight="bold">Post hidden</Typography>
        <button onClick={() => setIsHidden(false)}>Undo</button>
      </div>
    );
  }

  return (
    <Card
      sx={{
        maxWidth: 600,
        margin: "0 auto",
        marginBottom: 2,
        borderRadius: "10px",
        border: "1px solid #ccc",
        boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
        position: "relative",
      }}
    >
      {/* AI CHECK BUTTON */}
      <div style={{ position: "absolute", top: 10, right: 10 }}>
        <button
          style={{
            backgroundColor: "#1976d2",
            color: "white",
            border: "none",
            padding: "6px 12px",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Check for AI
        </button>
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
        <div style={{ position: "relative" }}>
          <CardMedia
            component="img"
            height="300"
            image={images[index]}
          />

          <IconButton
            onClick={prevImage}
            sx={{
              position: "absolute",
              top: "50%",
              left: 10,
              backgroundColor: "white",
            }}
          >
            <ArrowBackIosNewIcon />
          </IconButton>

          <IconButton
            onClick={nextImage}
            sx={{
              position: "absolute",
              top: "50%",
              right: 10,
              backgroundColor: "white",
            }}
          >
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
