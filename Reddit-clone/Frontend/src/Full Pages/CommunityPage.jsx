import React from "react";
import { Box } from "@mui/material";
import PrimarySearchAppBar from "../Components/PrimarySearchAppBar.jsx";
import SidebarLeft from "../Components/SidebarLeft.jsx";
import SidebarRight from "../Components/SidebarRight.jsx";
import CommunityHeader from "../Components/communityheader.jsx";

function CommunityPage() {
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
        <CommunityHeader />

        {/* Feed + Right Sidebar */}
        <Box
          sx={{
            display: "flex",
            gap: 3,
            maxWidth: "1600px",
            mx: "auto",
            px: { xs: 2, sm: 3 },
            pt: 2,
            pb: 10,
          }}
        >
          {/* Main Posts Area */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {/* Your posts go here */}
            {Array.from({ length: 20 }, (_, i) => (
              <Box
                key={i}
                sx={{
                  bgcolor: "white",
                  borderRadius: 2,
                  p: 3,
                  mb: 3,
                  boxShadow: 1,
                  color: "#1a1a1b",
                }}
              >
                <Box sx={{ fontWeight: "bold", fontSize: 18, mb: 1 }}>
                  Post Title {i + 1}
                </Box>
                <Box>This is a sample post in the community.</Box>
              </Box>
            ))}
          </Box>

          {/* Sticky Right Sidebar — scrolls with content but stays visible */}
          <Box
            sx={{
              width: "320px",
              flexShrink: 0,
              position: "sticky",
              top: 80,                    // Sticks just below navbar
              alignSelf: "flex-start",
            }}
          >
            <SidebarRight />
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default CommunityPage;