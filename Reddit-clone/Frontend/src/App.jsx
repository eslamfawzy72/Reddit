import PrimarySearchAppBar from "./Components/appbar";
import CommentSection from "./comments";

const sampleComments = [
  {
    id: 1,
    username: 'jane_doe',
    avatar: 'JD',
    timestamp: '3 hours ago',
    text: 'Top-level comment',
    votes: 1520,
    isOP: true,
    isMod: false,
    awards: ['Gold'],
    replies: [],
    createdAt: Date.now() - 10800000
  }
];

function App() {
  return (
    <>
      <CommentSection initialComments={sampleComments} />
    </>
  );
}

export default App;
