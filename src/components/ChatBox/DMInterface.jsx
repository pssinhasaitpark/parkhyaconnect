// import React, { useState, useEffect } from 'react';
// import { 
//   Box, Typography, Avatar, IconButton, TextField, Divider, Badge, Tooltip 
// } from '@mui/material';
// import {
//   FormatBold as BoldIcon,
//   FormatItalic as ItalicIcon,
//   StrikethroughS as StrikethroughIcon,
//   InsertLink as LinkIcon,
//   FormatListBulleted as BulletListIcon,
//   FormatListNumbered as NumberListIcon,
//   Code as CodeIcon,
//   MoreVert as MoreVertIcon,
//   Close as CloseIcon,
//   EmojiEmotions as EmojiIcon,
//   AttachFile as AttachFileIcon,
//   Mic as MicIcon,
//   KeyboardArrowDown as ExpandMoreIcon,
// } from '@mui/icons-material';
// import { io } from "socket.io-client";
// import axios from 'axios';
// import { useSelector } from 'react-redux';

// const socket = io('http://192.168.0.152:8000/api/test', {
//   transports: ['websocket'],
//   reconnectionAttempts: 5,
//   reconnectionDelay: 2000,
// });

// const DMInterface = ({ selectedUser, selectedChannel, id }) => {

//     const currentUser = useSelector((state) => state.auth.currentUser);  
//   const [message, setMessage] = useState('');
//   const [messages, setMessages] = useState([]);

//   useEffect(() => {
//     // Fetch previous messages when component mounts
//     const fetchMessages = async () => {
//       try {
//         const response = await axios.get(`http://192.168.0.152:8000/api/messages?channelId=${selectedChannel}`);
//         setMessages(response.data);
//       } catch (error) {
//         console.error("Error fetching messages:", error);
//       }
//     };

//     fetchMessages();

//     // Listen for new messages
//     socket.on("receive_message", (newMessage) => {
//       setMessages((prevMessages) => [...prevMessages, newMessage]);
//     });

//     return () => {
//       socket.off("receive_message");
//     };
//   }, [selectedChannel]);


//   const sendMessage = async () => {
//     if (!message.trim()) return;

//     const newMessage = {
//       senderId: id,
//       receiverId: selectedUser.id,
//       channelId: selectedChannel,
//       content: message,
//       timestamp: new Date().toISOString(),
//     };

//     try {
//       // Save message to backend
//       await axios.post("http://192.168.0.152:8000/api/messages", newMessage);

//       // Emit message to socket
//       socket.emit("send_message", newMessage);

//       // Update UI
//       setMessages((prevMessages) => [...prevMessages, newMessage]);
//       setMessage('');
//     } catch (error) {
//       console.error("Error sending message:", error);
//     }
//   };

//   return (
//     <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100%', bgcolor: '#2F3136', color: 'white' }}>

//       {/* Header */}
//       <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.5, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
//         <Box sx={{ display: 'flex', alignItems: 'center', padding: 1 }}>
//           <Avatar src={selectedUser ? selectedUser.avatar : ''} sx={{ marginRight: 1 }} />
//           <Typography variant="h6" sx={{ fontWeight: 500 }}>
//             {selectedUser ? selectedUser.fullName : 'Select a user'}
//           </Typography>
//         </Box>

//         <Box sx={{ display: 'flex', alignItems: 'center' }}>
//           <IconButton size="small" sx={{ color: 'white' }}>
//             <Tooltip title="Call">
//               <Badge color="success" badgeContent=" " variant="dot" />
//             </Tooltip>
//           </IconButton>
//           <IconButton size="small" sx={{ color: 'white', mx: 1 }}>
//             <MoreVertIcon />
//           </IconButton>
//           <IconButton size="small" sx={{ color: 'white' }}>
//             <CloseIcon />
//           </IconButton>
//         </Box>
//       </Box>

