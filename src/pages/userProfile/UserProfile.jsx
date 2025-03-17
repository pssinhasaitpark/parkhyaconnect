import React from "react";
import { Card, CardContent, Avatar, Typography, Button, Divider, Link } from "@mui/material";
import { Email, AccessTime } from "@mui/icons-material";

const UserProfilePage = () => {
  return (
    <Card sx={{ maxWidth: 400, bgcolor: "#1a1d21", color: "white", p: 2, borderRadius: 2 }}>
      <CardContent>
        <Avatar sx={{ width: 56, height: 56, bgcolor: "gray", mb: 2 }} />
        <Typography variant="h6">Gokul chandel</Typography>
        <Button variant="outlined" size="small" sx={{ m: 1, color: "white", borderColor: "gray" }}>Mute</Button>
        <Button variant="outlined" size="small" sx={{ m: 1, color: "white", borderColor: "gray" }}>Hide</Button>
        <Button variant="outlined" size="small" sx={{ m: 1, color: "white", borderColor: "gray" }}>Huddle</Button>
        
        <Divider sx={{ my: 2, bgcolor: "gray" }} />
        <Typography variant="subtitle2">Topic</Typography>
        <Typography variant="body2" color="gray">Add a topic</Typography>
        
        <Divider sx={{ my: 2, bgcolor: "gray" }} />
        <Typography variant="body2" display="flex" alignItems="center">
          <AccessTime fontSize="small" sx={{ mr: 1 }} /> 1:00 PM local time
        </Typography>
        <Typography variant="body2" display="flex" alignItems="center" sx={{ mt: 1 }}>
          <Email fontSize="small" sx={{ mr: 1 }} />
          <Link href="mailto:gokul.chandel@parkhya.net" color="#4fc3f7">gokul.chandel@parkhya.net</Link>
        </Typography>
        <Typography variant="body2" color="#4fc3f7" sx={{ mt: 1, cursor: "pointer" }}>View full profile</Typography>
        
        <Divider sx={{ my: 2, bgcolor: "gray" }} />
        <Typography variant="subtitle2">Add people to this conversation</Typography>
        
        <Divider sx={{ my: 2, bgcolor: "gray" }} />
        <Typography variant="subtitle2">Files</Typography>
        <Typography variant="body2" color="gray">
          There aren’t any files to see here right now. But there could be – drag and drop any file into the message pane to add it to this conversation.
        </Typography>
        
        <Divider sx={{ my: 2, bgcolor: "gray" }} />
        <Typography variant="body2" color="gray">Channel ID: D08JMAZ5T4Y</Typography>
      </CardContent>
    </Card>
  );
};

export default UserProfilePage;
