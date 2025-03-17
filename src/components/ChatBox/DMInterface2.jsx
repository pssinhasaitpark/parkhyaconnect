// import React, { useState } from 'react';
// import { 
//   Box, 
//   Typography, 
//   Avatar, 
//   IconButton, 
//   TextField, 
//   Divider,
//   Badge,
//   Tooltip
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

// const DMInterface = ({ selectedUser, selectedChannel, id }) => {
//   const [message, setMessage] = useState('');
  
//   return (
//       <Box
//         sx={{
//           display: 'flex',
//           flexDirection: 'column',
//           height: '100vh',
//           width: '100%',
//           bgcolor: '#2F3136', 
//           color: 'white'
//         }}
//       >

//       {/* Header */}
//       <Box
//         sx={{
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'space-between',
//           p: 1.5,
//           borderBottom: '1px solid rgba(255,255,255,0.1)',
//         }}
//       >
//         <Box sx={{ display: 'flex', alignItems: 'center', padding: 1 }}>
//           <Avatar src={selectedUser ? selectedUser.avatar : ''} sx={{ marginRight: 1 }} /> {/* Added user avatar */}
//           <Typography variant="h6" sx={{ fontWeight: 500 }}>
//             {selectedUser ? selectedUser.fullName : 'Select a user'}
//           </Typography>
//         </Box>
        
//         <Box sx={{ display: 'flex', alignItems: 'center' }}>
//           <IconButton size="small" sx={{ color: 'white' }}>
//             <Tooltip title="Call">
//               <IconButton sx={{ color: 'white' }}>
//                 <Badge color="success" badgeContent=" " variant="dot" />
//               </IconButton>
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
      
//       {/* Tabs */}
//       <Box sx={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.3)' }}>
//         <Box 
//           sx={{ 
//             py: 1.5, 
//             px: 2, 
//             borderBottom: '2px solid white',
//             fontWeight: 'bold'
//           }}
//         >
//           Messages
//         </Box>
//         <Box 
//           sx={{ 
//             py: 1.5, 
//             px: 2, 
//             color: 'rgba(255,255,255,0.6)',
//             cursor: 'pointer',
//             '&:hover': {
//               color: 'rgba(255,255,255,0.8)',
//             }
//           }}
//         >
//           Add canvas
//         </Box>
//         <Box sx={{ px: 1, py: 1.5, color: 'rgba(255,255,255,0.6)' }}>+</Box>
//       </Box>
      
//       {/* Empty chat area */}
//       <Box 
//         sx={{ 
//           flexGrow: 1,
//           display: 'flex',
//           flexDirection: 'column',
//           justifyContent: 'flex-start',
//           overflowY: 'auto' // Added overflow for scrolling
//         }}
//       >
//         {/* User info section at bottom */}
        // <Box
        //   sx={{
        //     display: 'flex',
        //     flexDirection: 'column',
        //     alignItems: 'center',
        //     mb: 4
        //   }}
        // >
        //   <Avatar src={selectedUser ? selectedUser.avatar : ''}
        //     sx={{ 
        //       width: 80, 
        //       height: 80, 
        //       bgcolor: '#F0A030',
        //       mb: 2
        //     }}
        //   />
        //   <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
        //     {console.log("select", selectedUser)}
            
        //   {selectedUser ? selectedUser.fullName : 'Select sdfgsfgsga user'}
        //     <Box 
        //       sx={{ 
        //         width: 8, 
        //         height: 8, 
        //         bgcolor: '#36C5F0', 
        //         borderRadius: '50%', 
        //         ml: 1 
        //       }}
        //     />
        //   </Typography>
        //   {selectedUser && (
        //     <>
        //       <Typography variant="body2" color="text.secondary" sx={{ color: 'rgba(255,255,255,0.7)', mt: 2 }}>
        //         This conversation is just between you and
        //       </Typography>
        //       <Typography variant="body2" color="text.secondary" sx={{ color: 'rgba(255,255,255,0.7)', mt: 0.5 }}>
        //         Take a look at their profile to learn more about them.
        //       </Typography>
        //     </>
        //   )}
        //   <Box
        //     sx={{
        //       border: '1px solid rgba(255,255,255,0.3)',
        //       borderRadius: 1,
        //       px: 2,
        //       py: 1,
        //       mt: 2,
        //       cursor: 'pointer',
        //       '&:hover': {
        //         bgcolor: 'rgba(255,255,255,0.05)'
        //       }
        //     }}
        //   >
        //     <Typography variant="body2">View profile</Typography>
        //   </Box>
        // </Box>
        
        // {/* Date divider */}
        // <Box 
        //   sx={{ 
        //     display: 'flex', 
        //     alignItems: 'center', 
        //     color: 'rgba(255,255,255,0.5)', 
        //     mb: 2,
        //     px: 2 
        //   }}
        // >
        //   <Divider sx={{ flexGrow: 1, bgcolor: 'rgba(255,255,255,0.1)' }} />
        //   <Typography variant="caption" sx={{ px: 2 }}>
        //     Wednesday, 26 February
        //   </Typography>
        //   <Divider sx={{ flexGrow: 1, bgcolor: 'rgba(255,255,255,0.1)' }} />
        // </Box>
        