//       {/* Messages List */}
//       <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', p: 2 }}>
//         {messages.map((msg, index) => (
//           <Box key={index} sx={{ display: 'flex', flexDirection: msg.senderId === id ? 'row-reverse' : 'row', mb: 1 }}>
//             <Avatar src={msg.senderId === id ? '' : selectedUser.avatar} sx={{ mr: 1.5, width: 36, height: 36 }} />
//             <Box>
//               <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                 <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
//                   {msg.senderId === id ? "You" : selectedUser.fullName}
//                 </Typography>
//                 <Typography variant="caption" sx={{ ml: 1, color: 'rgba(255,255,255,0.5)' }}>
//                   {new Date(msg.timestamp).toLocaleTimeString()}
//                 </Typography>
//               </Box>
//               <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', backgroundColor: '#3F4247', borderRadius: '8px', padding: '8px', maxWidth: '70%' }}>
//                 {msg.content}
//               </Typography>
//             </Box>
//           </Box>
//         ))}
//       </Box>

//       {/* Message Composer */}
//       <Box sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.3)', position: 'sticky', bottom: 0 }}>
//         <Box sx={{ border: '1px solid rgba(255,255,255,0.3)', borderRadius: 1, mb: 1 }}>
//           {/* Formatting Toolbar */}
//           <Box sx={{ display: 'flex', alignItems: 'center', p: 1, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
//             <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.7)' }}><BoldIcon fontSize="small" /></IconButton>
//             <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.7)' }}><ItalicIcon fontSize="small" /></IconButton>
//             <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.7)' }}><StrikethroughIcon fontSize="small" /></IconButton>
//             <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.7)' }}><LinkIcon fontSize="small" /></IconButton>
//           </Box>

//           {/* Message Input */}
//           <TextField
//             multiline
//             placeholder={`Message ${selectedUser ? selectedUser.fullName : ''}`}
//             fullWidth
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
//             sx={{
//               '& .MuiOutlinedInput-root': { padding: 1.5, color: 'white' },
//               '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
//             }}
//             inputProps={{ style: { color: 'white' } }}
//           />
//         </Box>

//         {/* Action Buttons */}
//         <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//           <Box>
//             <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.7)' }}><AttachFileIcon fontSize="small" /></IconButton>
//             <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.7)' }}><EmojiIcon fontSize="small" /></IconButton>
//             <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.7)' }}><MicIcon fontSize="small" /></IconButton>
//           </Box>
//           <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.7)' }} onClick={sendMessage}>Send</IconButton>
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default DMInterface;





// import React, { useState, useEffect, useRef } from 'react';
// import { 
//   Box, Typography, Avatar, IconButton, TextField, Divider, Badge, Tooltip 
// } from '@mui/material';
// import {
//   FormatBold as BoldIcon,
//   FormatItalic as ItalicIcon,
//   StrikethroughS as StrikethroughIcon,
//   InsertLink as LinkIcon,
//   FormatListBulleted as BulletListIcon,
//   FormatListNumbered as NumberListIcon,
//   Code as CodeIcon,
//   MoreVert as MoreVertIcon,
//   Close as CloseIcon,
//   EmojiEmotions as EmojiIcon,
//   AttachFile as AttachFileIcon,
//   Mic as MicIcon,
//   KeyboardArrowDown as ExpandMoreIcon,
// } from '@mui/icons-material';

// const DMInterface = ({ selectedUser }) => {
//   const [message, setMessage] = useState('');
//   const [messages, setMessages] = useState([]); // State for storing messages
//   const messagesEndRef = useRef(null); // Ref for auto-scrolling

//   // Scroll to the bottom when messages update
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   // Handle sending messages
//   const sendMessage = (e) => {
//     if (e.key === 'Enter' && message.trim() !== '') {
//       const newMessage = {
//         id: messages.length + 1,
//         sender: 'You',
//         content: message,
//         timestamp: new Date().toLocaleTimeString(),
//       };
//       setMessages([...messages, newMessage]);
//       setMessage('');
//     }
//   };

//   return (
//     <Box
//       sx={{
//         display: 'flex',
//         flexDirection: 'column',
//         height: '100vh',
//         width: '100%',
//         bgcolor: '#2F3136', 
//         color: 'white'
//       }}
//     >

//       {/* Header */}
//       <Box
//         sx={{
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'space-between',
//           p: 1.5,
//           mt: 5,
//           borderBottom: '1px solid rgba(255,255,255,0.1)',
//         }}
//       >
//         <Box sx={{ display: 'flex', alignItems: 'center', padding: 1 }}>
//           <Avatar src={selectedUser?.avatar} sx={{ marginRight: 1 }} /> 
//           <Typography variant="h6" sx={{ fontWeight: 500 }}>
//             {selectedUser ? selectedUser.fullName : 'Select a user'}
//           </Typography>
//         </Box>

