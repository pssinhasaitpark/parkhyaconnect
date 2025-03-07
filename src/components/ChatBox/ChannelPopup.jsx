import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createChannel } from '../../redux/channelsSlice';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Snackbar,
  Alert,
  FormControlLabel,
  Checkbox,
  FormHelperText,
  CircularProgress
} from '@mui/material';

const ChannelPopup = ({ open, handleClose }) => {
  const dispatch = useDispatch();
  const [channelName, setChannelName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  const [nameError, setNameError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate channel name
    if (!channelName.trim()) {
      setNameError('Channel name is required');
      return;
    }
    
    setLoading(true);
    dispatch(createChannel({ name: channelName, description, isPrivate }))
      .unwrap()
      .then(() => {
        setNotification({ open: true, message: 'Channel created successfully!', severity: 'success' });
        handleClose();
        // Reset form
        setChannelName('');
        setDescription('');
        setIsPrivate(false);
        setNameError('');
      })
      .catch((error) => {
        setNotification({ open: true, message: error || 'Failed to create channel', severity: 'error' });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'channelName') {
      setChannelName(value);
      // Clear error when user types
      if (value.trim()) {
        setNameError('');
      }
    } else if (name === 'description') {
      setDescription(value);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Create Channel</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Channel Name"
            name="channelName"
            type="text"
            fullWidth
            variant="outlined"
            value={channelName}
            onChange={handleInputChange}
            error={!!nameError}
            helperText={nameError}
            required
            disabled={loading}
          />
          <TextField
            margin="dense"
            label="Description (optional)"
            name="description"
            type="text"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={description}
            onChange={handleInputChange}
            disabled={loading}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                name="isPrivate"
                color="primary"
                disabled={loading}
              />
            }
            label="Private channel"
          />
          <FormHelperText>
            Private channels are only visible to their members
          </FormHelperText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" disabled={loading}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            color="primary" 
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Create"}
          </Button>
        </DialogActions>
      </form>
      <Snackbar 
        open={notification.open} 
        autoHideDuration={4000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default ChannelPopup;