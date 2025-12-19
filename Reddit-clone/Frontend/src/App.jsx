// import UsersList from "./Components/users"
// import Chats from "./Components/chats"
// import CreatePost from "./Components/createpost"
// import SignUp from "./Full Pages/Signup.jsx"
// import { AppBar } from "@mui/material"
// import CreateCommunity from "./Components/createcommunity"
// import * as React from 'react';
// import { styled, alpha } from '@mui/material/styles';
// import PrimarySearchAppBar from "./Components/PrimarySearchAppBar.jsx";
import CommentSection from "./Components/CommentSection.jsx";
import React, { useState } from "react";
// import SidebarLeft from "./Components/SidebarLeft.jsx";

// import SidebarRight from "./Components/SidebarRight.jsx";
// import CommunityHeader from "./Components/communityheader.jsx";
// import CommunityCard from "./Components/CommunityCard.jsx";
// import Explore from "./Full Pages/Explore.jsx";
// import CommunityPage from "./Full Pages/CommunityPage.jsx";
// import "App.css";
import SidebarLeft from "./Components/SidebarLeft.jsx";
import Notifications from "./Full Pages/Notifications.jsx";
import CreateCommunity from "./Full Pages/CreateCommunity.jsx";
import CreateCommunityModal from "./Components/CreateCommunityModal.jsx";
import CreatePostModal from "./Components/CreatePostModal.jsx";
import UserMenu from "./Components/UserMenu.jsx";
import PrimarySearchAppBar from "./Components/PrimarySearchAppBar.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Chats from "./Full Pages/Chats.jsx";
import Explore from "./Full Pages/Explore.jsx";
import Home from "./Full Pages/Home.jsx";
import CommunityPage from "./Full Pages/CommunityPage.jsx";
import UserPage from "./Full Pages/UserPage.jsx";
import BlueditAbout from "./Full Pages/BlueditAbout.jsx";
import SignUp from "./Full Pages/Signup.jsx";
import Popular from "./Full Pages/Popular.jsx";
import Login from "./Full Pages/Login.jsx";
import { useAuth } from "./Context/AuthContext";

function App() {
  const { authVersion } = useAuth(); 
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [preSelectedCommunity, setPreSelectedCommunity] = useState(null);

  const openCreatePostModal = (community = null) => {
    setPreSelectedCommunity(community);
    setShowCreatePostModal(true);
  };

  const closeCreatePostModal = () => {
    setShowCreatePostModal(false);
    setPreSelectedCommunity(null);
  };

  return (
    <BrowserRouter>
      <div >
        <div >
          <CreateCommunityModal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
          />

          <CreatePostModal
            isOpen={showCreatePostModal}
            onClose={closeCreatePostModal}
            preSelectedCommunity={preSelectedCommunity}
          />

          <Routes>
            {/* Add key={authVersion} to force remount on logout */}
            <Route path="/" element={<Home key={authVersion} onOpenCreateCommunity={() => setShowCreateModal(true)} onOpenCreatePost={openCreatePostModal} />} />
            <Route path="/Home" element={<Home key={authVersion} onOpenCreateCommunity={() => setShowCreateModal(true)} onOpenCreatePost={openCreatePostModal} />} />
            <Route path="/Popular" element={<Popular key={authVersion} onOpenCreateCommunity={() => setShowCreateModal(true)} onOpenCreatePost={openCreatePostModal} />} />
            <Route path="/StartCommunity" element={<CreateCommunity />} />
            <Route path="/Explore" element={<Explore onOpenCreateCommunity={() => setShowCreateModal(true)} onOpenCreatePost={openCreatePostModal} />} />
            <Route path="/Notifications" element={<Notifications onOpenCreateCommunity={() => setShowCreateModal(true)} onOpenCreatePost={openCreatePostModal} />} />
            <Route path="/Chats" element={<Chats />} />
            <Route path="/community/:communityID" element={<CommunityPage onOpenCreateCommunity={() => setShowCreateModal(true)} onOpenCreatePost={openCreatePostModal} />} />
            <Route path="/Community" element={<CommunityPage onOpenCreateCommunity={() => setShowCreateModal(true)} onOpenCreatePost={openCreatePostModal} />} />
            <Route path="/Profile/:username" element={<UserPage isOwn={false} />} />
            <Route path="/ProfilePage" element={<UserPage isOwn={true} />} />
            <Route path="/About" element={<BlueditAbout />} />
            <Route path="/Signup" element={<SignUp />} />
            <Route path="/Login" element={<Login />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