//         <Box sx={{ display: 'flex', alignItems: 'center' }}>
//           <Tooltip title="Call">
//             <IconButton sx={{ color: 'white' }}>
//               <Badge color="success" badgeContent=" " variant="dot" />
//             </IconButton>
//           </Tooltip>
//           <IconButton size="small" sx={{ color: 'white', mx: 1 }}>
//             <MoreVertIcon />
//           </IconButton>
//           <IconButton size="small" sx={{ color: 'white' }}>
//             <CloseIcon />
//           </IconButton>
//         </Box>
//       </Box>

//       {/* Tabs */}
//       <Box sx={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.3)' }}>
//         <Box sx={{ py: 1.5, px: 2, borderBottom: '2px solid white', fontWeight: 'bold' }}>
//           Messages
//         </Box>
//         <Box sx={{ py: 1.5, px: 2, color: 'rgba(255,255,255,0.6)', cursor: 'pointer', '&:hover': { color: 'rgba(255,255,255,0.8)' } }}>
//           Add canvas
//         </Box>
//         <Box sx={{ px: 1, py: 1.5, color: 'rgba(255,255,255,0.6)' }}>+</Box>
//       </Box>

//       {/* Chat area */}
//       <Box 
//         sx={{ 
//           flexGrow: 1,
//           display: 'flex',
//           flexDirection: 'column',
//           justifyContent: 'flex-start',
//           overflowY: 'auto',
//           p: 2
//         }}
//       >
//         {/* Display messages dynamically */}
//         {messages.length > 0 ? (
//           messages.map((msg) => (
//             <Box key={msg.id} sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
//               <Avatar sx={{ mr: 1.5, width: 36, height: 36 }}>{msg.sender.charAt(0)}</Avatar>
//               <Box>
//                 <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                   <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{msg.sender}</Typography>
//                   <Typography variant="caption" sx={{ ml: 1, color: 'rgba(255,255,255,0.5)' }}>{msg.timestamp}</Typography>
//                 </Box>
//                 <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', backgroundColor: '#3F4247', borderRadius: '8px', padding: '8px', maxWidth: '70%' }}>
//                   {msg.content}
//                 </Typography>
//               </Box>
//             </Box>
//           ))
//         ) : (

//          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', mt: 3 }}>
//   {new Date().toLocaleString()}  
//   <br />
//   Start a conversation...
// </Typography>

//         )}

//         <div ref={messagesEndRef} />
//       </Box>

//       {/* Message composer */}
//       <Box sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.3)', position: 'sticky', bottom: 0 }}>
//         <Box sx={{ border: '1px solid rgba(255,255,255,0.3)', borderRadius: 1, mb: 1 }}>
//           {/* Formatting toolbar */}
//           <Box sx={{ display: 'flex', alignItems: 'center', p: 1, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
//             <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.7)' }}><BoldIcon fontSize="small" /></IconButton>
//             <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.7)' }}><ItalicIcon fontSize="small" /></IconButton>
//             <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.7)' }}><StrikethroughIcon fontSize="small" /></IconButton>
//             <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.7)' }}><LinkIcon fontSize="small" /></IconButton>
//             <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.7)' }}><BulletListIcon fontSize="small" /></IconButton>
//             <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.7)' }}><NumberListIcon fontSize="small" /></IconButton>
//             <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.7)' }}><CodeIcon fontSize="small" /></IconButton>
//           </Box>

//           {/* Message input */}
//           <TextField
//             multiline
//             placeholder={`Message ${selectedUser?.fullName || ''}`}
//             fullWidth
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             onKeyPress={sendMessage}
//             sx={{
//               '& .MuiOutlinedInput-root': { padding: 1.5, color: 'white' },
//               '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
//             }}
//             inputProps={{ style: { color: 'white' } }}
//           />
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default DMInterface;



// import React, { useState, useEffect, useRef } from 'react';
// import { Box, Typography, Avatar, IconButton, TextField, Tooltip } from '@mui/material';
// import { MoreVert as MoreVertIcon, Close as CloseIcon } from '@mui/icons-material';
// import { io } from 'socket.io-client';

// const socket = io('http://192.168.0.152:8000/api/test', {
//   transports: ['websocket'], // Ensure only WebSocket is used
//   reconnectionAttempts: 5,   // Retry up to 5 times
//   reconnectionDelay: 2000,   // Delay before retrying (in ms)
// });


