import React, { useEffect, useState } from "react";
import { Modal, Box, Button, Checkbox, List, ListItem, ListItemText, ListItemAvatar, Avatar } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 420,
  bgcolor: "#0b0f17",
  border: "1px solid rgba(255,255,255,0.06)",
  boxShadow: 24,
  p: 2,
  color: "#e5e7eb",
  borderRadius: 2,
};

export default function ShareModal({ open, onClose, postId }) {
  const API = import.meta.env.VITE_API_URL;
  const [followers, setFollowers] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [fetchingFollowers, setFetchingFollowers] = useState(false);
  const [authRequired, setAuthRequired] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    const fetchFollowers = async () => {
      setFetchingFollowers(true);
      try {
        const res = await axios.get(`${API}/users/followers`, { withCredentials: true });
        setFollowers(res.data.followers || []);
        setAuthRequired(false);
      } catch (err) {
        console.error("Failed to load followers", err);
        if (err.response && err.response.status === 401) {
          // not authenticated
          setAuthRequired(true);
          setFollowers([]);
        } else {
          setFollowers([]);
        }
      } finally {
        setFetchingFollowers(false);
      }
    };
    fetchFollowers();
  }, [open]);

  const toggle = (id) => {
    setSelected((prev) => {
      const s = new Set(prev);
      if (s.has(id)) s.delete(id);
      else s.add(id);
      return s;
    });
  };

  const handleShare = async () => {
    if (selected.size === 0) {
      alert("Select at least one follower to share with");
      return;
    }
    setLoading(true);
    try {
      const recipients = Array.from(selected);
      const res = await axios.post(`${API}/notifications/share`, { postId, recipients }, { withCredentials: true });
      onClose();
    } catch (err) {
      console.error("Share failed", err);
      alert(err.response?.data?.message || "Share failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <h3>Share post</h3>
        <p style={{ color: "#9ca3af" }}>Select followers to share this post with</p>
        <div style={{ maxHeight: 260, overflowY: "auto", marginTop: 8 }}>
          {authRequired ? (
            <div style={{ color: "#9ca3af", display: "flex", gap: 8, alignItems: "center" }}>
              <div>You must be logged in to see followers.</div>
              <Button variant="outlined" onClick={() => navigate('/Login')}>Log in</Button>
            </div>
          ) : fetchingFollowers ? (
            <div style={{ color: "#9ca3af" }}>Loading followers...</div>
          ) : (
            <List>
              {followers.length === 0 && (
                <div style={{ color: "#9ca3af" }}>No followers to share with</div>
              )}
              {followers.map((f) => (
                <ListItem key={f._id} button onClick={() => toggle(f._id)}>
                  <ListItemAvatar>
                    <Avatar src={f.image}>{f.userName?.charAt(0)}</Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={`u/${f.userName}`} />
                  <Checkbox edge="end" checked={selected.has(f._id)} />
                </ListItem>
              ))}
            </List>
          )}
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 12 }}>
          <Button variant="outlined" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button variant="contained" onClick={handleShare} disabled={loading}>
            {loading ? "Sharing..." : "Share"}
          </Button>
        </div>
      </Box>
    </Modal>
  );
}
