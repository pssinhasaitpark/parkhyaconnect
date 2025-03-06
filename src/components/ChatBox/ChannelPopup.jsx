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
  Alert
} from '@mui/material';

const ChannelPopup = ({ open, handleClose }) => {
  const dispatch = useDispatch();
  const [channelName, setChannelName] = useState('');
  const [description, setDescription] = useState('');
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createChannel({ name: channelName, description }))
      .unwrap()
      .then(() => {
        setNotification({ open: true, message: 'Channel created successfully!', severity: 'success' });
        handleClose();
        setChannelName('');
        setDescription('');
      })
      .catch((error) => {
        setNotification({ open: true, message: error, severity: 'error' });
      });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Create Channel</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Channel Name"
          type="text"
          fullWidth
          variant="outlined"
          value={channelName}
          onChange={(e) => setChannelName(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Description"
          type="text"
          fullWidth
          variant="outlined"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Create
        </Button>
      </DialogActions>
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