// const DMInterface = ({ selectedUser, currentUser }) => {
//   const [message, setMessage] = useState('');
//   const [messages, setMessages] = useState([]); 
//   const messagesEndRef = useRef(null); // Auto-scroll ref

//   useEffect(() => {
//     if (currentUser) {
//       socket.emit('join', currentUser.id);
//     }

//     socket.on('connect', () => {
//       console.log('Connected to Socket.io server');
//     });

//     socket.on('connect_error', (err) => {
//       console.error('Socket connection error:', err.message);
//     });

//     socket.on('receiveMessage', ({ senderId, message }) => {
//       setMessages((prev) => [...prev, { senderId, content: message }]);
//     });

//     return () => {
//       socket.off('receiveMessage');
//       socket.off('connect');
//       socket.off('connect_error');
//     };
//   }, [currentUser]);


//   // Scroll to bottom when messages update
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   // Handle sending messages
//   const sendMessage = (e) => {
//     if (e.key === 'Enter' && message.trim() !== '' && selectedUser && currentUser) {
//       console.log("Selected User (Receiver):", selectedUser);
//       console.log("Receiver ID:", selectedUser.id);
//       console.log("Current User (Sender):", currentUser);
//       console.log("Sender ID:", currentUser.id);
//       console.log("Message:", message);

//       const newMessage = { senderId: currentUser.id, receiverId: selectedUser.id, message };

//       socket.emit('sendMessage', newMessage);
//       setMessages([...messages, { senderId: currentUser.id, content: message }]);
//       setMessage('');
//     }
//   };


//   return (
//     <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100%', bgcolor: '#2F3136', color: 'white' }}>
//       {/* Header */}
//       <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.5, mt: 5, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
//         <Box sx={{ display: 'flex', alignItems: 'center', padding: 1 }}>
//           <Avatar src={selectedUser?.avatar} sx={{ marginRight: 1 }} />
//           <Typography variant="h6" sx={{ fontWeight: 500 }}>{selectedUser ? selectedUser.fullName : 'Select a user'}</Typography>
//         </Box>
//         <Box sx={{ display: 'flex', alignItems: 'center' }}>
//           <IconButton size="small" sx={{ color: 'white', mx: 1 }}><MoreVertIcon /></IconButton>
//           <IconButton size="small" sx={{ color: 'white' }}><CloseIcon /></IconButton>
//         </Box>
//       </Box>

//       {/* Chat Area */}
//       <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', p: 2 }}>
//         {messages.map((msg, index) => (
//           <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', mb: 2, justifyContent: msg.senderId === currentUser.id ? 'flex-end' : 'flex-start' }}>
//             {msg.senderId !== currentUser.id && <Avatar sx={{ mr: 1.5 }}>{selectedUser.fullName.charAt(0)}</Avatar>}
//             <Box sx={{ bgcolor: msg.senderId === currentUser.id ? '#3F4247' : '#1E1E1E', borderRadius: '8px', p: 1.5, maxWidth: '70%' }}>
//               <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>{msg.content}</Typography>
//             </Box>
//           </Box>
//         ))}
//         <div ref={messagesEndRef} />
//       </Box>

//       {/* Message Input */}
//       <Box sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.3)', position: 'sticky', bottom: 0 }}>
//         <TextField
//           multiline
//           placeholder={`Message ${selectedUser?.fullName || ''}`}
//           fullWidth
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           onKeyPress={sendMessage}
//           sx={{
//             '& .MuiOutlinedInput-root': { padding: 1.5, color: 'white' },
//             '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
//           }}
//           inputProps={{ style: { color: 'white' } }}
//         />
//       </Box>
//     </Box>
//   );
// };

// export default DMInterface;










// import React, { useState, useEffect, useRef } from 'react';
// import { Box, Typography, Avatar, IconButton, TextField, Button } from '@mui/material';
// import { MoreVert as MoreVertIcon, Close as CloseIcon, Send as SendIcon } from '@mui/icons-material';

// import { useDispatch, useSelector } from 'react-redux';
// import { io } from 'socket.io-client';
// import axios from "axios";
// import { fetchMessages, sendMessage, addMessage } from '../../redux/messagesSlice';

// // Connect to the Socket.io server
// const socket = io('http://192.168.0.152:8000', {
//   transports: ['websocket'],
//   reconnectionAttempts: 5,
//   reconnectionDelay: 2000,
// });

