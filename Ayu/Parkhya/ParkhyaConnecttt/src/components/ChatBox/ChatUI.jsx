import React, { useState } from 'react';
import { useSelector } from 'react-redux'; // Import useSelector to access Redux state
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  TextField,
  createTheme,
  ThemeProvider,
  CircularProgress
} from '@mui/material';
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  EmojiEmotions as EmojiIcon,
  RecordVoiceOver as VoiceIcon
} from '@mui/icons-material';

// Create a custom theme with dark mode
const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#121212',
      paper: '#1E1E1E'
    }
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#2C2C2C',
            borderRadius: '8px'
          }
        }
      }
    }
  }
});

const SlackChatUI = () => {
  const [message, setMessage] = useState('');

  // Use useSelector to get the selectedUser from the Redux state
  const { selectedUser } = useSelector((state) => state.auth);
  const error = useSelector((state) => state.auth.error);

  const errorMessage = error ? (
    <Typography sx={{ color: 'red', textAlign: 'center' }}>{error}</Typography>
  ) : null;

  const handleSendMessage = () => {
    if (message.trim()) {
      // Implement message sending logic here
      setMessage('');
    }
  };

  // If selectedUser is null or undefined, handle rendering
  const user = selectedUser?.data || null;

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          width: '79vw',
          backgroundColor: theme.palette.background.default
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: 3,
            borderBottom: '1px solid rgba(255,255,255,0.12)'
          }}
        >
          {/* Display user's avatar */}
          <Avatar
            src={user?.avatar || '/path/to/default/avatar.png'}
            sx={{ mr: 2, bgcolor: 'orange' }}
          />

          <Typography variant="h6" sx={{ color: 'white' }}>
            {errorMessage}
            {user ? user.fullName : (user === null ? 'Error loading user' : <CircularProgress color="inherit" />)}
          </Typography>

          {/* <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center', mb: 2 }}>
            {user ? user.fullName : 'Loading...'}
          </Typography> */}
        </Box>

        {/* Message Area */}
        <Box
          sx={{
            flexGrow: 1,
            overflowY: 'auto',
            p: 3,
            backgroundColor: theme.palette.background.paper
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255,255,255,0.7)',
              textAlign: 'center',
              mb: 2
            }}
          >
            Wednesday, 26 February
          </Typography>

          <Box sx={{ display: 'flex', mb: 2 }}>
            <Avatar sx={{ mr: 2, bgcolor: 'green' }}>A</Avatar>
            <Box>
              <Typography
                variant="subtitle2"
                sx={{ color: 'white', mb: 0.5 }}
              >
                <Typography
                  component="span"
                  sx={{
                    color: 'rgba(255,255,255,0.5)',
                    ml: 1,
                    fontSize: '0.75rem'
                  }}
                >
                  12:57 PM
                </Typography>
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Message Input */}
        <Box
          sx={{
            p: 2,
            borderTop: '1px solid rgba(255,255,255,0.12)',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <IconButton>
            <AttachFileIcon sx={{ color: 'white' }} />
          </IconButton>
          <IconButton>
            <EmojiIcon sx={{ color: 'white' }} />
          </IconButton>
          <TextField
            fullWidth
            variant="outlined"
            placeholder={`Message ${user?.fullName || 'Loading...'}`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            sx={{
              mx: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px'
              }
            }}
            InputProps={{
              sx: {
                color: 'white',
                '&::placeholder': {
                  color: 'rgba(255,255,255,0.5)'
                }
              }
            }}
          />
          <IconButton>
            <VoiceIcon sx={{ color: 'white' }} />
          </IconButton>
          <IconButton
            onClick={handleSendMessage}
            disabled={!message.trim()}
          >
            <SendIcon color={message.trim() ? 'primary' : 'disabled'} />
          </IconButton>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default SlackChatUI;