//         {/* Join message */}
//         <Box sx={{ px: 3, pb: 3, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
//             <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2, width: '100%' }}>
//             <Avatar sx={{ mr: 1.5, width: 36, height: 36 }}>A</Avatar>
//             <Box>
//               <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                 <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
//                   Ayush
//                 </Typography>
//                 <Typography variant="caption" sx={{ ml: 1, color: 'rgba(255,255,255,0.5)' }}>
//                   12:57 PM
//                 </Typography>
//               </Box>
//                 <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', backgroundColor: '#3F4247', borderRadius: '8px', padding: '8px', maxWidth: '70%' }}>
//                 joined Slack
//               </Typography>
//             </Box>
//           </Box>
//         </Box>
//       </Box>
      
//       {/* Message composer */}
//         <Box sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.3)', position: 'sticky', bottom: 0 }}>
//         <Box 
//           sx={{ 
//             border: '1px solid rgba(255,255,255,0.3)', 
//             borderRadius: 1, 
//             mb: 1 
//           }}
//         >
//           {/* Formatting toolbar */}
//           <Box 
//             sx={{ 
//               display: 'flex', 
//               alignItems: 'center',
//               p: 1,
//               borderBottom: '1px solid rgba(255,255,255,0.1)'
//             }}
//           >
//             <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.7)' }}>
//               <BoldIcon fontSize="small" />
//             </IconButton>
//             <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.7)' }}>
//               <ItalicIcon fontSize="small" />
//             </IconButton>
//             <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.7)' }}>
//               <StrikethroughIcon fontSize="small" />
//             </IconButton>
//             <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.7)' }}>
//               <LinkIcon fontSize="small" />
//             </IconButton>
//             <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.7)' }}>
//               <BulletListIcon fontSize="small" />
//             </IconButton>
//             <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.7)' }}>
//               <NumberListIcon fontSize="small" />
//             </IconButton>
//             <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.7)' }}>
//               <CodeIcon fontSize="small" />
//             </IconButton>
//           </Box>
          