// const DMInterface = ({ selectedUser }) => {
//   const dispatch = useDispatch();
//   const currentUser = useSelector((state) => state.auth.currentUser);
//   const messages = useSelector((state) => state.messages.messages);
//   const [message, setMessage] = useState('');
//   const messagesEndRef = useRef(null);

//   // Fetch messages when a user is selected
//   useEffect(() => {
//     if (selectedUser) {
//       dispatch(fetchMessages({ userId: selectedUser.id }));
//     }
//   }, [selectedUser, dispatch]);

//   // Join Socket.io room
//   useEffect(() => {
//     if (currentUser) {
//       socket.emit('join', currentUser.id);
//     }

//     socket.on('receiveMessage', (newMessage) => {
//       console.log("📩 New message received:", newMessage);
//       dispatch(addMessage(newMessage));
//     });

//     return () => {
//       socket.off('receiveMessage');
//     };
//   }, [currentUser, dispatch]);

//   // Scroll to bottom when messages update
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);


//   console.log("heyy rajjj3");



//   const handleSendMessage = async () => {
//     console.log("📩 Button Clicked: handleSendMessage called!");

//     if (!selectedUser || !currentUser || !message.trim()) {
//       console.warn("⚠️ Missing required fields!", { selectedUser, currentUser, message });
//       return;
//     }

//     const messageData = {
//       content: message,
//       receiverId: selectedUser.id,
//       senderId: "e0643f7b-41a2-463d-864e-c778159cd0bc",
//       type: "private"
//     };

//     try {
//       console.log("🚀 Sending API Request:", messageData);
//       const token = localStorage.getItem('token');

//       const response = await axios.post("http://192.168.0.152:8000/api/messages", messageData,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       console.log("✅ Message sent successfully:", response.data);

//       // Emit to Socket.io
//       socket.emit('sendMessage', response.data);

//       // Update state
//       setMessage((prev) => [...prev, response.data]);

//     } catch (error) {
//       console.error("❌ Error sending message:", error.response?.data || error.message);
//     }

//     setMessage("");
//   };



//   console.log("heyy rajjj4");

//   return (
//     <>
//       {/* <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}>
//     <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
//     <button type="submit">Send</button>
// </form> */}


//       <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100%', bgcolor: '#2F3136', color: 'white' }}>
//         {/* Header */}
//         <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.5, mt: 5, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
//           <Box sx={{ display: 'flex', alignItems: 'center', padding: 1 }}>
//             <Avatar src={selectedUser?.avatar} sx={{ marginRight: 1 }} />
//             <Typography variant="h6" sx={{ fontWeight: 500 }}>{selectedUser?.fullName || 'Select a user'}</Typography>
//           </Box>
//           <Box sx={{ display: 'flex', alignItems: 'center' }}>
//             <IconButton size="small" sx={{ color: 'white', mx: 1 }}><MoreVertIcon /></IconButton>
//             <IconButton size="small" sx={{ color: 'white' }}><CloseIcon /></IconButton>
//           </Box>

//         </Box>
//         <Box
//           sx={{
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//             mb: 4
//           }}
//         >
//           <Avatar src={selectedUser ? selectedUser.avatar : ''}
//             sx={{
//               width: 80,
//               height: 80,
//               bgcolor: '#F0A030',
//               mb: 2
//             }}
//           />
//           <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
//             {console.log("select", selectedUser)}

//             {selectedUser ? selectedUser.fullName : 'Select sdfgsfgsga user'}
//             <Box
//               sx={{
//                 width: 8,
//                 height: 8,
//                 bgcolor: '#36C5F0',
//                 borderRadius: '50%',
//                 ml: 1
//               }}
//             />
//           </Typography>
//           {selectedUser && (
//             <>
//               <Typography variant="body2" color="text.secondary" sx={{ color: 'rgba(255,255,255,0.7)', mt: 2 }}>
//                 This conversation is just between you and
//               </Typography>
//               <Typography variant="body2" color="text.secondary" sx={{ color: 'rgba(255,255,255,0.7)', mt: 0.5 }}>
//                 Take a look at their profile to learn more about them.
//               </Typography>
//             </>
//           )}
//           <Box
//             sx={{
//               border: '1px solid rgba(255,255,255,0.3)',
//               borderRadius: 1,
//               px: 2,
//               py: 1,
//               mt: 2,
//               cursor: 'pointer',
//               '&:hover': {
//                 bgcolor: 'rgba(255,255,255,0.05)'
//               }
//             }}
//           >
//             <Typography variant="body2">View profile</Typography>
//           </Box>
//         </Box>


