import React from "react";
import { Modal, Paper, Typography, Button, IconButton, Divider } from "@mui/material";
import { Close } from "@mui/icons-material";

const SlackProPopup = ({ open, handleClose }) => {
  return (
    <Modal open={open} onClose={handleClose} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Paper sx={{ width: 500, bgcolor: "#282c34", color: "white", p: 3, borderRadius: 2, position: "relative" }}>
        {/* Close Button */}
        <IconButton sx={{ position: "absolute", top: 10, right: 10, color: "white" }} onClick={handleClose}>
          <Close />
        </IconButton>

        {/* Header */}
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          ⭐ Unlock More with PS-Slack Pro!
        </Typography>
        <Typography variant="body2" color="gray" gutterBottom>
          Get access to exclusive features that help your team collaborate better. Try PS-Slack Pro...
        </Typography>

        <Divider sx={{ my: 2, bgcolor: "gray" }} />

        {/* Features List */}
        <Typography variant="body1" fontWeight="bold" sx={{ mt: 1 }}>
          🔥 Exclusive Benefits:
        </Typography>
        <Typography variant="body2" color="gray">✔ Unlimited access to past messages</Typography>
        <Typography variant="body2" color="gray">✔ Enhanced security & admin controls</Typography>
        <Typography variant="body2" color="gray">✔ Advanced integrations & automation</Typography>
        <Typography variant="body2" color="gray">✔ Priority support & premium tools</Typography>

        <Divider sx={{ my: 2, bgcolor: "gray" }} />

        {/* CTA Button */}
        <Button variant="contained" sx={{ mt: 1, backgroundColor: "#4caf50" }} fullWidth>
          Upgrade to PS-Slack Pro
        </Button>
      </Paper>
    </Modal>
  );
};

export default SlackProPopup;
