import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ActionBar from './ActionBar';

// Expand animation
const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  marginLeft: 'auto',
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function PostCard(props) {
  const { is_poll, options = [], votes: initialVotes = [], poll_question } = props;
  const [expanded, setExpanded] = React.useState(false);
  const [index, setIndex] = React.useState(0);
  const [isHidden, setIsHidden] = React.useState(false);

  // Track votes locally for toggle behavior
  const [votes, setVotes] = React.useState([...initialVotes]);
  const [selectedOption, setSelectedOption] = React.useState(null);

  const handleExpandClick = () => setExpanded(!expanded);

  const nextImage = () =>
    setIndex((prev) => (prev + 1) % (props.images?.length || 0));
  const prevImage = () =>
    setIndex((prev) =>
      prev === 0 ? props.images.length - 1 : prev - 1
    );

  const toggleVote = (i) => {
    const newVotes = [...votes];

    if (selectedOption === i) {
      newVotes[i] -= 1;
      setSelectedOption(null);
    } else {
      if (selectedOption !== null) {
        newVotes[selectedOption] -= 1;
      }
      newVotes[i] += 1;
      setSelectedOption(i);
    }

    setVotes(newVotes);
  };

  if (isHidden) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '120px',
          margin: '10px 0',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          boxShadow: '0px 2px 5px rgba(0,0,0,0.1)',
          gap: '8px',
        }}
      >
        <span style={{ color: '#555', fontWeight: 'bold' }}>
          Post hidden
        </span>
        <button
          onClick={() => setIsHidden(false)}
          style={{
            padding: '8px 20px',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Undo
        </button>
      </div>
    );
  }

  const totalVotes = votes.reduce((a, b) => a + b, 0);

  return (
    <Card
      sx={{
        maxWidth: 1000,
        marginBottom: 2,
        border: '1px solid #ccc',
        borderRadius: '10px',
        boxShadow: '0px 2px 8px rgba(0,0,0,0.1)',
        position: 'relative'

      }}
    >
      <div
  style={{
    position: "absolute",
    top: "10px",
    right: "10px",
    zIndex: 10,
  }}
>
  <button
    style={{
      padding: "6px 12px",
      backgroundColor: "#1976d2",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "bold",
      boxShadow: "0px 2px 5px rgba(0,0,0,0.2)",
    }}
    onClick={() => alert("Running AI check…")}
  >
    Check for AI
  </button>
</div>

      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }}>
            <img src={props.img_src} style={{ width: '100%' }} />
          </Avatar>
        }
        title={props.user_name}
        subheader={props.post_date}
      />

      {/* POLL POST */}
      {is_poll && (
        <CardContent>
          {poll_question && (
            <Typography variant="subtitle1" gutterBottom>
              {poll_question}
            </Typography>
          )}
          {options.map((option, i) => {
            const percent = totalVotes
              ? Math.round((votes[i] / totalVotes) * 100)
              : 0;

            return (
              <div
                key={i}
                style={{
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <div
                  style={{
                    flex: 1,
                    padding: '10px',
                    backgroundColor: '#e0e0e0',
                    borderRadius: '5px',
                    fontWeight: '500',
                  }}
                >
                  {option} ({votes[i]} votes)
                  {totalVotes > 0 && (
                    <div
                      style={{
                        width: '100%',
                        height: '10px',
                        backgroundColor: '#ccc',
                        borderRadius: '5px',
                        marginTop: '4px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
  style={{
    width: `${percent}%`,
    height: '100%',
    backgroundColor: '#1976d2',
    transition: 'width 0.3s',
  }}
></div>

                    </div>
                  )}
                </div>

                <button
                  onClick={() => toggleVote(i)}
                  style={{
                    padding: '6px 12px',
                    backgroundColor:
                      selectedOption === i ? '#1976d2' : '#e0e0e0',
                    color: selectedOption === i ? 'white' : 'black',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                  }}
                >
                  Vote
                </button>
              </div>
            );
          })}
        </CardContent>
      )}

      {/* POST DESCRIPTION */}
      {!is_poll && props.description && (
        <CardContent>
          <Typography variant="body1" gutterBottom>
            {props.description}
          </Typography>
        </CardContent>
      )}

      {/* IMAGE SLIDER */}
      {!is_poll && props.images?.length > 0 && (
        <div style={{ position: 'relative' }}>
          <CardMedia
            component="img"
            height="300"
            image={props.images[index]}
          />

          <IconButton
            onClick={prevImage}
            sx={{ position: 'absolute', top: '50%', left: 10, background: 'white' }}
          >
            <ArrowBackIosNewIcon />
          </IconButton>

          <IconButton
            onClick={nextImage}
            sx={{ position: 'absolute', top: '50%', right: 10, background: 'white' }}
          >
            <ArrowForwardIosIcon />
          </IconButton>

          <div
            style={{
              position: 'absolute',
              bottom: 10,
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              gap: '5px',
            }}
          >
            {props.images.map((_, idx) => (
              <span
                key={idx}
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: idx === index ? '#1976d2' : '#ccc',
                  transition: 'background-color 0.3s',
                }}
              ></span>
            ))}
          </div>
        </div>
      )}

      <CardActions disableSpacing>
        <ActionBar
          num_of_likes={props.num_of_likes}
          num_of_comments={props.num_of_comments}
          onHide={() => setIsHidden(true)}
        />

        <ExpandMore expand={expanded} onClick={handleExpandClick}>
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>

      { (
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography>{props.post_details}</Typography>
          </CardContent>
        </Collapse>
      )}
    </Card>
  );
}