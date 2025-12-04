// import UsersList from "./Components/users"
// import Chats from "./Components/chats"
// import CreatePost from "./Components/createpost"
// import SignUp from "./Full Pages/Signup.jsx"
// import { AppBar } from "@mui/material"
// import CreateCommunity from "./Components/createcommunity"
// import * as React from 'react';
// import { styled, alpha } from '@mui/material/styles';
// import PrimarySearchAppBar from "./Components/PrimarySearchAppBar.jsx";
// import CommentSection from "./Components/CommentSection.jsx";

// import SidebarLeft from "./Components/SidebarLeft.jsx";

// import SidebarRight from "./Components/SidebarRight.jsx";
// import CommunityHeader from "./Components/communityheader.jsx";
// import CommunityCard from "./Components/CommunityCard.jsx";
// import Explore from "./Full Pages/Explore.jsx";
// import CommunityPage from "./Full Pages/CommunityPage.jsx";
import SidebarLeft from "./Components/SidebarLeft.jsx";
import Notifications from"./Full Pages/Notifications.jsx"
import CreateCommunity from"./Full Pages/CreateCommunity.jsx"
import UserMenu from "./Components/UserMenu.jsx";
import PrimarySearchAppBar from "./Components/PrimarySearchAppBar.jsx";
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Chats from "./Full Pages/Chats.jsx";
import Explore from "./Full Pages/Explore.jsx";
import Home from "./Full Pages/Home.jsx";
import CreatePost from "./Full Pages/CreatePost.jsx";
import CommunityPage from "./Full Pages/CommunityPage.jsx";
import UserProfilePage from "./Components/UserProfilePage.jsx"
import UserPage from "./Full Pages/UserPage.jsx";
function App() {
  return (
    <BrowserRouter>
    

      {/* TOP BAR*/}
      {/* <PrimarySearchAppBar loggedin={false} /> */}

      {/*MAIN LAYOUT*/}
      <div style={{ display: "flex" }}>
        
        {/* LEFT SIDEBAR */}
  
        {/* MAIN CONTENT */}
        <div style={{ flex: 1, padding: "20px", marginTop: "20px" }}>
          <Routes>
            <Route path="/StartCommunity" element={<CreateCommunity />} />
            <Route path="/Explore" element={<Explore />} />
            <Route path="/Home" element={<Home />} />
            <Route path="/Notifications" element={<Notifications />} />     
            <Route path="/Chats" element={<Chats />} />
            <Route path="/CreatePost" element={<CreatePost />} />
            <Route path="/Community" element={<CommunityPage />} />
            <Route path="/Profile" element={<UserPage isOwn={false}/>} />
            <Route path="/ProfilePage" element={<UserPage isOwn={true} />} />
          </Routes>
        </div>

      </div>

    </BrowserRouter>
  );
}


export default App;
