import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, fetchSelectedUser } from "../../redux/authSlice";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  TextField,
  IconButton,
  Badge,
  Switch,
  Divider,
  CircularProgress
} from "@mui/material";
import { Search, Edit, Send } from "@mui/icons-material";

const DMs = () => {
  const [showUnread, setShowUnread] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  // Removed local state for selectedUser as it is managed in Redux

  const [newMessage, setNewMessage] = useState("");  // Track the new message input

  const dispatch = useDispatch();
  const { users, loading, error, selectedUser } = useSelector((state) => state.auth);
  const errorMessage = error ? <Typography sx={{ color: 'red', textAlign: 'center' }}>{error}</Typography> : null;

  const { messages } = useSelector((state) => state.messages);

  useEffect(() => {
    dispatch(fetchUsers());  // Fetch users on component mount
  }, [dispatch]);

  // Handle user selection from the sidebar
  const handleUserSelect = async (user) => {
    const userDetail = await dispatch(fetchSelectedUser(user.id)).unwrap();
  };

  // Filter users based on the search query
  const filteredUsers = (users || []).filter(user =>
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle sending a new message
  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      // Dispatch the message to be sent to the selected user
      dispatch(sendMessage({ content: newMessage, receiverId: selectedUser.id }));
      setNewMessage("");  // Clear the message input
    }
  };




  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: 320,
          bgcolor: "#290b2c",
          color: "white",
          display: "flex",
          flexDirection: "column",
          padding: 2,
        }}
      >
        {/* Fixed Header */}
        <Box sx={{ position: "sticky", top: 0, zIndex: 10, pb: 2 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Direct Messages</Typography>
            <IconButton sx={{ color: "white" }}>
              <Edit />
            </IconButton>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            bgcolor="#3b1e3d"
            borderRadius="4px"
            padding="4px"
            mt={1}
            mb={1}
          >
            <Search sx={{ color: "#aaa", marginRight: 1 }} />
            <TextField
              variant="standard"
              placeholder="Find a DM"
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                disableUnderline: true,
                style: { color: "white" },
              }}
            />
          </Box>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="body2">Unread messages</Typography>
            <Switch
              checked={showUnread}
              onChange={() => setShowUnread(!showUnread)}
            />
          </Box>
        </Box>

        {errorMessage}
        <Divider sx={{ bgcolor: "#3b1e3d", my: 2 }} />

        {/* Scrollable User List */}
        <Box sx={{ overflowY: "auto", flex: 1 }}>
       
          <List>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <ListItem
                  key={user.id}
                  button
                  sx={{
                    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                    display: showUnread && user.unread === 0 ? "none" : "flex",
                    alignItems: "center",
                    "&:hover": { bgcolor: "#3b1e3d", cursor: "pointer" },
                  }}
                  onClick={() => handleUserSelect(user)}  // Handle user click
                >
                  <ListItemAvatar>
                    <Badge
                      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                      overlap="circular"
                    >
                      <Avatar src={user.avatar ? user.avatar : ""}>
                        {user.avatar ? "" : user.fullName[0]}
                      </Avatar>
                      {user.isOnline && (
                        <Box
                          sx={{
                            position: "absolute",
                            bottom: 2,
                            right: 2,
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            bgcolor: "green",
                          }}
                        />
                      )}
                    </Badge>
                  </ListItemAvatar>

                  <ListItemText
                    primary={
                      <Typography fontWeight={user.unread > 0 ? "bold" : "normal"}>
                        {user.fullName}
                      </Typography>
                    }
                    secondary={user.message}
                    sx={{ color: "#ccc" }}
                  />

                  <Box display="flex" flexDirection="column" alignItems="flex-end">
                    <Typography variant="caption" sx={{ color: "#999", mb: 0.3 }}>
                      {user.time}
                    </Typography>
                    {user.unread > 0 && (
                      <Badge badgeContent={user.unread} color="error" sx={{ mt: 0.8, mr: -0.5 }} />
                    )}
                  </Box>
                </ListItem>
              ))
            ) : (
              <Typography sx={{ color: "#ccc", textAlign: "center", mt: 2 }}>
                No users found.
              </Typography>
            )}
          </List>
        </Box>
      </Box>

      {/* Chat Workspace (Right Side) */}
      {selectedUser && (
        <Box
          sx={{
            flex: 1,
            bgcolor: "#1e1e1e",
            color: "white",
            display: "flex",
            flexDirection: "column",
            padding: 2,
          }}
        >
      
        </Box>
      )}
    </Box>
  );
};

export default DMs;
