import React from "react";
import { Box, Avatar, Typography, TextField, Paper, InputAdornment } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

const ChatUI = ({ user, onSendMessage }) => {
  return (
    <Box
      sx={{
        width: "100%", // Adjust width for compact design
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#121212",
        color: "#fff",
        minWidth: 0,
        borderLeft: "1px solid #333", // Optional for separation
      }}
    >
      {/* Compact Chat Header */}
      <Box sx={{ m: 1, mt: 3, p: 1.5, borderBottom: "1px solid #333", bgcolor: "#1e1e1e" }}>
        <Typography variant="body1">{user.name}</Typography>
      </Box>

      {/* Chat Messages */}
      <Box sx={{ flexGrow: 1, p: 1.5, overflowY: "auto" }}>
        <Paper
          sx={{
            p: 1.5,
            display: "flex",
            alignItems: "center",
            bgcolor: "#222",
            gap: 1.5,
          }}
        >
          <Avatar sx={{ bgcolor: "#555", width: 32, height: 32, fontSize: 14 }}>N</Avatar>
          <Box>
            <Typography variant="body2" fontWeight="bold">
              Namokar Nagar
            </Typography>
            <Typography variant="caption" color="gray">
              Joined Slack
            </Typography>
          </Box>
        </Paper>
      </Box>

      {/* Compact Message Input */}
      <Box sx={{ p: 1.5, borderTop: "1px solid #333", bgcolor: "#1e1e1e" }} onKeyPress={(e) => {
        if (e.key === 'Enter') {
          onSendMessage(e.target.value);
          e.target.value = '';
        }
      }}>
        <TextField
          fullWidth
          placeholder={`Message ${user.name}`}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              onSendMessage(e.target.value);
              e.target.value = '';
            }
          }}
          variant="outlined"
          size="small"
          sx={{
            bgcolor: "#333",
            input: { color: "#fff", fontSize: 14 },
            fieldset: { borderColor: "#444" },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SendIcon sx={{ color: "#bbb", cursor: "pointer" }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>
    </Box>
  );
};

export default ChatUI;
