import PrimarySearchAppBar from "./Components/appbar.jsx";
import CommentSection from "./Components/comments.jsx";
import NotificationPage from "./Components/notificationpage.jsx";
import SidebarLeft from "./Components/LeftSidePanel.jsx";
import Chats from "./Components/chats.jsx";
import SidebarRight from "./Components/CommunityRightSideBar.jsx";
import CommunityHeader from "./Components/communityheader.jsx";
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
        <CommunityHeader/>
  );
}

export default App;
