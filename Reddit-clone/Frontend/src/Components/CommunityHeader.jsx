import React from "react";
import { Box, Button, Avatar, Typography } from "@mui/material";

export default function CommunityHeader() {
  return (
    <Box
      sx={{
        bgcolor: "#0d0d0d",
        color: "#ffffff",
        width: "80%",
        maxWidth: { xs: "100%", sm: "1000px" },   // Limits width like Reddit
        mx: "auto",                               // Centers it
        borderRadius: 3,
        overflow: "hidden",
        mb: 4,
        boxShadow: 3,
      }}
    >
      {/* Banner Image */}
      <Box
        sx={{
          height: { xs: 140, sm: 200 },
          backgroundImage: 'url("https://images.unsplash.com/photo-1503264116251-35a269479413")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Header Content */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: { xs: 2, sm: 3 },
          bgcolor: "rgba(255,255,255,0.05)",
        }}
      >
        {/* Left: Avatar + Name */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: "#0055aa",
              fontSize: 32,
              fontWeight: "bold",
              border: "4px solid #0d0d0d",
              mt: -6,                       // Pulls avatar up over the banner
            }}
          >
            JH
          </Avatar>

          <Box>
            <Typography variant="h5" fontWeight="bold">
              r/janahasheesh
            </Typography>
            <Typography variant="body2" color="gray">
              42k members • 1.2k online
            </Typography>
          </Box>
        </Box>

        {/* Right: Buttons */}
        <Box sx={{ display: "flex", gap: 1.5 }}>
          <Button
            variant="contained"
            sx={{
              bgcolor: "#0055aa",
              textTransform: "none",
              fontWeight: "bold",
              px: 3,
              "&:hover": { bgcolor: "#0066cc" },
            }}
          >
            Create Post
          </Button>
          <Button
            variant="outlined"
            sx={{
              color: "#fff",
              borderColor: "#0055aa",
              textTransform: "none",
              fontWeight: "bold",
              "&:hover": { borderColor: "#0066cc", bgcolor: "rgba(0,100,200,0.1)" },
            }}
          >
            Join
          </Button>
          <Button
            variant="outlined"
            sx={{
              minWidth: 44,
              width: 44,
              height: 44,
              borderColor: "#0055aa",
              color: "#fff",
              "&:hover": { bgcolor: "rgba(0,100,200,0.1)" },
            }}
          >
            ⋮
          </Button>
        </Box>
      </Box>
    </Box>
  );
}