//         {/* Chat Messages */}
//         <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', p: 2 }}>
//           {messages.map((msg, index) => (
//             <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', mb: 2, justifyContent: msg.senderId === currentUser?.id ? 'flex-end' : 'flex-start' }}>
//               {msg.senderId !== currentUser?.id && <Avatar sx={{ mr: 1.5 }}>{selectedUser?.fullName.charAt(0)}</Avatar>}
//               <Box sx={{ bgcolor: msg.senderId === currentUser?.id ? '#3F4247' : '#1E1E1E', borderRadius: '8px', p: 1.5, maxWidth: '70%' }}>
//                 <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>{msg.content}</Typography>
//               </Box>
//             </Box>
//           ))}
//           <div ref={messagesEndRef} />




//           <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', mt: 3 }}>
//             {new Date().toLocaleString()}
//             <br />
//             Start a conversation...
//           </Typography>
//         </Box>




//         {/* Message Input Form */}
//         <form
//           onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
//           style={{ display: 'flex', alignItems: 'center', padding: '16px', borderTop: '1px solid rgba(255,255,255,0.3)' }}
//         >
//           <TextField
//             multiline
//             placeholder={`Message ${selectedUser?.fullName || ''}`}
//             fullWidth
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             sx={{
//               '& .MuiOutlinedInput-root': { padding: 1.5, color: 'white' },
//               '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
//             }}
//             inputProps={{ style: { color: 'white' } }}
//           />
//           <Button type="submit" variant="contained" color="primary" sx={{ ml: 1 }}>
//             <SendIcon />
//           </Button>
//         </form>
//       </Box>
//       {/* <Dialog open={openProfile} onClose={handleCloseProfile}>
//         <DialogTitle>
//           <Typography variant="h6">User Profile</Typography>
//         </DialogTitle>
//         <DialogContent>
//           <Card sx={{ maxWidth: 400, bgcolor: "#1a1d21", color: "white", p: 2, borderRadius: 2 }}>
//             <CardContent>
//               <Avatar sx={{ width: 56, height: 56, bgcolor: "gray", mb: 2 }} />
//               <Typography variant="h6">Gokul Chandel</Typography>
//               <Button variant="outlined" size="small" sx={{ m: 1, color: "white", borderColor: "gray" }}>Mute</Button>
//               <Button variant="outlined" size="small" sx={{ m: 1, color: "white", borderColor: "gray" }}>Hide</Button>
//               <Button variant="outlined" size="small" sx={{ m: 1, color: "white", borderColor: "gray" }}>Huddle</Button>

//               <Divider sx={{ my: 2, bgcolor: "gray" }} />
//               <Typography variant="subtitle2">Topic</Typography>
//               <Typography variant="body2" color="gray">Add a topic</Typography>

//               <Divider sx={{ my: 2, bgcolor: "gray" }} />
//               <Typography variant="body2" display="flex" alignItems="center">
//                 <AccessTime fontSize="small" sx={{ mr: 1 }} /> 1:00 PM local time
//               </Typography>
//               <Typography variant="body2" display="flex" alignItems="center" sx={{ mt: 1 }}>
//                 <Email fontSize="small" sx={{ mr: 1 }} />
//                 <Link href="mailto:gokul.chandel@parkhya.net" color="#4fc3f7">gokul.chandel@parkhya.net</Link>
//               </Typography>
//               <Typography variant="body2" color="#4fc3f7" sx={{ mt: 1, cursor: "pointer" }}>View full profile</Typography>

//               <Divider sx={{ my: 2, bgcolor: "gray" }} />
//               <Typography variant="subtitle2">Add people to this conversation</Typography>

//               <Divider sx={{ my: 2, bgcolor: "gray" }} />
//               <Typography variant="subtitle2">Files</Typography>
//               <Typography variant="body2" color="gray">
//                 There aren’t any files to see here right now. But there could be – drag and drop any file into the message pane to add it to this conversation.
//               </Typography>

//               <Divider sx={{ my: 2, bgcolor: "gray" }} />
//               <Typography variant="body2" color="gray">Channel ID: D08JMAZ5T4Y</Typography>
//             </CardContent>
//           </Card>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseProfile} color="primary">Close</Button>
//         </DialogActions>
//       </Dialog> */}
//     </>

//   );
// };

// export default DMInterface;





import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Avatar, IconButton, TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Link, Card, CardContent } from '@mui/material';
import { MoreVert as MoreVertIcon, Close as CloseIcon, Send as SendIcon, AccessTime, Email } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import axios from "axios";
import { fetchMessages, sendMessage, addMessage } from '../../redux/messagesSlice';

// Connect to the Socket.io server
const socket = io('http://192.168.0.152:8000', {
  transports: ['websocket'],
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
});

const DMInterface = ({ selectedUser }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.currentUser);
  const messages = useSelector((state) => state.messages.messages);
  const [message, setMessage] = useState('');
  const [openProfile, setOpenProfile] = useState(false); // Manage profile pop-up modal
  const messagesEndRef = useRef(null);

  // Fetch messages when a user is selected
  useEffect(() => {
    if (selectedUser) {
      dispatch(fetchMessages({ userId: selectedUser.id }));
    }
  }, [selectedUser, dispatch]);

  // Join Socket.io room
  useEffect(() => {
    if (currentUser) {
      socket.emit('join', currentUser.id);
    }

    socket.on('receiveMessage', (newMessage) => {
      console.log("📩 New message received:", newMessage);
      dispatch(addMessage(newMessage));
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [currentUser, dispatch]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    console.log("📩 Button Clicked: handleSendMessage called!");

    if (!selectedUser || !currentUser || !message.trim()) {
      console.warn("⚠️ Missing required fields!", { selectedUser, currentUser, message });
      return;
    }

    const messageData = {
      content: message,
      receiverId: selectedUser.id,
      senderId: currentUser.id,
      type: "private"
    };

    try {
      console.log("🚀 Sending API Request:", messageData);
      const token = localStorage.getItem('token');

      const response = await axios.post("http://192.168.0.152:8000/api/messages", messageData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log("✅ Message sent successfully:", response.data);

      // Emit to Socket.io
      socket.emit('sendMessage', response.data);

      // Update state
      setMessage("");

    } catch (error) {
      console.error("❌ Error sending message:", error.response?.data || error.message);
    }
  };

  const handleCloseProfile = () => {
    setOpenProfile(false); // Close the profile pop-up
  };

  const handleViewProfile = () => {
    setOpenProfile(true); // Open the profile pop-up
  };

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100%', bgcolor: '#2F3136', color: 'white' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.5, mt: 5, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', padding: 1 }}>
            <Avatar src={selectedUser?.avatar} sx={{ marginRight: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 500 }}>{selectedUser?.fullName || 'Select a user'}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton size="small" sx={{ color: 'white', mx: 1 }}><MoreVertIcon /></IconButton>
            <IconButton size="small" sx={{ color: 'white' }}><CloseIcon /></IconButton>
          </Box>
        </Box>

        {/* User Info */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
          <Avatar
            src={selectedUser ? selectedUser.avatar : ''}
            sx={{ width: 80, height: 80, bgcolor: '#F0A030', mb: 2 }}
          />
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
            {selectedUser ? selectedUser.fullName : 'Select a user'}
            <Box sx={{ width: 8, height: 8, bgcolor: '#36C5F0', borderRadius: '50%', ml: 1 }} />
          </Typography>
          {selectedUser && (
            <>
              <Typography variant="body2" color="text.secondary" sx={{ color: 'rgba(255,255,255,0.7)', mt: 2 }}>
                This conversation is just between you and
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ color: 'rgba(255,255,255,0.7)', mt: 0.5 }}>
                Take a look at their profile to learn more about them.
              </Typography>
            </>
          )}
          <Box
            onClick={handleViewProfile}
            sx={{
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: 1,
              px: 2,
              py: 1,
              mt: 2,
              cursor: 'pointer',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' }
            }}
          >
            <Typography variant="body2">View profile</Typography>
          </Box>
        </Box>

        {/* Chat Messages */}
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', p: 2 }}>
          {messages.map((msg, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', mb: 2, justifyContent: msg.senderId === currentUser?.id ? 'flex-end' : 'flex-start' }}>
              {msg.senderId !== currentUser?.id && <Avatar sx={{ mr: 1.5 }}>{selectedUser?.fullName.charAt(0)}</Avatar>}
              <Box sx={{ bgcolor: msg.senderId === currentUser?.id ? '#3F4247' : '#1E1E1E', borderRadius: '8px', p: 1.5, maxWidth: '70%' }}>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>{msg.content}</Typography>
              </Box>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Box>

        <form
          onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
          style={{ display: 'flex', alignItems: 'center', padding: '16px', borderTop: '1px solid rgba(255,255,255,0.3)' }}
        >
          <TextField
            multiline
            placeholder={`Message ${selectedUser?.fullName || ''}`}
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': { padding: 1.5, color: 'white' },
              '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
            }}
            inputProps={{ style: { color: 'white' } }}
          />
          <Button type="submit" variant="contained" color="primary" sx={{ ml: 1 }}>
            <SendIcon />
          </Button>
        </form>
      </Box>

      <Dialog 
  open={openProfile} 
  onClose={handleCloseProfile} 
  sx={{
    '& .MuiDialogContent-root': { 
      backgroundColor: '#1a1d21'  
    },
    '& .MuiDialogActions-root': { 
      backgroundColor: '#1a1d21'  
    }
  }}
>
  <DialogContent>
    <Card sx={{ 
      maxWidth: 400, 
      bgcolor: "#1a1d21", 
      color: "white", 
      p: 2, 
      borderRadius: 2, 
      boxShadow: 0  
    }}>
      <CardContent>
        {/* Profile Avatar */}
        <Avatar 
          sx={{ width: 56, height: 56, bgcolor: "gray", mb: 2 }} 
          src={selectedUser?.avatar || ''} 
        />
        
        {/* User Name */}
        <Typography variant="h6">{selectedUser?.fullName || 'User Name'}</Typography>
        
        {/* Action Buttons */}
        <Button variant="outlined" size="small" sx={{ m: 1, color: "white", borderColor: "gray" }}>Mute</Button>
        <Button variant="outlined" size="small" sx={{ m: 1, color: "white", borderColor: "gray" }}>Hide</Button>
        <Button variant="outlined" size="small" sx={{ m: 1, color: "white", borderColor: "gray" }}>Huddle</Button>

        <Divider sx={{ my: 2, bgcolor: "gray" }} />
        
        {/* Topic */}
        <Typography variant="subtitle2">Topic</Typography>
        <Typography variant="body2" color="gray">{selectedUser?.topic || 'Add a topic'}</Typography>

        <Divider sx={{ my: 2, bgcolor: "gray" }} />
        
        {/* Local Time */}
        <Typography variant="body2" display="flex" alignItems="center">
          <AccessTime fontSize="small" sx={{ mr: 1 }} /> {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} local time
        </Typography>
        
        {/* User Email */}
        <Typography variant="body2" display="flex" alignItems="center" sx={{ mt: 1 }}>
          <Email fontSize="small" sx={{ mr: 1 }} />
          <Link href={`mailto:${selectedUser?.email}`} color="#4fc3f7">{selectedUser?.email || 'user@example.com'}</Link>
        </Typography>

        {/* Full Profile Link */}
        <Typography variant="body2" color="#4fc3f7" sx={{ mt: 1, cursor: "pointer" }}>View full profile</Typography>

        <Divider sx={{ my: 2, bgcolor: "gray" }} />
        
        {/* Add people to the conversation */}
        <Typography variant="subtitle2">Add people to this conversation</Typography>

        <Divider sx={{ my: 2, bgcolor: "gray" }} />
        
        {/* Files Section */}
        <Typography variant="subtitle2">Files</Typography>
        <Typography variant="body2" color="gray">
          There aren’t any files to see here right now. But there could be – drag and drop any file into the message pane to add it to this conversation.
        </Typography>

        <Divider sx={{ my: 2, bgcolor: "gray" }} />
        
        {/* Channel ID */}
        <Typography variant="body2" color="gray">Channel ID: {selectedUser?.channelId || 'Unknown'}</Typography>
      </CardContent>
    </Card>
  </DialogContent>

  {/* Dialog Close Button */}
  <DialogActions sx={{ backgroundColor: '#1a1d21' }}>
    <Button onClick={handleCloseProfile} color="primary">Close</Button>
  </DialogActions>
</Dialog>


    </>
  );
};

export default DMInterface;
