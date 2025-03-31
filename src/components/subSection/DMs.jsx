import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchUsers, fetchSelectedUser  } from "../../redux/authSlice";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  IconButton,
  Badge,
  Divider,
  TextField,
  Switch,
} from "@mui/material";
import { getColorFromName } from "../../utils/colorUtils";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DMInterface from "../ChatBox/DMInterface";

const DMs = () => {
  const [showUnread, setShowUnread] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { users, selectedUser  } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchUsers());
    const queryParams = new URLSearchParams(location.search);
    const userId = queryParams.get("userId");
    if (userId) {
      dispatch(fetchSelectedUser (userId));
    }
  }, [dispatch, location.search]);

  const handleUserSelect = async (user) => {
    const searchParams = new URLSearchParams();
    searchParams.set("userId", user.id);
    navigate({
      pathname: window.location.pathname,
      search: searchParams.toString(),
    });
    // Fetch the selected user
    const result = await dispatch(fetchSelectedUser (user.id)).unwrap();
    console.log("Selected User:", result);
  };

  const handleCloseDMInterface = () => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.delete("userId");
    navigate({
      pathname: window.location.pathname,
      search: searchParams.toString(),
    });
  };

  const filteredUsers = (users || []).filter((user) =>
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ display: "flex", height: "100vh", width: "100%" }}>
      {/* Left sidebar for DM list */}
      <Box
        sx={{
          width: 320,
          bgcolor: "#290B2C",
          color: "white",
          display: "flex",
          flexDirection: "column",
          padding: 2,
          borderRight: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <Box sx={{ position: "sticky", top: 0, zIndex: 10, pb: 2 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Direct Messages</Typography>
            <IconButton sx={{ color: "white" }}>
              <EditIcon />
            </IconButton>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            bgcolor="#3B1E3D"
            borderRadius="4px"
            padding="4px"
            mt={1}
            mb={1}
          >
            <SearchIcon sx={{ color: "#aaa", marginRight: 1 }} />
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
            <Switch checked={showUnread} onChange={() => setShowUnread(!showUnread)} />
          </Box>
        </Box>
        <Divider sx={{ bgcolor: "#3B1E3D", my: 2 }} />
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
                    "&:hover": { bgcolor: "#3B1E3D", cursor: "pointer" },
                    bgcolor: selectedUser ?.id === user.id ? "#3B1E3D" : "transparent",
                  }}
                  onClick={() => handleUserSelect(user)}
                >
                  <ListItemAvatar>
                    <Badge
                      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                      overlap="circular"
                    >
                      <Avatar
                        src={user.avatar || ""}
                        sx={{ bgcolor: getColorFromName(user.fullName) }}
                      >
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
                    primary={<Typography fontWeight={user.unread > 0 ? "bold" : "normal"}>{user.fullName}</Typography>}
                    secondary={user.message}
                    sx={{ color: "#ccc" }}
                  />
                  <Box display="flex" flexDirection="column" alignItems="flex-end">
                    <Typography variant="caption" sx={{ color: "#999", mb: 0.3 }}>
                      {user.time}
                    </Typography>
                    {user.unread > 0 && <Badge badgeContent={user.unread} color="error" sx={{ mt: 0.8, mr: -0.5 }} />}
                  </Box>
                </ListItem>
              ))
            ) : (
              <Typography sx={{ color: "#ccc", textAlign: "center", mt: 2 }}>No users found.</Typography>
            )}
          </List>
        </Box>
      </Box>
      {/* Right side for DM interface */}
      <Box
  sx={{
    flex: 1,
    display: "flex",
    position: selectedUser  ? "fixed" : "relative",
    transform: selectedUser  ? "translateX(0)" : "translateX(100%)",
    width: "calc(100% - 420px)",
    bgcolor: "#1E1E1E",
    zIndex: selectedUser  ? 1 : 0,
    right: 0,
    top: 50,
    height: "95%",
    pt: 1,
  }}
>
  {selectedUser  && <DMInterface selectedUser ={selectedUser } onClose={handleCloseDMInterface} />}
</Box>
    </Box>
  );
};

export default DMs;