// import React, { useState, useEffect } from "react";
// import { getColorFromName } from "../../utils/colorUtils"; 

// import { fetchMessages, clearMessages } from "../../redux/messagesSlice"; 
// import { useDispatch, useSelector } from "react-redux";
// import { fetchUsers } from "../../redux/authSlice";
// import { fetchChannels } from "../../redux/channelsSlice";
// import {fetchUserById} from "../../redux/chatSlice"
// import DMInterface2 from "../ChatBox/DMInterface2";
// import {
//   Box,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   Collapse,
//   Typography,
//   Avatar,
//   CircularProgress
// } from "@mui/material";
// import { ExpandLess, ExpandMore, Add, Tag } from "@mui/icons-material";
// import ChannelPopup from "../../components/ChatBox/ChannelPopup";


// const Home = ({ onUserSelect }) => {
//   const dispatch = useDispatch(); 
//   const [channelsOpen, setChannelsOpen] = useState(false);
//   const [dmsOpen, setDmsOpen] = useState(false);
//   const [openChannelPopup, setOpenChannelPopup] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null); // State to manage selected user

//   const { users, loading: usersLoading } = useSelector((state) => state.auth);
//   const { channels, loading: channelsLoading } = useSelector((state) => state.channels);

//   useEffect(() => {
//     dispatch(fetchUsers());
//     dispatch(fetchChannels());
//   }, [dispatch]);
  
//   const handleOpenChannelPopup = () => {
//     setOpenChannelPopup(true);
//   };

//   const handleCloseChannelPopup = () => {
//     setOpenChannelPopup(false);
//   };

//   const handleChannelSelect = (channelId, channelName) => {
//     console.log(`Selected channel: ${channelName} (${channelId})`);
//     // Logic to open DMInterface
//     // Set state or navigate to DMInterface
//   };

//   const handleUserSelect = (user) => {
//     console.log(`User clicked: ${user.id}`);
//     dispatch(fetchMessages({ userId: user.id }));
//     dispatch(clearMessages()); 
//     setSelectedUser(user); // Set selected user
//     onUserSelect(user); 
//   };

//   // useEffect(() => {
//   //   console.log("Selected User Updated:", selectedUser);
//   // }, [selectedUser]);
  

//   return (
//     <Box
//       sx={{
//         width: 320,
//         height: "100vh",
//         bgcolor: "#290b2c",
//         color: "white",
//         position: "fixed",
//         left: 72,
//         padding: 2,
//       }}
//     >
//       <Typography variant="h6">Parkhya Solutions</Typography>

//       {/* Channels Section */}
//       <List>
//         <ListItem button onClick={() => setChannelsOpen(!channelsOpen)}>
//           <ListItemText primary="Channels" />
//           {channelsOpen ? <ExpandLess /> : <ExpandMore />}
//         </ListItem>
//         <Collapse in={channelsOpen} timeout="auto" unmountOnExit>
//           <List component="div" disablePadding>
//             {channelsLoading ? (
//               <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 2 }}>
//                 <CircularProgress size={24} sx={{ color: 'white' }} />
//               </Box>
//             ) : channels && channels.length > 0 ? (
//               channels.map((channel) => (
//                 <ListItem 
//                   button 
//                   key={channel.id} 
//                   sx={{ pl: 2 }}
//                   onClick={() => handleChannelSelect(channel.id, channel.name)}
//                 >
//                   <ListItemIcon sx={{ minWidth: 32 }}>
//                     <Tag sx={{ color: "white", fontSize: 18 }} />
//                   </ListItemIcon>
//                   <ListItemText primary={channel.name} />
//                 </ListItem>
//               ))
//             ) : (
//               <Typography sx={{ color: "#ccc", textAlign: "center", mt: 2 }}>
//                 No channels available.
//               </Typography>
//             )}
//             <ListItem button sx={{ pl: 2 }} onClick={handleOpenChannelPopup}>
//               <ListItemIcon>
//                 <Add sx={{ color: "white" }} />
//               </ListItemIcon>
//               <ListItemText primary="Add Channel" />
//             </ListItem>
//           </List>
//         </Collapse>
//       </List>

//       {/* Direct Messages Section */}
//       <List>
//         <ListItem button onClick={() => setDmsOpen(!dmsOpen)}>
//           <ListItemText primary="Direct Messages" />
//           {dmsOpen ? <ExpandLess /> : <ExpandMore />}
//         </ListItem>
//         <Collapse in={dmsOpen} timeout="auto" unmountOnExit>
//           <List component="div" disablePadding>
//             {usersLoading ? (
//               <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 2 }}>
//                 <CircularProgress size={24} sx={{ color: 'white' }} />
//               </Box>
//             ) : Array.isArray(users) && users.length > 0 ? (
//               users.map((user) => (
//                 <ListItem
//                   button
//                   key={user.id}
//                   sx={{ pl: 2 }}
//                   onClick={() => handleUserSelect(user)} 
//                 >
//                   <ListItemIcon>
//                     <Avatar sx={{ width: 24, height: 24, bgcolor: getColorFromName(user.fullName) }}>
//                       {user?.fullName && user?.fullName.trim() !== ""
//                         ? user?.fullName[0]
//                         : "?"}
//                     </Avatar>
//                   </ListItemIcon>
//                   <ListItemText primary={user?.fullName && user?.fullName.trim()} />
//                   {user.isOnline && (
//                     <Box
//                       sx={{
//                         bgcolor: "green",
//                         borderRadius: "50%",
//                         width: 10,
//                         height: 10,
//                         position: "absolute",
//                         right: 10,
//                         top: 10,
//                       }}
//                     />
//                   )}
//                 </ListItem>
//               ))
//             ) : (
//               <Typography sx={{ color: "#ccc", textAlign: "center", mt: 2 }}>
//                 No users found.
//               </Typography>
//             )}
//             <ListItem button sx={{ pl: 2 }}>
//               <ListItemIcon>
//                 <Add sx={{ color: "white" }} />
//               </ListItemIcon>
//               <ListItemText primary="Add Colleagues" />
//             </ListItem>
//           </List>
//         </Collapse>
//       </List>

