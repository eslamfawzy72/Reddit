import React from "react";
import { Box } from "@mui/material";
import PrimarySearchAppBar from "../Components/PrimarySearchAppBar.jsx";
import SidebarLeft from "../Components/SidebarLeft.jsx";
import SidebarRight from "../Components/SidebarRight.jsx";
import CommunityHeader from "../Components/communityheader.jsx";
import UserProfilePage from "../Components/UserProfilePage.jsx";
function UserPage(props) {
  return (
    <>
      {/* Full light background — removes black gaps */}
      <Box sx={{ position: "fixed", inset: 0, bgcolor: "#f5f5f5", zIndex: -1 }} />

      {/* Fixed Top Navbar */}
      <Box sx={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1300 }}>
        <PrimarySearchAppBar />
      </Box>

      {/* Fixed Left Sidebar — NEVER SCROLLS */}
      <Box
        sx={{
          position: "fixed",
          top: 64,
          left: 0,
          width: { xs: 0, sm: 280 },
          height: "calc(100vh - 64px)",
          bgcolor: "white",
          borderRight: "1px solid #edeff1",
          zIndex: 1200,
          overflow: "hidden",        // ← THIS IS KEY: no scroll
        }}
      >
        <SidebarLeft />
      </Box>

      {/* MAIN FIXED + VERTICALLY SCROLLABLE AREA */}
      <Box
        sx={{
          position: "fixed",
          top: 64,
          left: { xs: 0, sm: 260 },
          right: 0,
          bottom: 0,
          overflowY: "auto",     // ← Only vertical scroll
          overflowX: "hidden",   // ← No horizontal scroll
          bgcolor: "#f5f5f5",
        }}
      >
        {/* Community Header */}
        <UserProfilePage isOwn={props.isOwn} />

        {/* Feed + Right Sidebar */}
       
      </Box>
    </>
  );
}

export default UserPage;