//           {/* Message input */}
//           <TextField
//             multiline
//             placeholder="Message Risharth Pardeshi"
//             fullWidth
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             sx={{
//               '& .MuiOutlinedInput-root': {
//                 padding: 1.5,
//                 color: 'white',
//               },
//               '& .MuiOutlinedInput-notchedOutline': {
//                 border: 'none'
//               }
//             }}
//             inputProps={{ style: { color: 'white' } }}
//           />
//         </Box>
        
//         {/* Action buttons */}
//         <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//           <Box>
//             <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.7)' }}>
//               <AttachFileIcon fontSize="small" />
//             </IconButton>
//             <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.7)' }}>
//               <EmojiIcon fontSize="small" />
//             </IconButton>
//             <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.7)' }}>
//               <MicIcon fontSize="small" />
//             </IconButton>
//           </Box>
//           <Box sx={{ display: 'flex', alignItems: 'center' }}>
//             <ExpandMoreIcon 
//               fontSize="small" 
//               sx={{ 
//                 color: 'rgba(255,255,255,0.7)',
//                 mr: 1,
//                 cursor: 'pointer'
//               }}
//             />
//           </Box>
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default DMInterface;




import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, Typography, Avatar, IconButton, TextField, Divider, Badge, Tooltip 
} from '@mui/material';
import {
  FormatBold as BoldIcon,
  FormatItalic as ItalicIcon,
  StrikethroughS as StrikethroughIcon,
  InsertLink as LinkIcon,
  FormatListBulleted as BulletListIcon,
  FormatListNumbered as NumberListIcon,
  Code as CodeIcon,
  MoreVert as MoreVertIcon,
  Close as CloseIcon,
  EmojiEmotions as EmojiIcon,
  AttachFile as AttachFileIcon,
  Mic as MicIcon,
  KeyboardArrowDown as ExpandMoreIcon,
} from '@mui/icons-material';

const DMInterface = ({ selectedUser }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]); // State for storing messages
  const messagesEndRef = useRef(null); // Ref for auto-scrolling

  // Scroll to the bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle sending messages
  const sendMessage = (e) => {
    if (e.key === 'Enter' && message.trim() !== '') {
      const newMessage = {
        id: messages.length + 1,
        sender: 'You',
        content: message,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100%',
        bgcolor: '#2F3136', 
        color: 'white'
      }}
    >

      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 1.5,
          marginTop: "500px",
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', padding: 1 }}>
          <Avatar src={selectedUser?.avatar} sx={{ marginRight: 1 }} /> 
          <Typography variant="h6" sx={{ fontWeight: 500 }}>
            {selectedUser ? selectedUser.fullName : 'Select a user'}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title="Call">
            <IconButton sx={{ color: 'white' }}>
              <Badge color="success" badgeContent=" " variant="dot" />
            </IconButton>
          </Tooltip>
          <IconButton size="small" sx={{ color: 'white', mx: 1 }}>
            <MoreVertIcon />
          </IconButton>
          <IconButton size="small" sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>
      
      {/* Tabs */}
      <Box sx={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.3)' }}>
        <Box sx={{ py: 1.5, px: 2, borderBottom: '2px solid white', fontWeight: 'bold' }}>
          Messages
        </Box>
        <Box sx={{ py: 1.5, px: 2, color: 'rgba(255,255,255,0.6)', cursor: 'pointer', '&:hover': { color: 'rgba(255,255,255,0.8)' } }}>
          Add canvas
        </Box>
        <Box sx={{ px: 1, py: 1.5, color: 'rgba(255,255,255,0.6)' }}>+</Box>
      </Box>
      
      {/* Chat area */}
      <Box 
        sx={{ 
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          overflowY: 'auto',
          p: 2
        }}
      >
        {/* Display messages dynamically */}
        {messages.length > 0 ? (
          messages.map((msg) => (
            <Box key={msg.id} sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
              <Avatar sx={{ mr: 1.5, width: 36, height: 36 }}>{msg.sender.charAt(0)}</Avatar>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{msg.sender}</Typography>
                  <Typography variant="caption" sx={{ ml: 1, color: 'rgba(255,255,255,0.5)' }}>{msg.timestamp}</Typography>
                </Box>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', backgroundColor: '#3F4247', borderRadius: '8px', padding: '8px', maxWidth: '70%' }}>
                  {msg.content}
                </Typography>
              </Box>
            </Box>
          ))
        ) : (
          
         <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', mt: 3 }}>
  {new Date().toLocaleString()}  
  <br />
  Start a conversation...
</Typography>

        )}

        <div ref={messagesEndRef} />
      </Box>
      
      {/* Message composer */}
      <Box sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.3)', position: 'sticky', bottom: 0 }}>
        <Box sx={{ border: '1px solid rgba(255,255,255,0.3)', borderRadius: 1, mb: 1 }}>
          {/* Formatting toolbar */}
          <Box sx={{ display: 'flex', alignItems: 'center', p: 1, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.7)' }}><BoldIcon fontSize="small" /></IconButton>
            <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.7)' }}><ItalicIcon fontSize="small" /></IconButton>
            <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.7)' }}><StrikethroughIcon fontSize="small" /></IconButton>
            <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.7)' }}><LinkIcon fontSize="small" /></IconButton>
            <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.7)' }}><BulletListIcon fontSize="small" /></IconButton>
            <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.7)' }}><NumberListIcon fontSize="small" /></IconButton>
            <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.7)' }}><CodeIcon fontSize="small" /></IconButton>
          </Box>
          
          {/* Message input */}
          <TextField
            multiline
            placeholder={`Message ${selectedUser?.fullName || ''}`}
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={sendMessage}
            sx={{
              '& .MuiOutlinedInput-root': { padding: 1.5, color: 'white' },
              '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
            }}
            inputProps={{ style: { color: 'white' } }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default DMInterface;
