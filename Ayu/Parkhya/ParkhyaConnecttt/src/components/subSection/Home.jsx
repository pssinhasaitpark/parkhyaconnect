import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../redux/authSlice"; // Assuming you have a fetchUsers action
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  Button,
} from "@mui/material";
import { ExpandLess, ExpandMore, Add } from "@mui/icons-material";
// import { useNavigate } from "react-router-dom";

const Home = ({ onUserSelect }) => {
  const [channelsOpen, setChannelsOpen] = useState(true);
  const [dmsOpen, setDmsOpen] = useState(true);
  // const [selectUser, setSelectUser] = useState(null);
  const [openAddChannel, setOpenAddChannel] = useState(false);
  const [channelData, setChannelData] = useState({
    name: "",
    description: "",
    isPrivate: false,
  });

  // const navigate = useNavigate();

  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const channels = [
    "team-alpha",
    "marketing-updates",
    "design-feedback",
    "dev-discussions",
    "product-ideas",
  ];

  const handleOpenAddChannel = () => setOpenAddChannel(true);
  const handleCloseAddChannel = () => setOpenAddChannel(false);

  const handleCreateChannel = () => {
    console.log("Creating Channel:", channelData);
    handleCloseAddChannel();
  };

  return (
    <Box
      sx={{
        width: 320,
        height: "100vh",
        bgcolor: "#290b2c",
        color: "white",
        position: "fixed",
        left: 72,
        padding: 2,
      }}
    >
      <Typography variant="h6">Parkhya Solutions</Typography>

      {/* Channels Section */}
      <List>
        <ListItem button onClick={() => setChannelsOpen(!channelsOpen)}>
          <ListItemText primary="Channels" />
          {channelsOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={channelsOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {channels.map((channel) => (
              <ListItem button key={channel} sx={{ pl: 2 }}>
                <ListItemText primary={`# ${channel}`} />
              </ListItem>
            ))}
            <ListItem button sx={{ pl: 2 }} onClick={handleOpenAddChannel}>
              <ListItemIcon>
                <Add sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText primary="Add Channel" />
            </ListItem>
          </List>
        </Collapse>
      </List>

      {/* Direct Messages Section */}
      <List>
        <ListItem button onClick={() => setDmsOpen(!dmsOpen)}>
          <ListItemText primary="Direct Messages" />
          {dmsOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={dmsOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {loading ? (
              <Typography sx={{ color: "#ccc", textAlign: "center", mt: 2 }}>
                Loading users...
              </Typography>
            ) :
            Array.isArray(users) && users.length > 0 ? (
              users.map((user) => (
                <ListItem
                  button
                  key={user.id}
                  sx={{ pl: 2 }}
                  onClick={() => {
                    if (user.fullName === "Rajhveer Joshi") {
                      window.location.href = `/chat/rajhveer-joshi`;
                    } else {
                      onUserSelect(user);
                    }
                  }}
                >
                  <ListItemIcon>
                    <Avatar sx={{ width: 24, height: 24 }}>
                      {user.fullName && user.fullName.trim() !== ""
                        ? user.fullName[0]
                        : "?"} 
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText primary={user.fullName && user.fullName.trim()} />
                </ListItem>
              ))
            ) : (
              <Typography sx={{ color: "#ccc", textAlign: "center", mt: 2 }}>
                No users found.
              </Typography>
            )}
            <ListItem button sx={{ pl: 2 }}>
              <ListItemIcon>
                <Add sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText primary="Add Colleagues" />
            </ListItem>
          </List>
        </Collapse>
      </List>

      {/* Add Channel Dialog */}
      <Dialog open={openAddChannel} onClose={handleCloseAddChannel}>
        <DialogTitle>Add New Channel</DialogTitle>
        <DialogContent>
          <TextField
            label="Channel Name"
            fullWidth
            margin="dense"
            value={channelData.name}
            onChange={(e) =>
              setChannelData({ ...channelData, name: e.target.value })
            }
          />
          <TextField
            label="Description"
            fullWidth
            margin="dense"
            value={channelData.description}
            onChange={(e) =>
              setChannelData({ ...channelData, description: e.target.value })
            }
          />
          <Box display="flex" alignItems="center" mt={2}>
            <Typography>Private</Typography>
            <Switch
              checked={channelData.isPrivate}
              onChange={(e) =>
                setChannelData({ ...channelData, isPrivate: e.target.checked })
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddChannel}>Cancel</Button>
          <Button onClick={handleCreateChannel} variant="contained" color="primary">
            Create Channel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Home;