//       <ChannelPopup open={openChannelPopup} handleClose={handleCloseChannelPopup} />
//         <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
//                   {selectedUser ? selectedUser.fullName : 'Select a user'}
//                   <Box 
//                     sx={{ 
//                       width: 8, 
//                       height: 8, 
//                       bgcolor: '#36C5F0', 
//                       borderRadius: '50%', 
//                       ml: 1 
//                     }}
//                   />
//                 </Typography>
    
// {/* <Box sx={{
//   flex: 1, 
//   display: "flex", 
//   position: "relative",
//   transition: "all 0.5s ease", 
//   transform: selectedUser ? "translateX(0)" : "translateX(100%)",
//   width: "calc(100% - 320px)",  
//   bgcolor: "#1E1E1E",
//   zIndex: selectedUser ? 1 : 0,
//   // position: "fixed",
//   right: 0,
//   top: 0,
//   height: "100vh"
// }}>
//   {selectedUser && <DMInterface2 selectedUser={selectedUser} selectedChannel={null} />}
// </Box> */}
//     </Box>
//   );
// };

// export default Home;



import React, { useState, useEffect } from "react";
import { getColorFromName } from "../../utils/colorUtils"; 
import { fetchMessages, clearMessages } from "../../redux/messagesSlice"; 
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../redux/authSlice";
import { fetchChannels } from "../../redux/channelsSlice";
import DMInterface2 from "../ChatBox/DMInterface2";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
  Avatar,
  CircularProgress
} from "@mui/material";
import { ExpandLess, ExpandMore, Add, Tag } from "@mui/icons-material";
import ChannelPopup from "../../components/ChatBox/ChannelPopup";

const Home = ({ onUserSelect }) => {
  const dispatch = useDispatch(); 
  const [channelsOpen, setChannelsOpen] = useState(false);
  const [dmsOpen, setDmsOpen] = useState(false);
  const [openChannelPopup, setOpenChannelPopup] = useState(false);
  const [selectedUser , setSelectedUser ] = useState(null); // State to manage selected user

  const { users, loading: usersLoading } = useSelector((state) => state.auth);
  const { channels, loading: channelsLoading } = useSelector((state) => state.channels);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchChannels());
  }, [dispatch]);
  
  const handleOpenChannelPopup = () => {
    setOpenChannelPopup(true);
  };

  const handleCloseChannelPopup = () => {
    setOpenChannelPopup(false);
  };

  const handleChannelSelect = (channelId, channelName) => {
    console.log(`Selected channel: ${channelName} (${channelId})`);
    // Logic to open DMInterface
    // Set state or navigate to DMInterface
  };

  const handleUserSelect = (user) => {
    console.log(`User  clicked: ${user.id}`);
    dispatch(fetchMessages({ userId: user.id }));
    dispatch(clearMessages()); 
    setSelectedUser (user); // Set selected user
    onUserSelect(user); 
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
            {channelsLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 2 }}>
                <CircularProgress size={24} sx={{ color: 'white' }} />
              </Box>
            ) : channels && channels.length > 0 ? (
              channels.map((channel) => (
                <ListItem 
                  button 
                  key={channel.id} 
                  sx={{ pl: 2 }}
                  onClick={() => handleChannelSelect(channel.id, channel.name)}
                >
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <Tag sx={{ color: "white", fontSize: 18 }} />
                  </ListItemIcon>
                  <ListItemText primary={channel.name} />
                </ListItem>
              ))
            ) : (
              <Typography sx={{ color: "#ccc", textAlign: "center", mt: 2 }}>
                No channels available.
              </Typography>
            )}
            <ListItem button sx={{ pl: 2 }} onClick={handleOpenChannelPopup}>
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
            {usersLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 2 }}>
                <CircularProgress size={24} sx={{ color: 'white' }} />
              </Box>
            ) : Array.isArray(users) && users.length > 0 ? (
              users.map((user) => (
                <ListItem
                  button
                  key={user.id}
                  sx={{ pl: 2 }}
                  onClick={() => handleUserSelect(user)} 
                >
                  <ListItemIcon>
                    <Avatar sx={{ width: 24, height: 24, bgcolor: getColorFromName(user.fullName) }}>
                      {user?.fullName && user?.fullName.trim() !== ""
                        ? user?.fullName[0]
                        : "?"}
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText primary={user?.fullName && user?.fullName.trim()} />
                  {user.isOnline && (
                    <Box
                      sx={{
                        bgcolor: "green",
                        borderRadius: "50%",
                        width: 10,
                        height: 10,
                        position: "absolute",
                        right: 10,
                        top: 10,
                      }}
                    />
                  )}
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

      <ChannelPopup open={openChannelPopup} handleClose={handleCloseChannelPopup} />
      <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
        {selectedUser  ? selectedUser .fullName : 'Select a user'}
        <Box 
          sx={{ 
            width: 8, 
            height: 8, 
            bgcolor: '#36C5F0', 
            borderRadius: '50%', 
            ml: 1 
          }}
        />
      </Typography>

      {/* DM Interface */}
     
    </Box>
  );
};

export default Home;