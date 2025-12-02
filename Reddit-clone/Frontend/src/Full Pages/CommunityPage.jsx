import React from "react";
import { Box } from "@mui/material";
import PrimarySearchAppBar from "../Components/PrimarySearchAppBar.jsx";
import SidebarRight from "../Components/SidebarRight.jsx";
import CommunityHeader from "../Components/communityheader.jsx";
import SidebarLeft from "../Components/SidebarLeft.jsx";

function CommunityPage() {
  return (
    <Box sx={{ backgroundColor: "#0A0A0A", minHeight: "100vh" }}>
      {/* Fixed top navbar */}
      <Box sx={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000 }}>
        <PrimarySearchAppBar />
      </Box>

      {/* Fixed left sidebar */}
      <Box sx={{ position: "fixed", top: 64, left: 0, bottom: 0, zIndex: 100 }}>
        <SidebarLeft />
      </Box>

      {/* Main content area - pushed right to account for sidebar */}
      <Box 
        sx={{ 
          marginLeft: { xs: 0, sm: "260px" }, // Match sidebar width
          paddingTop: "64px", // Account for fixed navbar
        }}
      >
        {/* Community Header - full width */}
        <CommunityHeader />

        {/* Content area with right sidebar */}
        <Box 
          sx={{ 
            display: "flex", 
            gap: 3, 
            padding: "20px",
            maxWidth: "1600px",
            margin: "0 auto",
          }}
        >
          {/* Main content area (left side) - Posts will go here */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {/* Your main content goes here (posts, etc.) */}
            <Box sx={{ color: "#fff", fontSize: "14px" }}>
              Posts will appear here
            </Box>
          </Box>

          {/* Right sidebar - sticky */}
          <Box 
            sx={{ 
              width: "320px", 
              flexShrink: 0,
              position: "sticky",
              top: "84px", // Navbar height + some padding
              alignSelf: "flex-start",
              maxHeight: "calc(100vh - 100px)",
              overflowY: "auto",
            }}
          >
            <SidebarRight />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default CommunityPage;