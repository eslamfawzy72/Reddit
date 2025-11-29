import PrimarySearchAppBar from "./Components/appbar";
import CommentSection from "./Components/comments";
import NotificationPage from "./Components/notificationpage";
import SidebarLeft from "./Components/LeftSidePanel";

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
      <PrimarySearchAppBar></PrimarySearchAppBar>
      <SidebarLeft></SidebarLeft>
    </>
  );
}

export default App;
